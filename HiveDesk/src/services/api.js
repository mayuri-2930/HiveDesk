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
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Login API error:', error.response?.data || error.message);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Registration API error:', error.response?.data || error.message);
      
      let errorMessage = 'Registration failed';
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail[0]?.msg || errorMessage;
        } else {
          errorMessage = error.response.data.detail;
        }
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }
};

// HR Dashboard API
export const hrAPI = {
  getDashboard: async () => {
    try {
      const response = await api.get('/hr/dashboard');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('HR Dashboard API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch HR dashboard'
      };
    }
  },

  getEmployees: async () => {
    try {
      const response = await api.get('/hr/employees');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get employees API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch employees'
      };
    }
  },

  addEmployee: async (employeeData) => {
    try {
      const response = await api.post('/hr/employees', employeeData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Add employee API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to add employee'
      };
    }
  }
};

// Employee Dashboard API
export const employeeAPI = {
  getDashboard: async () => {
    try {
      const response = await api.get('/employee/dashboard');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Employee Dashboard API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch employee dashboard'
      };
    }
  },

  getTasks: async () => {
    try {
      const response = await api.get('/employee/tasks');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get tasks API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch tasks'
      };
    }
  },

  completeTask: async (taskId) => {
    try {
      const response = await api.post(`/employee/tasks/${taskId}/complete`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Complete task API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to complete task'
      };
    }
  }
};

// Helper functions
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export default api;