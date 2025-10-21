import React, { useState } from 'react';
import { Brain, Download, MessageCircle, X, Send, User, Calendar, FileText, Activity, AlertCircle, TrendingUp, MapPin, Printer, Share2, ChevronDown, ChevronUp, Bot } from 'lucide-react';

export default function Report() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Hello! I\'m your medical AI assistant. How can I help you understand your report?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    findings: true,
    recommendations: true,
    technical: false
  });

  // Sample report data
  const reportData = {
    patientInfo: {
      name: 'John Anderson',
      patientId: 'PAT-2024-001',
      age: 39,
      gender: 'Male',
      scanDate: 'January 15, 2025',
      reportDate: 'January 15, 2025',
      referringPhysician: 'Dr. Sarah Mitchell'
    },
    scanInfo: {
      modality: 'MRI Brain',
      sequence: 'T1-weighted, T2-weighted, FLAIR',
      contrast: 'Gadolinium-based contrast agent',
      scanner: 'Siemens Magnetom Skyra 3T'
    },
    diagnosis: {
      primary: 'Glioblastoma (Grade IV)',
      confidence: 94.5,
      severity: 'High',
      status: 'Newly Diagnosed'
    },
    tumorCharacteristics: {
      location: 'Right Frontal Lobe',
      size: '3.2 x 2.8 x 2.5 cm',
      volume: '23.5 cm³',
      enhancement: 'Heterogeneous ring enhancement',
      borders: 'Irregular, infiltrative',
      peritumoral: 'Significant vasogenic edema',
      massEffect: 'Mild midline shift (3mm to left)'
    },
    findings: [
      'Large heterogeneously enhancing mass in the right frontal lobe',
      'Central necrosis with irregular thick rim enhancement',
      'Surrounding FLAIR hyperintensity consistent with vasogenic edema',
      'Mild mass effect with compression of right lateral ventricle',
      'No evidence of hemorrhage or calcification',
      'No significant restricted diffusion within the lesion'
    ],
    recommendations: [
      'Immediate neurosurgical consultation for surgical planning',
      'Molecular profiling including IDH mutation, MGMT methylation status',
      'Baseline functional MRI and DTI for surgical planning',
      'Multidisciplinary tumor board discussion',
      'Consider enrollment in clinical trials',
      'Follow-up MRI in 4-6 weeks post-treatment initiation'
    ],
    aiAnalysis: {
      model: 'DenseNet-121 Custom Architecture',
      accuracy: '94.5%',
      processingTime: '1.8 seconds',
      slicesAnalyzed: 156
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setChatMessages([...chatMessages, { type: 'user', message: inputMessage }]);
      setInputMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = getBotResponse(inputMessage);
        setChatMessages(prev => [...prev, { type: 'bot', message: botResponse }]);
      }, 1000);
    }
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('tumor') || lowerMessage.includes('glioblastoma')) {
      return 'Glioblastoma is a grade IV brain tumor. The report shows a 3.2cm tumor in the right frontal lobe with 94.5% confidence. Would you like to know more about treatment options?';
    } else if (lowerMessage.includes('treatment') || lowerMessage.includes('therapy')) {
      return 'Treatment typically involves surgery, radiation therapy, and chemotherapy. Your report recommends immediate neurosurgical consultation. I can explain each treatment modality if you\'d like.';
    } else if (lowerMessage.includes('prognosis') || lowerMessage.includes('survival')) {
      return 'I understand this is concerning. Prognosis varies based on many factors including molecular profile, age, and response to treatment. Please discuss this with your oncologist for personalized information.';
    } else if (lowerMessage.includes('size')) {
      return 'The tumor measures 3.2 x 2.8 x 2.5 cm with a volume of 23.5 cm³. This is considered a moderate-sized lesion. Early detection and treatment are important.';
    }
    return 'I can help explain any part of your report. Try asking about the tumor, treatment options, or specific medical terms you\'d like clarified.';
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <header className="bg-white bg-opacity-90 backdrop-blur-xl border-b-2 border-purple-200 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-2 rounded-xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Brainalyze
                </h1>
                <p className="text-xs text-gray-500">Medical Report Portal</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all font-semibold transform hover:scale-105">
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-all font-semibold transform hover:scale-105">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold transform hover:scale-105">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Report Header Card */}
        <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-purple-200 p-8 mb-6 animate-fade-in">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
                Brain MRI Analysis Report
              </h2>
              <p className="text-gray-500">AI-Powered Diagnostic Analysis</p>
            </div>
            <div className="text-right">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300 rounded-xl">
                <p className="text-xs text-red-600 font-semibold">PRIORITY</p>
                <p className="text-sm font-bold text-red-700">High Severity</p>
              </div>
            </div>
          </div>

          {/* Patient & Scan Info Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Patient Information */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Patient Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold text-gray-800">{reportData.patientInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Patient ID:</span>
                  <span className="font-semibold text-gray-800">{reportData.patientInfo.patientId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age / Gender:</span>
                  <span className="font-semibold text-gray-800">{reportData.patientInfo.age} / {reportData.patientInfo.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Scan Date:</span>
                  <span className="font-semibold text-gray-800">{reportData.patientInfo.scanDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Report Date:</span>
                  <span className="font-semibold text-gray-800">{reportData.patientInfo.reportDate}</span>
                </div>
              </div>
            </div>

            {/* Scan Information */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-600" />
                Scan Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Modality:</span>
                  <span className="font-semibold text-gray-800">{reportData.scanInfo.modality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sequence:</span>
                  <span className="font-semibold text-gray-800 text-right">T1, T2, FLAIR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contrast:</span>
                  <span className="font-semibold text-gray-800 text-right">Gadolinium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Scanner:</span>
                  <span className="font-semibold text-gray-800 text-right">Siemens 3T</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnosis Summary - Prominent Card */}
        <div className="bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 border-3 border-red-300 rounded-3xl shadow-2xl p-8 mb-6 animate-fade-in">
          <div className="flex items-start space-x-4">
            <div className="p-4 bg-red-500 rounded-2xl">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-extrabold text-gray-800 mb-2">Primary Diagnosis</h3>
              <p className="text-3xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-3">
                {reportData.diagnosis.primary}
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-white rounded-xl shadow-md">
                  <span className="text-xs text-gray-500">AI Confidence</span>
                  <p className="text-lg font-bold text-purple-600">{reportData.diagnosis.confidence}%</p>
                </div>
                <div className="px-4 py-2 bg-white rounded-xl shadow-md">
                  <span className="text-xs text-gray-500">Severity</span>
                  <p className="text-lg font-bold text-red-600">{reportData.diagnosis.severity}</p>
                </div>
                <div className="px-4 py-2 bg-white rounded-xl shadow-md">
                  <span className="text-xs text-gray-500">Status</span>
                  <p className="text-lg font-bold text-gray-800">{reportData.diagnosis.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {/* Tumor Characteristics */}
          <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-purple-200 overflow-hidden animate-fade-in">
            <button
              onClick={() => toggleSection('overview')}
              className="w-full p-6 flex items-center justify-between hover:bg-purple-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-800">Tumor Characteristics</h3>
              </div>
              {expandedSections.overview ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
            </button>
            {expandedSections.overview && (
              <div className="p-6 pt-0 grid md:grid-cols-2 gap-4 animate-fade-in">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Location</p>
                  <p className="text-sm font-bold text-gray-800">{reportData.tumorCharacteristics.location}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Size (LxWxH)</p>
                  <p className="text-sm font-bold text-gray-800">{reportData.tumorCharacteristics.size}</p>
                </div>
                <div className="p-4 bg-pink-50 rounded-xl">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Volume</p>
                  <p className="text-sm font-bold text-gray-800">{reportData.tumorCharacteristics.volume}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Enhancement Pattern</p>
                  <p className="text-sm font-bold text-gray-800">{reportData.tumorCharacteristics.enhancement}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Border Characteristics</p>
                  <p className="text-sm font-bold text-gray-800">{reportData.tumorCharacteristics.borders}</p>
                </div>
                <div className="p-4 bg-pink-50 rounded-xl">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Peritumoral Changes</p>
                  <p className="text-sm font-bold text-gray-800">{reportData.tumorCharacteristics.peritumoral}</p>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Findings */}
          <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-purple-200 overflow-hidden animate-fade-in">
            <button
              onClick={() => toggleSection('findings')}
              className="w-full p-6 flex items-center justify-between hover:bg-purple-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Detailed Findings</h3>
              </div>
              {expandedSections.findings ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
            </button>
            {expandedSections.findings && (
              <div className="p-6 pt-0 animate-fade-in">
                <ul className="space-y-3">
                  {reportData.findings.map((finding, index) => (
                    <li key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{finding}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-purple-200 overflow-hidden animate-fade-in">
            <button
              onClick={() => toggleSection('recommendations')}
              className="w-full p-6 flex items-center justify-between hover:bg-purple-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-800">Clinical Recommendations</h3>
              </div>
              {expandedSections.recommendations ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
            </button>
            {expandedSections.recommendations && (
              <div className="p-6 pt-0 animate-fade-in">
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                  <ul className="space-y-3">
                    {reportData.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <p className="text-gray-700 leading-relaxed font-medium">{rec}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* AI Analysis Details */}
          <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-purple-200 overflow-hidden animate-fade-in">
            <button
              onClick={() => toggleSection('technical')}
              className="w-full p-6 flex items-center justify-between hover:bg-purple-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Brain className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-800">AI Analysis Technical Details</h3>
              </div>
              {expandedSections.technical ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
            </button>
            {expandedSections.technical && (
              <div className="p-6 pt-0 grid md:grid-cols-4 gap-4 animate-fade-in">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl text-center border-2 border-purple-200">
                  <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">AI Model</p>
                  <p className="text-sm font-bold text-gray-800">{reportData.aiAnalysis.model}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl text-center border-2 border-blue-200">
                  <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">Accuracy</p>
                  <p className="text-sm font-bold text-gray-800">{reportData.aiAnalysis.accuracy}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl text-center border-2 border-pink-200">
                  <Activity className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">Processing Time</p>
                  <p className="text-sm font-bold text-gray-800">{reportData.aiAnalysis.processingTime}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl text-center border-2 border-purple-200">
                  <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">Slices Analyzed</p>
                  <p className="text-sm font-bold text-gray-800">{reportData.aiAnalysis.slicesAnalyzed}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-2xl animate-fade-in">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-yellow-800 mb-2">Important Disclaimer</h4>
              <p className="text-sm text-yellow-700 leading-relaxed">
                This report is generated by AI-powered analysis and should be used as a supplementary tool. 
                Final diagnosis and treatment decisions must be made by qualified healthcare professionals based on 
                comprehensive clinical evaluation. Please consult with your physician for medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500 transition-all transform hover:scale-110 z-50 animate-bounce"
      >
        {chatOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </button>

      {/* Chatbot Window */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-3xl shadow-2xl border-2 border-purple-200 flex flex-col z-50 animate-fade-in">
          {/* Chat Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-t-3xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Bot className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-white">Medical AI Assistant</h3>
                <p className="text-xs text-purple-100">Ask me about your report</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white border-2 border-purple-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t-2 border-purple-200 bg-white rounded-b-3xl">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about your report..."
                className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}