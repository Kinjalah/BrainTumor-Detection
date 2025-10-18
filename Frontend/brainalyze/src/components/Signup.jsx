import React, { useState } from 'react';
import { Brain, Mail, Lock, Eye, EyeOff, UserCircle, Stethoscope, User, Phone, Calendar, Ruler, Weight, Users } from 'lucide-react';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState('patient'); // 'patient' or 'radiologist'
  const [currentStep, setCurrentStep] = useState(1); // Multi-step form for patients

  // Patient Form Data
  const [patientData, setPatientData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    weight: '',
    bloodGroup: '',
    address: ''
  });

  // Radiologist Form Data
  const [radiologistData, setRadiologistData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    licenseNumber: '',
    specialization: '',
    hospital: '',
    experience: ''
  });

  const handlePatientChange = (e) => {
    setPatientData({
      ...patientData,
      [e.target.name]: e.target.value
    });
  };

  const handleRadiologistChange = (e) => {
    setRadiologistData({
      ...radiologistData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = userType === 'patient' ? patientData : radiologistData;
    
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    console.log('Signup submitted:', { ...data, userType });
    // Handle signup logic here - connect to your backend API
  };

  const nextStep = () => {
    // Validate current step before proceeding
    const { fullName, email, password, confirmPassword, phone } = patientData;
    if (!fullName || !email || !password || !confirmPassword || !phone) {
      alert('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-6 py-12">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200 opacity-30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
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
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Create Your Account</h2>
          <p className="text-gray-600">Join us for advanced brain tumor detection</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
          {/* User Type Selection */}
          <div className="flex gap-4 mb-8">
            <button
              type="button"
              onClick={() => {
                setUserType('patient');
                setCurrentStep(1);
              }}
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
              onClick={() => {
                setUserType('radiologist');
                setCurrentStep(1);
              }}
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

          {/* Progress Indicator (Only for Patients) */}
          {userType === 'patient' && (
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div className={`flex items-center ${currentStep >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>1</div>
                  <span className="ml-2 text-sm font-semibold">Account</span>
                </div>
                <div className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center ${currentStep >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>2</div>
                  <span className="ml-2 text-sm font-semibold">Details</span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* PATIENT FORM */}
            {userType === 'patient' && (
              <>
                {/* Step 1: Account Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="fullName"
                          value={patientData.fullName}
                          onChange={handlePatientChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={patientData.email}
                          onChange={handlePatientChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          name="phone"
                          value={patientData.phone}
                          onChange={handlePatientChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={patientData.password}
                          onChange={handlePatientChange}
                          required
                          minLength="8"
                          className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                          placeholder="Create a password (min 8 characters)"
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

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={patientData.confirmPassword}
                          onChange={handlePatientChange}
                          required
                          className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500 transition-all duration-300 transform hover:scale-105 mt-6"
                    >
                      Next Step →
                    </button>
                  </div>
                )}

                {/* Step 2: Personal Details */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={patientData.dateOfBirth}
                            onChange={handlePatientChange}
                            required
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <select
                            name="gender"
                            value={patientData.gender}
                            onChange={handlePatientChange}
                            required
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white appearance-none"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Height (cm)</label>
                        <div className="relative">
                          <Ruler className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="number"
                            name="height"
                            value={patientData.height}
                            onChange={handlePatientChange}
                            required
                            min="50"
                            max="300"
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                            placeholder="Height in cm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Weight (kg)</label>
                        <div className="relative">
                          <Weight className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="number"
                            name="weight"
                            value={patientData.weight}
                            onChange={handlePatientChange}
                            required
                            min="20"
                            max="300"
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                            placeholder="Weight in kg"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Blood Group</label>
                      <select
                        name="bloodGroup"
                        value={patientData.bloodGroup}
                        onChange={handlePatientChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                      <textarea
                        name="address"
                        value={patientData.address}
                        onChange={handlePatientChange}
                        required
                        rows="3"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                        placeholder="Enter your full address"
                      ></textarea>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all duration-300"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500 transition-all duration-300 transform hover:scale-105"
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* RADIOLOGIST FORM */}
            {userType === 'radiologist' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="fullName"
                      value={radiologistData.fullName}
                      onChange={handleRadiologistChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                      placeholder="Dr. John Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={radiologistData.email}
                        onChange={handleRadiologistChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                        placeholder="Email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={radiologistData.phone}
                        onChange={handleRadiologistChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                        placeholder="Phone"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Medical License Number</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={radiologistData.licenseNumber}
                      onChange={handleRadiologistChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                      placeholder="License #"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      value={radiologistData.specialization}
                      onChange={handleRadiologistChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                      placeholder="Neuroradiology"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Hospital/Clinic Name</label>
                  <input
                    type="text"
                    name="hospital"
                    value={radiologistData.hospital}
                    onChange={handleRadiologistChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                    placeholder="Enter hospital/clinic name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Years of Experience</label>
                  <input
                    type="number"
                    name="experience"
                    value={radiologistData.experience}
                    onChange={handleRadiologistChange}
                    required
                    min="0"
                    max="50"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                    placeholder="Years of experience"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={radiologistData.password}
                      onChange={handleRadiologistChange}
                      required
                      minLength="8"
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                      placeholder="Create a password (min 8 characters)"
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

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={radiologistData.confirmPassword}
                      onChange={handleRadiologistChange}
                      required
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-pink-500 transition-all duration-300 transform hover:scale-105 mt-6"
                >
                  Create Radiologist Account
                </button>
              </div>
            )}
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-bold text-purple-600 hover:text-purple-700">
                Sign In
              </a>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}