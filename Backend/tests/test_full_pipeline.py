# tests/test_full_pipeline.py

import torch
from modules.input_loader import load_mri
from modules.preprocessing import preprocess_volume
from modules.inference import load_model, predict_scan

# --- Configuration ---
# Corrected path to point to the 'data' folder
FILE_PATH = r"C:\BrainTumorClassification\Backend\data\3dsampleimg.nii" 
# Use 'cuda' if you have a GPU and PyTorch with CUDA support installed
DEVICE = "cuda" if torch.cuda.is_available() else "cpu" 

# --- Main Pipeline ---
def run_pipeline():
    # 1. Load 3D MRI Scan
    print(f"Step 1: Loading MRI scan from: {FILE_PATH}...")
    try:
        volume = load_mri(FILE_PATH)
        print(f"-> Success. Volume shape: {volume.shape}")
    except Exception as e:
        print(f"-> Error loading file: {e}")
        return

    # 2. Preprocess Volume -> 2D Slices
    print("\nStep 2: Preprocessing volume into model-ready slices...")
    processed_slices = preprocess_volume(volume)
    print(f"-> Success. Extracted and preprocessed {len(processed_slices)} slices.")

    # 3. Load Model
    print(f"\nStep 3: Loading pre-trained DenseNet-121 model onto {DEVICE}...")
    model = load_model(device=DEVICE)

    # 4. Run Inference
    print("\nStep 4: Running inference on all slices...")
    label, confidence = predict_scan(model, processed_slices, device=DEVICE)

    # 5. Display Results
    print("\n--- FINAL PREDICTION ---")
    print(f"Result: {label}")
    print(f"Confidence Score: {confidence:.4f}")
    print("------------------------")

if __name__ == "__main__":
    run_pipeline()