import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  Brain, Upload, User, Calendar, Ruler, Weight, Droplet,
  MapPin, Phone, Mail, LogOut, Menu, X, Loader2 ,CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UploadAnalysis() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);


  // ✅ Fetch logged-in user profile + patient info
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        navigate('/login');
        return;
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      setProfile(profileData);

      // If patient, fetch patient info too
      if (profileData.user_type === 'patient') {
        const { data: patientDetails, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (patientError) {
          console.error('Error fetching patient data:', patientError);
          return;
        }

        setPatientData(patientDetails);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };
// Handles drag events (for visual feedback)
const handleDrag = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.type === "dragenter" || e.type === "dragover") {
    setDragActive(true);
  } else if (e.type === "dragleave") {
    setDragActive(false);
  }
};

// Handles when a file is dropped into the drop zone
const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);

  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    handleFileUpload(e.dataTransfer.files[0]);
  }
};

// Handles when a file is selected manually via the input
const handleFileChange = (e) => {
  e.preventDefault();
  if (e.target.files && e.target.files[0]) {
    handleFileUpload(e.target.files[0]);
  }
};

  const handleFileUpload = async (file) => {
  setUploadedFile(file);
  setIsAnalyzing(true);

  try {
    if (!patientData?.id) {
      alert("Patient information not found. Please log in again.");
      return;
    }

    // ✅ Prepare data to send to FastAPI backend
    const formData = new FormData();
    formData.append("file", file);
    formData.append("patient_id", patientData.id); // Send actual UUID from Supabase
    formData.append("patient_name", profile.full_name);

    // ✅ Call FastAPI backend
    const response = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error(`Backend error: ${response.statusText}`);

    const result = await response.json();
    console.log("✅ Analysis result from backend:", result);

    // ✅ Save analysis metadata to Supabase
    const { data: analysisInsert, error: analysisError } = await supabase
      .from("analysis_results")
      .insert([
        {
          scan_id: result.scan_id || null,
          tumor_detected: result.tumor_detected,
          confidence: result.confidence,
          tumor_type: result.tumor_type,
          tumor_size: result.tumor_size,
          tumor_location: result.tumor_location,
          tumor_volume: result.tumor_volume,
          severity: result.severity,
          description: result.description,
          recommendations: result.recommendations
            ? JSON.stringify(result.recommendations)
            : null,
          ai_model: result.ai_model || "DenseNet-121",
          processing_time: result.processing_time,
          slices_analyzed: result.slices_analyzed,
        },
      ])
      .select();

    if (analysisError) console.error("⚠️ Supabase insert error:", analysisError);

    // ✅ Store backend result for frontend display
    setAnalysisResults(result);
    setAnalysisComplete(true);

    // ✅ Navigate to report page (only after everything completes)
    navigate("/report");
  } catch (error) {
    console.error("❌ Error during analysis:", error);
    alert("Error analyzing MRI scan. Please try again.");
  } finally {
    setIsAnalyzing(false);
  }
};


  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
        <span className="ml-3 text-purple-600 font-semibold">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white bg-opacity-90 backdrop-blur-xl border-b-2 border-purple-200 sticky top-0 z-40 shadow-md">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-purple-100 rounded-lg transition-colors lg:hidden"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-2 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Brainalyze
              </h1>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-white bg-opacity-90 backdrop-blur-xl border-r-2 border-purple-200 transition-transform duration-300 z-30 overflow-y-auto`}
        >
          <div className="p-6 space-y-6">
            <div className="text-center pb-6 border-b-2 border-purple-200">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{profile.full_name}</h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                {profile.user_type}
              </span>
            </div>

            {/* Patient Details */}
            {profile.user_type === 'patient' && patientData && (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Date of Birth</p>
                    <p className="text-sm text-gray-800">{patientData.date_of_birth}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-xl">
                  <Ruler className="w-5 h-5 text-pink-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Height</p>
                    <p className="text-sm text-gray-800">{patientData.height} cm</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                  <Weight className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Weight</p>
                    <p className="text-sm text-gray-800">{patientData.weight} kg</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-xl">
                  <Droplet className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Blood Group</p>
                    <p className="text-sm text-gray-800">{patientData.blood_group}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Address</p>
                    <p className="text-sm text-gray-800">{patientData.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-xl">
                  <Phone className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Phone</p>
                    <p className="text-sm text-gray-800">{patientData.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content — your upload area remains here */}
        <main className="flex-1 p-6 lg:p-8 space-y-6">
          {/* Upload Section */}
          <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-purple-200 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Upload MRI Scan</h2>
                <p className="text-sm text-gray-500">Upload .nii, .nii.gz, DICOM, or standard image formats</p>
              </div>
            </div>

            {/* Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-4 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50'
              }`}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".nii,.nii.gz,.dcm,.jpg,.jpeg,.png"
              />
              
              {!uploadedFile ? (
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-800 mb-2">
                        Drop your MRI scan here or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports: .nii, .nii.gz, DICOM, JPG, PNG (Max 100MB)
                      </p>
                    </div>
                    <button className="px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all transform hover:scale-105">
                      Select File
                    </button>
                  </div>
                </label>
              ) : (
                <div className="space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                  <div>
                    <p className="text-xl font-bold text-gray-800">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  {isAnalyzing && (
                    <div className="flex items-center justify-center space-x-3">
                      <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                      <span className="text-purple-600 font-semibold">Analyzing MRI scan...</span>
                    </div>
                  )}
                  {!isAnalyzing && !analysisComplete && (
                    <button
                      onClick={() => {
                        setIsAnalyzing(true);
                        setTimeout(() => {
                          setIsAnalyzing(false);
                          setAnalysisComplete(true);
                        }, 3000);
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      Start Analysis
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setAnalysisComplete(false);
                      setIsAnalyzing(false);
                    }}
                    className="ml-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Upload Different File
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Analysis Results Section */}
          {analysisComplete && (
            <div className="space-y-6 animate-fade-in">
              {/* Results Summary */}
              <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-purple-200 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                    {/* <Activity className="w-6 h-6 text-white" /> */}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
                    <p className="text-sm text-gray-500">AI-powered tumor detection complete</p>
                  </div>
                </div>

                {/* Alert Banner */}
                <div className={`p-4 rounded-xl mb-6 flex items-start space-x-3 ${
                  analysisResults.tumorDetected 
                    ? 'bg-red-50 border-2 border-red-300' 
                    : 'bg-green-50 border-2 border-green-300'
                }`}>
                  <AlertCircle className={`w-6 h-6 mt-0.5 ${
                    analysisResults.tumorDetected ? 'text-red-600' : 'text-green-600'
                  }`} />
                  <div>
                    <p className={`font-bold ${
                      analysisResults.tumorDetected ? 'text-red-800' : 'text-green-800'
                    }`}>
                      {analysisResults.tumorDetected ? 'Tumor Detected' : 'No Tumor Detected'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Confidence: {analysisResults.confidence}%
                    </p>
                  </div>
                </div>

                {/* Key Findings Grid */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-300">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Tumor Type</p>
                    <p className="text-lg font-bold text-gray-800">{analysisResults.tumorType}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-300">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Size</p>
                    <p className="text-lg font-bold text-gray-800">{analysisResults.tumorSize}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border-2 border-pink-300">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Location</p>
                    <p className="text-lg font-bold text-gray-800">{analysisResults.tumorLocation}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200 mb-6">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Detailed Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{analysisResults.description}</p>
                </div>

                {/* Recommendations */}
                <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <h3 className="font-bold text-gray-800 mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {analysisResults.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 3D Visualization & Tumor Region */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* 3D View */}
                <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-purple-200 p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Brain className="w-6 h-6 mr-2 text-purple-600" />
                    3D MRI Visualization
                  </h3>
                  <div className="aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    {/* Placeholder for 3D visualization - integrate Three.js here */}
                    <div className="text-center">
                      <Brain className="w-32 h-32 text-purple-400 mx-auto mb-4 animate-pulse" />
                      <p className="text-white text-sm">3D Brain Model</p>
                      <p className="text-gray-400 text-xs mt-2">Interactive view will load here</p>
                    </div>
                    <div className="absolute bottom-4 right-4 space-x-2">
                      <button className="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg text-xs hover:bg-opacity-30">
                        Rotate
                      </button>
                      <button className="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg text-xs hover:bg-opacity-30">
                        Zoom
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tumor Region */}
                <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-purple-200 p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <MapPin className="w-6 h-6 mr-2 text-pink-600" />
                    Tumor Region Mapping
                  </h3>
                  <div className="aspect-square bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl flex items-center justify-center relative border-2 border-pink-200">
                    {/* Placeholder for tumor region visualization */}
                    <div className="text-center">
                      <div className="relative w-48 h-48 mx-auto mb-4">
                        <div className="absolute inset-0 bg-blue-200 opacity-30 rounded-full"></div>
                        <div className="absolute top-8 right-8 w-20 h-20 bg-red-500 opacity-70 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Brain className="w-32 h-32 text-purple-300" />
                        </div>
                      </div>
                      <div className="flex items-center justify-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-blue-300 rounded-full"></div>
                          <span className="text-gray-600">Healthy Tissue</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                          <span className="text-gray-600">Tumor Region</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Report Button */}
              <div className="text-center">
                <button className="px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Download Complete Report (PDF)</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
