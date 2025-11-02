import React, { useState, useEffect, useRef } from "react";
import {
  Brain,
  Download,
  MessageCircle,
  X,
  Send,
  Bot,
  AlertCircle,
  Activity,
  FileText,
  CheckCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Shield,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Report() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      type: "bot",
      message:
        "Hello! I'm your medical AI assistant. How can I help you understand your report?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const reportRef = useRef();
  const chatEndRef = useRef();

  // ✅ Fetch latest report and Grad-CAM visualization (UNCHANGED)
  useEffect(() => {
    const fetchReport = async () => {
      try {
        // ✅ Get the logged-in user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
          setReportData(null);
          setLoading(false);
          return;
        }

        // ✅ Get patient id linked to user
        const { data: patientData, error: patientError } = await supabase
          .from("patients")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        if (patientError) throw patientError;
        if (!patientData) {
          setReportData(null);
          setLoading(false);
          return;
        }

        // ✅ Get the latest report
        const { data: reportList, error: reportError } = await supabase
          .from("reports")
          .select("*")
          .eq("patient_id", patientData.id)
          .order("generated_at", { ascending: false })
          .limit(1);
        if (reportError) throw reportError;
        if (!reportList || reportList.length === 0) {
          setReportData(null);
          setLoading(false);
          return;
        }

        const latestReport = reportList[0];
        console.log("🧾 Latest report:", latestReport);

        // ✅ Fetch matching analysis result
        const { data: analysisData, error: analysisError } = await supabase
          .from("analysis_results")
          .select("*")
          .eq("id", latestReport.analysis_id)
          .maybeSingle();
        if (analysisError) throw analysisError;

        console.log("🔍 Matched analysis data:", analysisData);
        const { data: allAnalyses } = await supabase
          .from("analysis_results")
          .select("id");
        console.log("📋 All analysis IDs:", allAnalyses);

        // ✅ Merge both
        const merged = { ...latestReport, ...analysisData };
        setReportData(merged);
      } catch (err) {
        console.error("❌ Error fetching report:", err);
        setReportData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // 💬 Handle chatbot (UNCHANGED)
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMsg = inputMessage;
    setChatMessages([...chatMessages, { type: "user", message: userMsg }]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(userMsg);
      setChatMessages((prev) => [
        ...prev,
        { type: "bot", message: botResponse },
      ]);
      setIsTyping(false);
    }, 800);
  };

  const getBotResponse = (message) => {
    const lower = message.toLowerCase();
    if (lower.includes("tumor"))
      return `The AI detected a ${
        reportData?.tumor_type || "tumor"
      }. Please consult your neurologist.`;
    if (lower.includes("confidence"))
      return `The model's confidence is ${
        reportData?.confidence
          ? (reportData.confidence * 100).toFixed(2)
          : "N/A"
      }%.`;
    if (lower.includes("treatment"))
      return "Treatment depends on tumor type and severity — consult your specialist.";
    return "Try asking about tumor type, confidence, or treatment.";
  };

  // 🧾 Generate PDF with image support
  const handleDownloadPDF = async () => {
    const reportElement = reportRef.current;
    if (!reportElement) return;

    const canvas = await html2canvas(reportElement, { 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(
      `Brainalyze_Report_${new Date().toISOString().split("T")[0]}.pdf`
    );
  };

  // 🕓 Enhanced Loading State
  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
            <Brain className="w-12 h-12 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-gray-700 text-lg font-semibold animate-pulse">
            Loading your report...
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Retrieving your medical analysis
          </p>
        </div>
      </div>
    );

  // Enhanced No Data State
  if (!reportData)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md text-center border-2 border-red-100 animate-fade-in">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No Report Found
          </h3>
          <p className="text-gray-600 leading-relaxed">
            We couldn't locate any medical reports for your account. Please
            upload an MRI scan to generate a report.
          </p>
        </div>
      </div>
    );

  const formattedDate = reportData.generated_at
    ? new Date(reportData.generated_at).toLocaleString()
    : "N/A";

  const confidencePercentage = reportData.confidence
  ? reportData.confidence.toFixed(2)
  : "N/A";


  const confidenceColor =
    reportData.confidence >= 0.9
      ? "text-green-600"
      : reportData.confidence >= 0.7
      ? "text-yellow-600"
      : "text-red-600";
  const confidenceBg =
    reportData.confidence >= 0.9
      ? "bg-green-50"
      : reportData.confidence >= 0.7
      ? "bg-yellow-50"
      : "bg-red-50";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      {/* Enhanced Animated Header */}
      <header className="bg-white bg-opacity-95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 shadow-lg animate-slide-down">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-3 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Brainalyze
                </h1>
                <p className="text-xs text-gray-500">
                  AI-Powered Medical Reports
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 font-semibold transform hover:scale-105 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Status Banner - Animated */}
      <div className="max-w-7xl mx-auto px-6 mt-8 animate-fade-in-up">
        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center animate-pulse-slow">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Report Generated Successfully
                </h3>
                <p className="text-sm text-gray-600">
                  Your MRI analysis is complete and ready for review
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Report with Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Confidence Score Card */}
          <div className="lg:col-span-1 animate-fade-in-left">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-lg">
                  Confidence Score
                </h3>
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div
                className={`${confidenceBg} border-2 ${
                  confidenceColor.includes("green")
                    ? "border-green-200"
                    : confidenceColor.includes("yellow")
                    ? "border-yellow-200"
                    : "border-red-200"
                } rounded-xl p-6 mb-4`}
              >
                <div className={`text-5xl font-bold ${confidenceColor} mb-2`}>
                  {confidencePercentage}%
                </div>
                <p className="text-sm text-gray-600">Detection Accuracy</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full transition-all duration-1000 ease-out animate-progress"
                  style={{ width: `${confidencePercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 mt-6 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900 text-lg">
                  Quick Overview
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Tumor Type
                    </p>
                    <p className="text-sm text-gray-600">
                      {reportData.tumor_type || "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Severity Level
                    </p>
                    <p className="text-sm text-gray-600">
                      {reportData.severity || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Report Content */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in-right">
            {/* PDF-Friendly Report Section */}
            <div ref={reportRef} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-purple-700 mb-2">
                  Brainalyze MRI Report
                </h2>
                <p className="text-gray-600 text-base">Medical Analysis Report</p>
              </div>

              {/* Report Details */}
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-semibold mb-1">Tumor Type:</p>
                  <p className="text-gray-700">{reportData.tumor_type || "Unknown"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-semibold mb-1">Confidence:</p>
                  <p className="text-gray-700">{confidencePercentage}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-semibold mb-1">Severity:</p>
                  <p className="text-gray-700">{reportData.severity || "N/A"}</p>
                </div>
              </div>

              {/* Clinical Description */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
                <div className="flex items-center space-x-2 mb-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900 text-lg">
                    Clinical Description
                  </h3>
                </div>
                <p className="text-gray-800 leading-relaxed">
                  {reportData.description || "N/A"}
                </p>
              </div>

              {/* Recommendations */}
              {Array.isArray(reportData.recommendations) && (
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-xl text-gray-900">
                      Medical Recommendations
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {reportData.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200"
                      >
                        <div className="w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-gray-800 leading-relaxed pt-1">
                          {rec}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Visualization */}
              {reportData.gradcam_url && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-900">
                      AI Visualization (Grad-CAM)
                    </h3>
                  </div>
                  <div className="rounded-lg overflow-hidden border-2 border-gray-300">
                    <img
                      src={reportData.gradcam_url}
                      alt="Grad-CAM"
                      className="w-full h-auto"
                    />
                  </div>
                  <p className="text-gray-700 text-sm mt-3 text-center">
                    Heatmap highlights tumor-affected regions detected by the AI model
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Chat Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 z-50 flex items-center justify-center group"
      >
        {chatOpen ? (
          <X className="w-7 h-7 transition-transform duration-300 group-hover:rotate-90" />
        ) : (
          <>
            <MessageCircle className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
          </>
        )}
      </button>

      {/* Enhanced Chatbot Window */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-[420px] h-[600px] bg-white rounded-3xl shadow-2xl border-2 border-gray-200 flex flex-col z-50 animate-slide-up overflow-hidden">
          {/* Chat Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Bot className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">
                  Medical AI Assistant
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-purple-100">
                    Online • Ready to help
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                } animate-message-in`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                    msg.type === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm"
                      : "bg-white border-2 border-purple-200 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-message-in">
                <div className="bg-white border-2 border-purple-200 p-4 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t-2 border-gray-200 bg-white rounded-b-3xl">
            <div className="flex items-end space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about your report..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-sm transition-colors duration-300"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes message-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes progress {
          from {
            width: 0;
          }
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.6s ease-out;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-message-in {
          animation: message-in 0.3s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-progress {
          animation: progress 1s ease-out;
        }
      `}</style>
    </div>
  );
}