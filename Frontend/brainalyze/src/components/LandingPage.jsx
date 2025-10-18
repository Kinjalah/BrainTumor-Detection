import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Shield, Zap, Users, ChevronRight, Activity, Microscope, FileText, Award, Clock, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (window.scrollY > 300) {
        setAnimateStats(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200 opacity-30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-200 opacity-30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white bg-opacity-80 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-2.5 rounded-2xl shadow-lg transform hover:scale-110 transition-transform">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Brainalyze
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">How It Works</a>
              <a href="#about" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">About</a>
              <Link to="/login">
  <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-2xl hover:shadow-purple-500 transition-all duration-300 font-semibold transform hover:scale-105">
    Login
  </button>
</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 relative z-10">
              <div className="inline-block animate-bounce">
                <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 rounded-full text-blue-700 text-sm font-bold shadow-md">
                  🧠 AI-Powered Diagnostics
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                Advanced Brain
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                  Tumor Detection
                </span>
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                Revolutionizing neurological diagnostics with cutting-edge deep learning. Fast, accurate, and reliable MRI analysis that empowers healthcare professionals to make confident decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
  <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-purple-500 transition-all duration-300 font-bold text-lg flex items-center justify-center transform hover:scale-105">
    Get Started Free
    <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
  </button>
</Link>
                <button className="px-8 py-4 bg-white border-2 border-purple-300 text-purple-700 rounded-2xl hover:bg-purple-50 transition-all duration-300 font-bold text-lg shadow-md hover:shadow-xl">
                  Watch Demo 🎥
                </button>
              </div>
              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="text-center p-4 bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
                  <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">98.5%</div>
                  <div className="text-sm text-gray-600 font-semibold">Accuracy</div>
                </div>
                <div className="text-center p-4 bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
                  <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">15K+</div>
                  <div className="text-sm text-gray-600 font-semibold">Scans</div>
                </div>
                <div className="text-center p-4 bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
                  <div className="text-3xl font-black bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">&lt;90s</div>
                  <div className="text-sm text-gray-600 font-semibold">Analysis</div>
                </div>
              </div>
            </div>
            
            {/* Animated 3D Brain Visualization Mockup */}
            <div className="relative z-10">
              <div className="relative bg-white bg-opacity-80 backdrop-blur-xl border-2 border-purple-200 rounded-3xl p-8 shadow-2xl">
                {/* Brain Scan Preview */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Live MRI Analysis</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold animate-pulse">● Processing</span>
                  </div>
                  <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-6 h-64 flex items-center justify-center overflow-hidden">
                    {/* Animated Brain Scan Lines */}
                    <div className="absolute inset-0">
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
                      <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute top-2/4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
                      <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" style={{animationDelay: '1.5s'}}></div>
                    </div>
                    <Brain className="w-32 h-32 text-purple-600 animate-pulse" />
                  </div>
                </div>

                {/* Status Cards */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-300 shadow-md transform hover:scale-105 transition-transform">
                    <div className="flex items-center space-x-3">
                      <Activity className="text-blue-600 w-5 h-5" />
                      <span className="font-bold text-gray-800">3D Visualization</span>
                    </div>
                    <CheckCircle className="text-green-500 w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-300 shadow-md transform hover:scale-105 transition-transform">
                    <div className="flex items-center space-x-3">
                      <Microscope className="text-purple-600 w-5 h-5" />
                      <span className="font-bold text-gray-800">Tumor Detection</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border border-pink-300 shadow-md transform hover:scale-105 transition-transform">
                    <div className="flex items-center space-x-3">
                      <FileText className="text-pink-600 w-5 h-5" />
                      <span className="font-bold text-gray-800">Report Generation</span>
                    </div>
                    <Clock className="text-orange-500 w-5 h-5 animate-spin" style={{animationDuration: '3s'}} />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">Analysis Progress</span>
                    <span className="text-sm font-bold text-purple-600">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000 animate-pulse" style={{width: '78%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-6 bg-white bg-opacity-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-purple-300 rounded-full text-purple-700 text-sm font-bold">
                ✨ Cutting-Edge Technology
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4">
              Why Choose <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Brainalyze?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Advanced features designed for precision, speed, and reliability in neurological diagnostics</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl w-fit mb-6 group-hover:rotate-6 transition-transform shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Deep Learning AI</h3>
              <p className="text-gray-700 leading-relaxed">
                Advanced DenseNet neural network trained on 50,000+ MRI scans ensures the highest accuracy in tumor detection and classification across all brain regions.
              </p>
            </div>
            <div className="group p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl w-fit mb-6 group-hover:rotate-6 transition-transform shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Lightning Fast</h3>
              <p className="text-gray-700 leading-relaxed">
                Upload 3D MRI scans and receive comprehensive analysis with detailed visualizations in under 90 seconds. No more waiting hours for results.
              </p>
            </div>
            <div className="group p-8 bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-300 rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-br from-pink-500 to-blue-600 p-4 rounded-2xl w-fit mb-6 group-hover:rotate-6 transition-transform shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">HIPAA Compliant</h3>
              <p className="text-gray-700 leading-relaxed">
                Enterprise-grade security with end-to-end encryption, secure cloud storage, and full HIPAA compliance for complete patient data protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4">
              Simple <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">3-Step Process</span>
            </h2>
            <p className="text-xl text-gray-600">From scan to diagnosis in minutes</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="bg-white border-2 border-blue-300 rounded-3xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
                <div className="absolute -top-6 -left-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl group-hover:rotate-12 transition-transform">
                  1
                </div>
                <div className="mb-4 mt-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Upload MRI Scan</h3>
                <p className="text-gray-600 leading-relaxed">
                  Drag and drop or browse to upload 3D MRI scans. Supports DICOM, NIfTI, and standard medical imaging formats with instant preview.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="bg-white border-2 border-purple-300 rounded-3xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
                <div className="absolute -top-6 -left-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl group-hover:rotate-12 transition-transform">
                  2
                </div>
                <div className="mb-4 mt-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                    <Brain className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">AI Processing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our DenseNet model analyzes the scan through advanced 3D to 2D slicing, performing comprehensive tumor detection across all brain regions.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="bg-white border-2 border-pink-300 rounded-3xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
                <div className="absolute -top-6 -left-6 bg-gradient-to-br from-pink-500 to-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl group-hover:rotate-12 transition-transform">
                  3
                </div>
                <div className="mb-4 mt-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-blue-100 rounded-2xl flex items-center justify-center">
                    <Award className="w-8 h-8 text-pink-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Get Detailed Report</h3>
                <p className="text-gray-600 leading-relaxed">
                  Receive comprehensive results with interactive 3D visualization, tumor detection metrics, region mapping, and downloadable diagnostic reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="bg-white bg-opacity-80 backdrop-blur-xl border-2 border-purple-300 rounded-3xl p-12 shadow-2xl">
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-5 rounded-3xl w-fit mx-auto mb-8 animate-pulse">
              <Users className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Join 500+ Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Transform your diagnostic workflow with AI-powered precision. Start detecting brain tumors faster and more accurately today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
  <button className="px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-purple-500 transition-all duration-300 font-bold text-lg transform hover:scale-110">
    Start Free Trial 🚀
  </button>
</Link>
              <button className="px-10 py-5 bg-white border-2 border-purple-300 text-purple-700 rounded-2xl hover:bg-purple-50 transition-all duration-300 font-bold text-lg shadow-md hover:shadow-xl">
                Schedule Demo
              </button>
            </div>
            <p className="mt-6 text-sm text-gray-500">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-white bg-opacity-70 backdrop-blur-sm border-t-2 border-purple-200 py-12 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-2 rounded-2xl shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Brainalyze</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Revolutionizing brain tumor detection with advanced artificial intelligence.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-800">Product</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-800">Company</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-800">Legal</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">HIPAA Compliance</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-purple-200 mt-12 pt-8 text-center text-gray-600 text-sm">
            <p className="font-semibold">© 2025 Brainalyze. Empowering healthcare with artificial intelligence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}