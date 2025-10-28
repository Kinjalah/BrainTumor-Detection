import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, Eye, EyeOff, UserCircle, Stethoscope } from 'lucide-react';
import { supabase } from '../lib/supabaseClient'; // ✅ Make sure your Supabase client is imported

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🟣 Attempting login for', userType);

      // Step 1: Authenticate the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (signInError) throw signInError;

      console.log('✅ Authenticated user:', signInData.user);

      // Step 2: Ensure session is active
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error('No active session found.');

      const userId = sessionData.session.user.id;

      // Step 3: Fetch profile to determine user type
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      console.log('✅ Profile fetched:', profileData);

      // Step 4: Route user based on stored user type
      const profileType = profileData.user_type;
      if (profileType === 'patient') {
        console.log('🩺 Redirecting to patient dashboard...');
        navigate('/upload');
      } else if (profileType === 'radiologist') {
        console.log('🧠 Redirecting to radiologist dashboard...');
        navigate('/radiologist-dashboard');
      } else {
        throw new Error('Unknown user type.');
      }

    } catch (error) {
      console.error('❌ Login error:', error);
      alert(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-6 py-12">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200 opacity-30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Brainalyze
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to access your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
          {/* User Type Selection */}
          <div className="flex gap-4 mb-8">
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                userType === 'patient'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <UserCircle className="w-5 h-5" />
              <span>Patient</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType('radiologist')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                userType === 'radiologist'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Stethoscope className="w-5 h-5" />
              <span>Radiologist</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-purple-600 hover:text-purple-700">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 font-bold rounded-xl transition-all duration-300 transform ${
                loading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-2xl hover:shadow-purple-500 hover:scale-105'
              }`}
            >
              {loading ? 'Signing In...' : `Sign In as ${userType === 'patient' ? 'Patient' : 'Radiologist'}`}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-purple-600 hover:text-purple-700">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Protected by enterprise-grade security & HIPAA compliant
        </p>
      </div>
    </div>
  );
}
