// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaEye,
  FaEyeSlash,
  FaRocket,
  FaBuilding,
  FaUserTie,
  FaSignInAlt
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { authAPI } from '../services/api';
// import { Logo }from './assets/HiveDeskLogo.png';


const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  // Demo credentials for both roles
  const DEMO_CREDENTIALS = {
    hr: {
      email: 'hr@company.com',
      password: 'password',
      name: 'HR Manager'
      // removed redirect property
    },
    employee: {
      email: 'employee@company.com',
      password: 'password',
      name: 'John Employee'
      // removed redirect property
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setApiError(''); // Clear any previous errors
    // Auto-fill demo credentials for quick testing
    setFormData({
      email: DEMO_CREDENTIALS[role].email,
      password: DEMO_CREDENTIALS[role].password
    });
    toast.success(`${role.toUpperCase()} role selected`);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setApiError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  console.log('Login attempt started...');
  console.log('Selected role:', selectedRole);
  console.log('Form data:', formData);
  
  if (!selectedRole) {
    toast.error('Please select a role first');
    return;
  }
  
  setLoading(true);
  setApiError('');

  try {
    // For demo purposes, use mock login if using demo credentials
    const isDemoLogin = 
      (selectedRole === 'hr' && formData.email === DEMO_CREDENTIALS.hr.email) ||
      (selectedRole === 'employee' && formData.email === DEMO_CREDENTIALS.employee.email);

    console.log('Is demo login?', isDemoLogin);

    if (isDemoLogin) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user data
      const mockUser = {
        id: `demo-${Date.now()}`,
        name: DEMO_CREDENTIALS[selectedRole].name,
        email: formData.email,
        role: selectedRole,
        is_active: true,
        onboarding_progress: selectedRole === 'employee' ? 45 : 0
      };

      console.log('Created mock user:', mockUser);

      // Save to localStorage
      localStorage.setItem('token', `demo-token-${Date.now()}`);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast.success(`Welcome ${mockUser.name}!`);
      
      // DYNAMIC REDIRECT BASED ON SELECTED ROLE
      const targetRoute = `/${selectedRole}-dashboard`;
      console.log(`Navigating to: ${targetRoute}`);
      
      // Try using navigate first
      navigate(targetRoute);
      
      // If navigate doesn't work after 1 second, use window.location
      setTimeout(() => {
        if (window.location.pathname !== targetRoute) {
          console.log('Navigate() failed, using window.location.href');
          window.location.href = targetRoute;
        }
      }, 1000);
      
    } else {
      // Real API call
      console.log('Attempting real API login...');
      const response = await authAPI.login(formData.email, formData.password);
      console.log('API response:', response);

      if (response.success) {
        // Check if role matches selected role
        if (response.data.user.role !== selectedRole) {
          setApiError(`Please use ${response.data.user.role.toUpperCase()} login instead`);
          toast.error('Role mismatch detected');
          return;
        }

        // Save token and user data
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        toast.success('Login successful!');

        // DYNAMIC REDIRECT BASED ON USER ROLE FROM API
        const targetRoute = `/${response.data.user.role}-dashboard`;
        console.log(`Navigating to: ${targetRoute}`);
        
        // Try using navigate first
        navigate(targetRoute);
        
        // If navigate doesn't work after 1 second, use window.location
        setTimeout(() => {
          if (window.location.pathname !== targetRoute) {
            console.log('Navigate() failed, using window.location.href');
            window.location.href = targetRoute;
          }
        }, 1000);
      } else {
        setApiError(response.error);
        toast.error(response.error);
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error.response?.data?.detail || 'Login failed. Please try again.';
    setApiError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
    console.log('Login attempt finished');
  }
};

const handleQuickLogin = (role) => {
  console.log('Quick login for role:', role);
  setSelectedRole(role);
  // setFormData({
  //   email: DEMO_CREDENTIALS[role].email,
  //   password: DEMO_CREDENTIALS[role].password
  // });
  
  // Auto-login after a brief delay
  setTimeout(() => {
    console.log('Executing quick login...');
    
    // Create mock user data
    // const mockUser = {
    //   id: `demo-quick-${Date.now()}`,
    //   name: DEMO_CREDENTIALS[role].name,
    //   email: DEMO_CREDENTIALS[role].email,
    //   role: role,
    //   is_active: true,
    //   onboarding_progress: role === 'employee' ? 45 : 0
    // };

    console.log('Created mock user for quick login:', mockUser);

    // Save to localStorage
    localStorage.setItem('token', `demo-token-quick-${Date.now()}`);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    toast.success(`Welcome ${mockUser.name}!`);
    
    // DYNAMIC REDIRECT BASED ON SELECTED ROLE
    const targetRoute = `/${role}-dashboard`;
    console.log(`Quick login navigating to: ${targetRoute}`);
    
    // Try using navigate first
    navigate(targetRoute);
    
    // If navigate doesn't work after 0.5 seconds, use window.location
    setTimeout(() => {
      if (window.location.pathname !== targetRoute) {
        console.log('Quick login: navigate() failed, using window.location.href');
        window.location.href = targetRoute;
      }
    }, 500);
  }, 300);
};

  // const handleQuickLogin = (role) => {
  //   setSelectedRole(role);
  //   setFormData({
  //     email: DEMO_CREDENTIALS[role].email,
  //     password: DEMO_CREDENTIALS[role].password
  //   });

  //   // Auto-submit after a brief delay
  //   setTimeout(() => {
  //     const mockEvent = { preventDefault: () => {} };
  //     handleSubmit(mockEvent);
  //   }, 300);
  // };

  const resetForm = () => {
    setSelectedRole(null);
    setFormData({ email: '', password: '' });
    setApiError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-4xl">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* Left Side - Branding */}
          <div className="md:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col justify-center text-white">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  {/* <img
                    src={{Logo}}
                    alt="Hive Desk Logo"
                    className="h-16 w-16 object-contain rounded-lg"
                  /> */}
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-3">
                Hive Desk Portal
              </h1>
              <p className="text-blue-100 text-lg">
                Smart Employee Onboarding System
              </p>
            </div>

            <div className="space-y-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <h3 className="font-semibold text-lg mb-2">🚀 Quick Access</h3>
                <p className="text-blue-100 text-sm">
                  Select your role and use demo credentials for instant access
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <h3 className="font-semibold text-lg mb-2">🔐 Secure Login</h3>
                <p className="text-blue-100 text-sm">
                  Role-based access with JWT authentication
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="md:w-3/5 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600 mb-8">Sign in to your account</p>

            {/* Role Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Select Your Role <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('employee')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${selectedRole === 'employee'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  disabled={loading}
                >
                  <FaUser className="h-8 w-8 mb-2" />
                  <span className="font-semibold">Employee</span>
                  <span className="text-xs text-gray-500 mt-1">Access your dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('hr')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${selectedRole === 'hr'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  disabled={loading}
                >
                  <FaUserTie className="h-8 w-8 mb-2" />
                  <span className="font-semibold">HR Manager</span>
                  <span className="text-xs text-gray-500 mt-1">Manage employees</span>
                </button>
              </div>
            </div>

            {/* Login Form */}
            {selectedRole && (
              <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pl-12"
                      placeholder="you@company.com"
                      required
                      disabled={loading}
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className={`h-5 w-5 ${selectedRole === 'hr' ? 'text-purple-500' : 'text-blue-500'}`} />
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pl-12 pr-12"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
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

                {/* Error Message */}
                {apiError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fadeIn">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                          <span className="text-red-600 font-bold">!</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Login Error</h3>
                        <p className="text-sm text-red-700 mt-1">{apiError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : selectedRole === 'hr'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                      } shadow-md hover:shadow-lg`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <FaSignInAlt />
                        Sign In as {selectedRole.toUpperCase()}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={loading}
                    className="py-3 px-6 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    Change Role
                  </button>
                </div>

                {/* Quick Login Buttons */}
                {/* <div className="space-y-3 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center">Or try quick demo login:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('employee')}
                      disabled={loading}
                      className="py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm font-medium"
                    >
                      🚀 Demo Employee
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('hr')}
                      disabled={loading}
                      className="py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 text-sm font-medium"
                    >
                      👔 Demo HR
                    </button>
                  </div>
                </div> */}
              </form>
            )}

            {/* Instructions when no role selected */}
            {!selectedRole && (
              <div className="text-center py-8">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                  <FaBuilding className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Select Your Role to Continue
                </h3>
                <p className="text-gray-500">
                  Choose between Employee or HR Manager to access your dashboard
                </p>
              </div>
            )}

            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                    Contact HR
                  </Link>
                </div>
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => toast.info('Please contact IT support for password reset')}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Info */}
      </div>

      {/* Add some CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;