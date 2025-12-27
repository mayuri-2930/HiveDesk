// src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8000'; // Your FastAPI backend URL

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  // Login with email and password
  login: async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      
      // Try POST request with JSON body
      const response = await api.post('/auth/login', {
        email: email,
        password: password
      });
      
      console.log('Login successful, response:', response.data);
      return { 
        success: true, 
        data: response.data
      };
    } catch (error) {
      console.error('Login API error:', error.response || error);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  },

  // Simple login without complex logic
  simpleLogin: async (email, password) => {
    try {
      // Test endpoint - adjust based on your backend
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,  // Try 'username' if 'email' doesn't work
          password: password
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      return { 
        success: true, 
        data: data
      };
    } catch (error) {
      console.error('Simple login error:', error);
      return { 
        success: false, 
        error: error.message
      };
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
      };
    }
  }
};

// Dashboard API - Simple version
export const dashboardAPI = {
  // Get HR dashboard data
  getHRDashboard: async () => {
    try {
      const response = await api.get('/hr/dashboard');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to fetch HR dashboard' 
      };
    }
  },

  // Get Employee dashboard data
  getEmployeeDashboard: async () => {
    try {
      const response = await api.get('/employee/dashboard');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to fetch employee dashboard' 
      };
    }
  }
};

// Helper functions
export const saveAuthData = (token, userData) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getUserData = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export default api;