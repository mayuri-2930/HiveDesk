// src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8000/api';

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
      formData.append('username', email);
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

  // Get current user info
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch user info'
      };
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Verify token error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Token verification failed'
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

// Dashboard API
export const dashboardAPI = {
  // Get Dashboard for HR or Employee
  getDashboard: async () => {
    try {
      const response = await api.get('/dashboard/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Dashboard API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch dashboard'
      };
    }
  }
};

// Employee Management API (CONFIRMED ENDPOINTS)
export const employeeAPI = {
  // Get All Employees with pagination
  getEmployees: async (page = 1, pageSize = 10) => {
    try {
      const response = await api.get('/employees/', {
        params: {
          page,
          page_size: pageSize
        }
      });
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

  // Get Employee Details
  getEmployee: async (employeeId) => {
    try {
      const response = await api.get(`/employees/${employeeId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get employee API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch employee details'
      };
    }
  },

  // Update Employee (CONFIRMED)
  updateEmployee: async (employeeId, employeeData) => {
    try {
      const response = await api.put(`/employees/${employeeId}`, employeeData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Update employee API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to update employee'
      };
    }
  },

  // Delete Employee (NEEDS CHECK)
  deleteEmployee: async (employeeId) => {
    try {
      const response = await api.delete(`/employees/${employeeId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Delete employee API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to delete employee'
      };
    }
  },

  // Add Employee (NEEDS CHECK)
  addEmployee: async (employeeData) => {
    try {
      const response = await api.post('/employees/', employeeData);
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

// Task Management API (NEEDS CHECK - might not exist)
export const taskAPI = {
  // Get Tasks
  getTasks: async () => {
    try {
      const response = await api.get('/tasks/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get tasks API error:', error);
      // Return empty data instead of error for non-existent endpoints
      return {
        success: true,
        data: { tasks: [] }
      };
    }
  },

  // Create Task
  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks/', taskData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Create task API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to create task'
      };
    }
  },

  // Update Task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Update task API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to update task'
      };
    }
  },

  // Delete Task
  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Delete task API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to delete task'
      };
    }
  }
};

// Document Management API (NEEDS CHECK - might not exist)
export const documentAPI = {
  // Get Documents
  getDocuments: async () => {
    try {
      const response = await api.get('/documents/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get documents API error:', error);
      // Return empty data for non-existent endpoints
      return {
        success: true,
        data: { documents: [] }
      };
    }
  },

  // Upload Document
  uploadDocument: async (formData) => {
    try {
      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Upload document API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to upload document'
      };
    }
  }
};

// Training API (NEEDS CHECK - might not exist)
export const trainingAPI = {
  // Get Training Modules
  getTraining: async () => {
    try {
      const response = await api.get('/training/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get training API error:', error);
      // Return empty data for non-existent endpoints
      return {
        success: true,
        data: { training_modules: [] }
      };
    }
  }
};

// Performance API (NEEDS CHECK - might not exist)
export const performanceAPI = {
  // Get Overall Performance
  getPerformance: async () => {
    try {
      const response = await api.get('/performance/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get performance API error:', error);
      // Return empty data for non-existent endpoints
      return {
        success: true,
        data: { performance: [] }
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

// Get user info from localStorage
export const getUserInfo = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Save user info to localStorage
export const saveUserInfo = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Save token to localStorage
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

// Clear all auth data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Test function to check which endpoints exist
export const testAPIEndpoints = async () => {
  const endpoints = [
    { name: 'Dashboard', path: '/dashboard/', method: 'GET' },
    { name: 'Employees', path: '/employees/', method: 'GET' },
    { name: 'Tasks', path: '/tasks/', method: 'GET' },
    { name: 'Documents', path: '/documents/', method: 'GET' },
    { name: 'Training', path: '/training/', method: 'GET' },
    { name: 'Performance', path: '/performance/', method: 'GET' }
  ];

  console.log('🔍 Testing API Endpoints...');
  
  for (const endpoint of endpoints) {
    try {
      const response = await api.get(endpoint.path);
      console.log(`✅ ${endpoint.name}: ${endpoint.method} ${endpoint.path} - Status: ${response.status}`);
    } catch (error) {
      const status = error.response?.status;
      const detail = error.response?.data?.detail || error.message;
      console.log(`❌ ${endpoint.name}: ${endpoint.method} ${endpoint.path} - Status: ${status || 'No response'} - ${detail}`);
    }
  }
  
  console.log('🔍 API Endpoint Testing Complete');
};

export default api;