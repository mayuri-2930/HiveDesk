import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../services/firebaseConfig'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState('') // 'hr' or 'employee'
  const [isSignUp, setIsSignUp] = useState(false)
  const [showAuthForm, setShowAuthForm] = useState(false)

  const handleUserTypeSelect = (type) => {
    setUserType(type)
    setTimeout(() => setShowAuthForm(true), 300)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      localStorage.setItem('role', userType)
      if (userType === 'hr') {
        navigate('/hr-dashboard')
      } else {
        navigate('/employee-dashboard')
      }

      toast.success('Login successful!')
    } catch (error) {
      // Check specific error codes
      if (error.code === 'auth/user-not-found') {
        toast.error('Account not found. Please sign up first.', {
          duration: 4000,
        })
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password. Please try again.')
      } else {
        toast.error('Login failed. Please check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignUpRedirect = () => {
    toast.loading('Redirecting to sign up...')
    setTimeout(() => {
      // Here you would typically navigate to signup page
      // For demo, we'll just toggle to signup form
      setIsSignUp(true)
      toast.dismiss()
      toast.success('Ready to create your account!')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-4xl"
      >
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left - Branding Section */}
            <div className="relative p-8 lg:p-12 bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-violet-700/90 text-white">
              {/* Animated logo/icon */}
              <motion.div 
                className="mb-8"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold">HR</span>
                </div>
              </motion.div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Intelligent HR 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                  Onboarding System
                </span>
              </h1>
              
              <p className="text-lg text-blue-100/90 mb-8">
                Transform your onboarding with AI-powered verification, automated workflows, and personalized experiences.
              </p>

              {/* Features list with icons */}
              <div className="space-y-4">
                {[
                  { text: 'AI Document Verification', color: 'from-blue-400 to-cyan-400' },
                  { text: 'Smart Role Assignment', color: 'from-purple-400 to-pink-400' },
                  { text: 'Automated Task Management', color: 'from-violet-400 to-purple-400' },
                  { text: 'Real-time Analytics Dashboard', color: 'from-indigo-400 to-blue-400' },
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                      <span className="text-white">✓</span>
                    </div>
                    <span className="text-blue-100">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold">99%</div>
                  <div className="text-sm text-blue-100/80">Accuracy</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-blue-100/80">Support</div>
                </div>
              </div>
            </div>

            {/* Right - Auth Section */}
            <div className="p-8 lg:p-12 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm">
              <div className="max-w-md mx-auto">
                {/* Role Selection / Auth Form Toggle */}
                <AnimatePresence mode="wait">
                  {!showAuthForm ? (
                    <motion.div
                      key="role-selection"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                        Who are you?
                      </h2>
                      <p className="text-gray-300 mb-8">
                        Select your role to continue
                      </p>

                      <div className="space-y-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleUserTypeSelect('hr')}
                          className="w-full p-6 bg-gradient-to-red from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-2xl text-left group hover:from-purple-600/30 hover:to-violet-600/30 transition-all duration-300"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-red from-purple-500 to-violet-500 flex items-center justify-center">
                              <span className="text-xl">👑</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">HR Professional</h3>
                              <p className="text-gray-300 text-sm">Access admin dashboard and analytics</p>
                            </div>
                          </div>
                          <div className="mt-4 text-purple-300 text-sm">
                            • Manage employee onboarding<br/>
                            • View analytics and reports<br/>
                            • Configure system settings
                          </div>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleUserTypeSelect('employee')}
                          className="w-full p-6 bg-gradient-to-red from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl text-left group hover:from-blue-600/30 hover:to-indigo-600/30 transition-all duration-300"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-red from-blue-500 to-indigo-500 flex items-center justify-center">
                              <span className="text-xl">👤</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">Employee</h3>
                              <p className="text-gray-300 text-sm">Complete onboarding and tasks</p>
                            </div>
                          </div>
                          <div className="mt-4 text-blue-300 text-sm">
                            • Submit onboarding documents<br/>
                            • Track progress<br/>
                            • Complete assigned tasks
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="auth-form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Header with back button */}
                      <div className="flex items-center mb-8">
                        <button
                          onClick={() => {
                            setShowAuthForm(false)
                            setUserType('')
                          }}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <span className="text-gray-400">← Back</span>
                        </button>
                        <div className="ml-4">
                          <h2 className="text-2xl lg:text-3xl font-bold text-white">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                          </h2>
                          <p className="text-gray-400">
                            {userType === 'hr' ? 'HR Dashboard Access' : 'Employee Portal Access'}
                          </p>
                        </div>
                      </div>

                      {/* Role indicator */}
                      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              userType === 'hr' 
                                ? 'bg-gradient-to-r from-purple-500 to-violet-500' 
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                            }`}>
                              <span>{userType === 'hr' ? '👑' : '👤'}</span>
                            </div>
                            <div>
                              <span className="text-white font-medium">
                                {userType === 'hr' ? 'HR Professional' : 'Employee'}
                              </span>
                              <p className="text-sm text-gray-400">
                                {userType === 'hr' ? 'Admin access' : 'User access'}
                              </p>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 rounded-full border-2 border-t-transparent border-purple-400"
                          />
                        </div>
                      </div>

                      {/* Auth Form */}
                      <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder={`your.email@company.com`}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="Enter your password"
                            required
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Signing in...
                            </div>
                          ) : (
                            'Sign In'
                          )}
                        </motion.button>
                      </form>

                     

                      {/* Sign up link */}
                      <div className="mt-8 text-center">
                        <p className="text-gray-400">
                          Don't have an account?{' '}
                          <button
                            onClick={handleSignUpRedirect}
                            className="text-purple-400 hover:text-purple-300 font-medium underline underline-offset-2 transition-colors"
                          >
                            Sign up here
                          </button>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Contact your HR admin for account creation
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Intelligent HR System. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Secure login with end-to-end encryption
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage