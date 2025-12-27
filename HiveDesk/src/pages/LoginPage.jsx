// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaGoogle, FaEye, FaEyeSlash, FaBuilding, FaRocket } from 'react-icons/fa';
import { authAPI, saveAuthData } from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setLoading(true);

    try {
      // Call API login
      const response = await authAPI.login(formData.email, formData.password);
      
      if (response.success) {
        const data = response.data;
        
        // Extract token - adjust based on your API response structure
        const token = data.access_token || data.token;
        
        if (!token) {
          toast.error('No authentication token received');
          setLoading(false);
          return;
        }
        
        // Create user data
        const userData = {
          email: formData.email,
          name: formData.email.split('@')[0],
          // Determine role from email or response
          role: data.role || (formData.email.includes('hr') ? 'hr' : 'employee')
        };
        
        // Save to localStorage
        saveAuthData(token, userData);
        
        toast.success(`Welcome back, ${userData.name}! 🎉`);
        
        // Navigate based on role - SIMPLE DIRECT NAVIGATION
        if (userData.role === 'hr') {
          navigate('/hr-dashboard');
        } else {
          navigate('/employee-dashboard');
        }
      } else {
        toast.error(response.error || 'Login failed!');
        
        // For demo purposes - navigate directly if API fails
        if (formData.email === 'hr@company.com' && formData.password === 'password') {
          const userData = {
            email: formData.email,
            name: 'HR User',
            role: 'hr'
          };
          saveAuthData('demo-token-hr', userData);
          navigate('/hr-dashboard');
        } else if (formData.email === 'employee@company.com' && formData.password === 'password') {
          const userData = {
            email: formData.email,
            name: 'Employee User',
            role: 'employee'
          };
          saveAuthData('demo-token-employee', userData);
          navigate('/employee-dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo login function
  const handleDemoLogin = (role) => {
    setLoading(true);
    
    const demoCredentials = {
      hr: { email: 'hr@company.com', password: 'password', name: 'HR Manager' },
      employee: { email: 'employee@company.com', password: 'password', name: 'John Employee' }
    };
    
    const demo = demoCredentials[role];
    
    // Simulate API call
    setTimeout(() => {
      const userData = {
        email: demo.email,
        name: demo.name,
        role: role
      };
      
      saveAuthData(`demo-token-${role}`, userData);
      toast.success(`Welcome, ${demo.name}! (Demo Mode)`);
      
      if (role === 'hr') {
        navigate('/hr-dashboard');
      } else {
        navigate('/employee-dashboard');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full">
                <FaBuilding className="text-4xl text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              HR Onboarding System
            </h1>
            <p className="text-blue-100">
              Login to your dashboard
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pl-10"
                    placeholder="you@company.com"
                    required
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pl-10 pr-12"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 ${
                  loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FaRocket />
                    Sign In
                  </div>
                )}
              </button>

              {/* Signup Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                    Request Access
                  </Link>
                </p>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-8 mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Quick Access</span>
                </div>
              </div>
            </div>

            {/* Demo Login Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('hr')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
              >
                <FaBuilding />
                Demo HR Login
              </button>
              
              <button
                type="button"
                onClick={() => handleDemoLogin('employee')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 font-medium"
              >
                👤 Demo Employee Login
              </button>
              
              <button
                type="button"
                onClick={() => toast.info('Google authentication will be available soon')}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700"
                disabled={loading}
              >
                <FaGoogle className="text-red-500" />
                Sign in with Google
              </button>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">ℹ️</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Note:</span> Use demo buttons for quick access.
                For real login, use your company credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;