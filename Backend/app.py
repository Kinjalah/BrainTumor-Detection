from fastapi import FastAPI, File, UploadFile, HTTPException, Form  # ✅ Added Form here
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import torch
import shutil
from datetime import datetime
from supabase import create_client
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
import uuid
import cv2
import numpy as np
from PIL import Image
import traceback
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# === Local modules ===
from modules.input_loader import load_mri
from modules.preprocessing import preprocess_volume, preprocess_slice
from modules.inference import load_model, predict_scan
from modules.visualization import generate_gradcam, overlay_heatmap_on_slice

# === FastAPI setup ===
app = FastAPI(title="Brain Tumor Classification API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Device and model ===
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODEL = load_model(device=DEVICE)

# === Upload directory ===
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# === Supabase configuration ===
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("❌ Missing SUPABASE_URL or SUPABASE_KEY in environment variables.")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# === Helper: Generate text summary ===
def generate_text_report(prediction: str, confidence: float) -> str:
    return (
        f"<b>Prediction:</b> {prediction}<br/>"
        f"<b>AI Confidence:</b> {confidence:.2f}%<br/><br/>"
        "🧠 This report was generated using an AI-powered model trained to analyze MRI brain scans. "
        "It detects abnormal tissue regions and predicts tumor categories using deep learning. "
        "Please consult a medical professional for confirmation."
    )

# === Helper: Create PDF report ===
def create_pdf_report(text, filename="report.pdf"):
    report_path = os.path.join(UPLOAD_DIR, filename)
    doc = SimpleDocTemplate(report_path, pagesize=A4)
    styles = getSampleStyleSheet()
    content = [
        Paragraph("Brain MRI AI Diagnostic Report", styles["Title"]),
        Spacer(1, 0.2 * inch),
        Paragraph(text, styles["BodyText"]),
    ]
    doc.build(content)
    return report_path


# === 🔥 Unified Analyze Endpoint ===
@app.post("/analyze")
async def analyze(file: UploadFile = File(...), patient_id: str = Form(...)):
    print(f"🧾 Received patient_id: {patient_id}")

    try:
        # Step 1: Save uploaded file locally
        filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Step 2: Load and preprocess MRI
        volume = load_mri(file_path)
        processed_slices = preprocess_volume(volume)

        # Step 3: Predict tumor type
        label, confidence = predict_scan(MODEL, processed_slices, device=DEVICE)

        # Step 4: Generate Grad-CAM visualization
        mid_index = volume.shape[-1] // 2
        slice_2d = volume[:, :, mid_index]
        input_tensor = preprocess_slice(slice_2d).unsqueeze(0).to(DEVICE)
        cam = generate_gradcam(MODEL, input_tensor)
        overlay = overlay_heatmap_on_slice(slice_2d, cam)

        gradcam_filename = f"gradcam_{uuid.uuid4()}.png"
        gradcam_path = os.path.join(UPLOAD_DIR, gradcam_filename)
        cv2.imwrite(gradcam_path, overlay)

        # Step 5: Create PDF report
        report_text = generate_text_report(label, confidence)
        report_filename = f"report_{uuid.uuid4()}.pdf"
        report_path = create_pdf_report(report_text, report_filename)

       # Step 6: Upload to Supabase Storage
        try:
            # Upload Report PDF
            with open(report_path, "rb") as f:
                supabase.storage.from_("reports").upload(
                    path=report_filename,
                    file=f,
                    file_options={"cache-control": "3600", "upsert": "true"}
                )
            report_url = supabase.storage.from_("reports").get_public_url(report_filename)
            os.remove(report_path)

            # Upload Grad-CAM image
            with open(gradcam_path, "rb") as f:
                supabase.storage.from_("gradcam").upload(
                    path=gradcam_filename,
                    file=f,
                    file_options={"cache-control": "3600", "upsert": "true"}
                )
            gradcam_url = supabase.storage.from_("gradcam").get_public_url(gradcam_filename)
            os.remove(gradcam_path)

            print(f"✅ Uploaded report: {report_url}")
            print(f"✅ Uploaded gradcam: {gradcam_url}")

        except Exception as upload_error:
            print("⚠️ Upload to Supabase failed:", upload_error)
            report_url = None
            gradcam_url = None

        # Step 7: Insert into analysis_results
        analysis_result = supabase.table("analysis_results").insert({
            "scan_id": None,
            "tumor_detected": label.lower() != "no tumor",
            "confidence": confidence,
            "tumor_type": label,
            "severity": "high" if confidence > 80 else "medium",
            "description": "AI analyzed MRI scan and predicted tumor classification.",
            "recommendations": [
                "Consult your neurologist for further review.",
                "Schedule a follow-up MRI in 3 months.",
                "Maintain a record of this report for clinical use."
            ],
            "ai_model": "DenseNet-121",
            "processing_time": 0.0,
            "slices_analyzed": len(processed_slices),
        }).execute()

        analysis_id = analysis_result.data[0]["id"]

        # Step 8: Insert into reports table
        report_insert = supabase.table("reports").insert({
        "analysis_id": analysis_id,
        "patient_id": patient_id,
        "report_pdf_url": report_url,
        "gradcam_url": gradcam_url  # ✅ new column
    }).execute()

        # Step 9: Clean up uploaded MRI file
        if os.path.exists(file_path):
            os.remove(file_path)

        # ✅ Step 10: Return to frontend
        return JSONResponse({
            "tumorDetected": label.lower() != "no tumor",
            "confidence": round(confidence, 2),
            "tumorType": label,
            "report_pdf_url": report_url,
            "gradcam_url": gradcam_url,
            "message": "✅ Analysis complete and report generated successfully."
        })

    except Exception as e:
        print("❌ Error in /analyze:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
