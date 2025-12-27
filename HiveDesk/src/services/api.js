// src/api/api.js
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
  // Login with email and password - CORRECTED VERSION
  login: async (email, password) => {
    try {
      // Send as JSON with email field
      const response = await api.get(`${API_BASE_URL}/auth/login`, {
        email: email,
        password: password
      });
      
      return { 
        success: true, 
        data: response.data
      };
      console.log('Login response data:', response.data);
    } catch (error) {
      console.error('Login error:', error);
      
      // Better error message extraction
      let errorMessage = 'Login failed. Please check your credentials.';
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
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post(`${API_BASE_URL}/auth/register`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      
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
  },

  // Logout
  logout: () => {
    localStorage.clear();
    toast.success('Logged out successfully!');
  }
};

// Dashboard API
export const dashboardAPI = {
  // Get HR dashboard data
  getHRDashboard: async (name) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${name}/hr/dashboard`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to fetch HR dashboard' 
      };
    }
  },

  // Get Employee dashboard data
  getEmployeeDashboard: async (name) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${name}/employee/dashboard`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to fetch employee dashboard' 
      };
    }
  },

  // Get all employees (HR only)
  getEmployees: async (name) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${name}/hr/employees`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to fetch employees' 
      };
    }
  },

  // Add new employee (HR only)
  addEmployee: async (name, employeeData) => {
    try {
      const response = await api.post(`${API_BASE_URL}/${name}/hr/employees`, employeeData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to add employee' 
      };
    }
  },

  // Get specific employee details
  getEmployeeDetails: async (name, employeeName) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${name}/hr/manage/${employeeName}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to fetch employee details' 
      };
    }
  }
};

// Tasks API
export const taskAPI = {
  // Get tasks for HR (all tasks) or Employee (assigned tasks)
  getTasks: async (name, role) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${name}/${role}/tasks`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to fetch tasks' 
      };
    }
  },

  // Complete a task
  completeTask: async (name, role, taskId) => {
    try {
      const response = await api.post(`/${name}/${role}/tasks/complete`, { task_id: taskId });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to complete task' 
      };
    }
  },

  // Assign task to employee (HR only)
  assignTask: async (name, taskData) => {
    try {
      const response = await api.post(`/${name}/hr/assign-task`, taskData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to assign task' 
      };
    }
  }
};

// Documents API
export const documentAPI = {
  // Get documents for HR (all) or Employee (own)
  getDocuments: async (name, role) => {
    try {
      const response = await api.get(`/${name}/${role}/documents`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to fetch documents' 
      };
    }
  },

  // Upload document
  uploadDocument: async (name, role, file, documentType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);
    
    try {
      const response = await api.post(`/${name}/${role}/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to upload document' 
      };
    }
  },

  // Verify document (HR only)
  verifyDocument: async (name, documentId) => {
    try {
      const response = await api.post(`/${name}/hr/documents/verify`, { document_id: documentId });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to verify document' 
      };
    }
  }
};

// Training API
export const trainingAPI = {
  // Get training modules
  getTraining: async (name, role) => {
    try {
      const response = await api.get(`/${name}/${role}/training`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to fetch training modules' 
      };
    }
  },

  // Complete training module
  completeTraining: async (name, role, trainingId) => {
    try {
      const response = await api.post(`/${name}/${role}/training/complete`, { 
        training_id: trainingId 
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to complete training' 
      };
    }
  },

  // Get training progress
  getTrainingProgress: async (name, role) => {
    try {
      const response = await api.get(`/${name}/${role}/training/progress`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to fetch training progress' 
      };
    }
  }
};

// Helper functions
export const getUserInfo = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setUserInfo = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
};

export default api;