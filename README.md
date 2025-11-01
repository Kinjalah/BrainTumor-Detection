# 🧠 Brainalyze – AI-Powered Brain Tumor Report Viewer

Brainalyze is a medical AI web app built with **React + Supabase** that allows patients to view their AI-generated MRI analysis reports, Grad-CAM visualizations, and model insights.

---

## 🚀 Features

- Secure **Supabase authentication**
- Dynamic **patient → report → analysis** relationship
- Automatic fetching of the **latest report**
- PDF report viewer & Grad-CAM image display
- Interactive **AI chatbot** for report explanation
- Clean and responsive **Tailwind UI**

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (reports & Grad-CAM images) |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/PradnyaKulkarni2005/BrainTumor-Detection.git
cd brainalyze
```
---
### 2️⃣ Install dependencies
```bash
pnpm install
```
---
### 3️⃣ Create a .env file
```bash
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```
⚠️ Never expose your service role key in the frontend.
Use only the anon key here.
---
### 4️⃣ Supabase Database Setup

### Create the following tables in your Supabase SQL editor:
```bash
-- PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date_of_birth DATE,
  age INT,
  gender TEXT,
  height FLOAT,
  weight FLOAT,
  blood_group TEXT,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ANALYSIS_RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tumor_type TEXT,
  confidence FLOAT,
  description TEXT,
  severity TEXT,
  recommendations TEXT[],
  tumor_size TEXT,
  tumor_location TEXT,
  tumor_volume TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID REFERENCES public.analysis_results(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  report_pdf_url TEXT,
  gradcam_url TEXT,
  generated_at TIMESTAMPTZ DEFAULT now()
);
```
---
### 5️⃣ Enable Row Level Security (RLS)

#### Turn on RLS for each table, then add these policies:

```bash
-- PATIENTS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for logged-in user"
ON patients FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow insert for logged-in user"
ON patients FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- REPORTS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select reports for patient"
ON reports FOR SELECT
USING (EXISTS (
  SELECT 1 FROM patients p WHERE p.id = reports.patient_id AND p.user_id = auth.uid()
));

CREATE POLICY "Allow insert reports for system"
ON reports FOR INSERT
USING (true);

-- ANALYSIS RESULTS
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select analysis results for all"
ON analysis_results FOR SELECT
USING (true);

CREATE POLICY "Allow insert analysis results for system"
ON analysis_results FOR INSERT
USING (true);
```
---

### 6️⃣ Set Up Supabase Storage Buckets

#### Bucket name: reports → stores PDF reports

#### Bucket name: gradcam → stores Grad-CAM visualizations

#### Each object’s public URL should be saved in the report_pdf_url or gradcam_url columns respectively.

Example URL:
```bash
https://yourprojectid.supabase.co/storage/v1/object/public/reports/report_123.pdf
```
---
### 7️⃣ Run the Frontend
```bash
pnpm run dev
```
#### Then open:
👉 http://localhost:5173/report
---

## 🧾 How It Works
### 🔹 Authentication

#### Supabase Auth handles login.

#### supabase.auth.getUser() retrieves the logged-in user’s ID.

### 🔹 Fetching Logic (in Report.jsx)

#### Find patients row where user_id = auth.user.id

#### Fetch the latest report for that patient.

#### Fetch the associated analysis_results row (if analysis_id exists).

#### Merge both into one object for display.

### 🔹 Display

#### Displays:

```bash
tumor_type

confidence

description

severity

recommendations

report_pdf_url

gradcam_url
```
---

#### Provides “Download PDF” and “View Full Report” buttons.

### 🔹 Chatbot

#### A simple local bot powered by keywords like “tumor”, “confidence”, or “treatment”.

#### Helps users interpret their results.

### 🧪 Debugging Tips

#### If you see ⚠️ No report found for this patient.:

#### Open DevTools → Console → check logs from:

#### auth.getUser()

#### patients query

#### reports query

#### analysis_results query

#### Make sure your logged-in user has a row in patients.

#### Verify the patient’s id matches a row in reports.patient_id.

#### If all data exists, check RLS policies again — missing SELECT policies block frontend access.
---
### 📤 Example Data
```bash
patients
id	user_id	gender	age
3b716ab4-8f13-4d04-9e81-2056066aa954	37aa7da3-6da2-40ed-9426-b416075cdec0	female	20
reports
id	patient_id	analysis_id	report_pdf_url	generated_at
c9b4a3e7-7d0c-4d0f-9004-89fd2783326f	3b716ab4-8f13-4d04-9e81-2056066aa954	4d83d85b-74a3-4c89-856a-a71491535fac	https://.../report_abc.pdf
	2025-10-29
analysis_results
id	tumor_type	confidence	severity
4d83d85b-74a3-4c89-856a-a71491535fac	Glioma	0.95	High
```
### 🧑‍💻 Developer Notes

#### Keep RLS and Supabase client keys in sync.

#### supabaseClient.js must use the anon key for browser-side access.

#### If you add new columns (like gradcam_url), update both DB schema and Report.jsx accordingly.

#### All times are UTC (generated_at).
