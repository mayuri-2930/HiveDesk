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

// Helper function to clean and validate parameters
const cleanParams = (name, role) => {
  // Remove spaces, special characters, and convert to lowercase
  const cleanName = name 
    ? name.toString().replace(/\s+/g, '').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase()
    : '';
  
  const cleanRole = role 
    ? role.toString().toLowerCase().replace(/\s+/g, '')
    : '';
  
  return { cleanName, cleanRole };
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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
  login: async (email, password) => {
    try {
      const formData = new FormData();
      formData.append('email', email); // FastAPI OAuth2 expects 'username'
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
  getDashboard: async (name, role) => {
    try {
      const { cleanName, cleanRole } = cleanParams(name, role);
      console.log('Fetching dashboard for:', { cleanName, cleanRole });
      
      const response = await api.get(`/${cleanName}/${cleanRole}/dashboard`);
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

// Employee Management API
export const employeeAPI = {
  getEmployees: async (name, role) => {
    try {
      const { cleanName, cleanRole } = cleanParams(name, role);
      console.log('Fetching employees for:', { cleanName, cleanRole });
      
      const response = await api.get(`/${cleanName}/${cleanRole}/employees`);
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

  getEmployee: async (name, role, employeeId) => {
    try {
      const { cleanName, cleanRole } = cleanParams(name, role);
      console.log('Fetching employee details:', { cleanName, cleanRole, employeeId });
      
      const response = await api.get(`/${cleanName}/${cleanRole}/manage/${employeeId}`);
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

  updateEmployee: async (name, role, employeeId, employeeData) => {
    try {
      const { cleanName, cleanRole } = cleanParams(name, role);
      
      const response = await api.put(`/${cleanName}/${cleanRole}/employees/${employeeId}`, employeeData);
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

  deleteEmployee: async (name, role, employeeId) => {
    try {
      const { cleanName, cleanRole } = cleanParams(name, role);
      
      const response = await api.delete(`/${cleanName}/${cleanRole}/employees/${employeeId}`);
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

  addEmployee: async (name, employeeData) => {
    try {
      const { cleanName } = cleanParams(name, 'hr');
      
      const response = await api.post(`/${cleanName}/hr/employees`, employeeData);
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

// Task Management API
export const taskAPI = {
  getTasks: async (name, role) => {
    try {
      const { cleanName, cleanRole } = cleanParams(name, role);
      console.log('Fetching tasks for:', { cleanName, cleanRole });
      
      const response = await api.get(`/${cleanName}/${cleanRole}/tasks`);
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

  createTask: async (name, role, taskData) => {
    try {
      const { cleanName, cleanRole } = cleanParams(name, role);
      
      const response = await api.post(`/${cleanName}/${cleanRole}/tasks`, taskData);
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

  updateTask: async (name, role, taskId, taskData) => {
    try {
      const { cleanName, cleanRole } = cleanParams(name, role);
      
      const response = await api.put(`/${cleanName}/${cleanRole}/tasks/${taskId}`, taskData);
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

  deleteTask: async (name, role, taskId) => {
    try {
      const { cleanName, cleanRole } = cleanParams(name, role);
      
      const response = await api.delete(`/${cleanName}/${cleanRole}/tasks/${taskId}`);
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
  },

  completeTask: async (name, role, taskData) => {
    try {
      const { cleanName, cleanRole } = cleanParams(name, role);
      
      const response = await api.post(`/${cleanName}/${cleanRole}/tasks/complete`, taskData);
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
  },

  assignTask: async (name, taskData) => {
    try {
      const { cleanName } = cleanParams(name, 'hr');
      
      const response = await api.post(`/${cleanName}/hr/assign-task`, taskData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Assign task API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to assign task'
      };
    }
  }
};

// Document Management API
export const documentAPI = {
  getDocuments: async (name, role) => {
    try {
      const { cleanName, cleanRole } = cleanParams(name, role);
      console.log('Fetching documents for:', { cleanName, cleanRole });
      
      const response = await api.get(`/${cleanName}/${cleanRole}/documents`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get documents API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch documents'
      };
    }
  },

  uploadDocument: async (name, role, formData) => {
    try {
      const { cleanName, cleanRole } = cleanParams(name, role);
      
      const response = await api.post(`/${cleanName}/${cleanRole}/documents/upload`, formData, {
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

// Training API
export const trainingAPI = {
  getTraining: async (name, role) => {
    try {
      const { cleanName, cleanRole } = cleanParams(name, role);
      
      const response = await api.get(`/${cleanName}/${cleanRole}/training`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get training API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch training modules'
      };
    }
  },

  updateTraining: async (name, role, trainingId, progressData) => {
    try {
      const { cleanName, cleanRole } = cleanParams(name, role);
      
      const response = await api.put(`/${cleanName}/${cleanRole}/training/${trainingId}`, progressData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Update training API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to update training'
      };
    }
  }
};

// Performance API
export const performanceAPI = {
  getPerformance: async (name, role) => {
    try {
      const { cleanName, cleanRole } = cleanParams(name, role);
      
      const response = await api.get(`/${cleanName}/${cleanRole}/performance`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get performance API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch performance data'
      };
    }
  },

  getEmployeePerformance: async (name, role, employeeId) => {
    try {
      const { cleanName, cleanRole } = cleanParams(name, role);
      
      const response = await api.get(`/${cleanName}/${cleanRole}/performance/${employeeId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get employee performance API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch employee performance'
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

export const getUserInfo = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const saveUserInfo = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// New helper to get clean user parameters
export const getUserParams = () => {
  const user = getUserInfo();
  if (!user) return { name: '', role: '' };
  
  // Extract username from email if name is not available
  const name = user.username || user.name || (user.email ? user.email.split('@')[0] : 'user');
  const role = user.role || 'employee';
  
  const { cleanName, cleanRole } = cleanParams(name, role);
  return { cleanName, cleanRole, originalName: name, originalRole: role };
};

export default api;