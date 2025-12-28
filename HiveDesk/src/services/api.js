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

// Helper function to get user params from localStorage
const getUserParams = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return { name: '', role: '' };
    
    // Extract first name from full name (e.g., "John HR" -> "John")
    const firstName = user.name ? user.name.split(' ')[0].toLowerCase() : 'user';
    const role = user.role ? user.role.toLowerCase() : 'employee';
    
    return { name: firstName, role };
  } catch (error) {
    console.error('Error getting user params:', error);
    return { name: 'user', role: 'employee' };
  }
};

// Helper to encode name for URL
const encodeUserName = (name) => {
  return encodeURIComponent(name.toLowerCase().replace(/\s+/g, ''));
};

// Authentication API
export const authAPI = {
  // Login with email and password
  login: async (email, password) => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await api.post(`${API_BASE_URL}/auth/login`, formData);
      
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
      const response = await api.get(`${API_BASE_URL}/auth/me`);
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
      const response = await api.get(`${API_BASE_URL}/auth/verify`);
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
  registerEmployee: async (employeeData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(employeeData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error registering employee:', error);
      throw error;
    }
  },
};

// Dashboard API
export const dashboardAPI = {
  // Get Dashboard - Fixed: No name/role needed in URL, backend extracts from JWT
  getDashboard: async () => {
    try {
      console.log('Fetching dashboard data...');
      const response = await api.get(`${API_BASE_URL}/dashboard/`);
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

// Employee Management API (HR only)
export const employeeAPI = {
  // Get All Employees with pagination
  getEmployees: async (page = 1, pageSize = 10) => {
    try {
      const { name, role } = getUserParams();
      const encodedName = encodeUserName(name);
      console.log('Fetching employees for:', { encodedName });
      
      const response = await api.get(`${API_BASE_URL}/employees`, {
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
      const { name, role } = getUserParams();
      const encodedName = encodeUserName(name);
      console.log('Fetching employee details:', { encodedName, role: 'hr', employeeId });
      
      const response = await api.get(`${API_BASE_URL}/employees/${employeeId}`);
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

  // Update Employee
  updateEmployee: async (employeeId, employeeData) => {
    try {
      const { name, role } = getUserParams();
      const encodedName = encodeUserName(name);
      
      const response = await api.put(`${API_BASE_URL}/employees/${employeeId}`, employeeData);
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

  // Delete Employee
  deleteEmployee: async (employeeId) => {
    try {
      const { name, role } = getUserParams();
      const encodedName = encodeUserName(name);
      
      const response = await api.delete(`${API_BASE_URL}/employees/${employeeId}`);
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

  // Add Employee
  addEmployee: async (employeeData) => {
    try {
      const { name, role } = getUserParams();
      const encodedName = encodeUserName(name);
      
      const response = await api.post(`${API_BASE_URL}/${encodedName}/hr/employees`, employeeData);
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
// Task Management API
export const taskAPI = {
  // Get Tasks (role-based: HR sees all, Employee sees assigned)
  getTasks: async () => {
    try {
      const { name, role } = getUserParams();
      const encodedName = encodeUserName(name);
      
      const response = await api.get(`${API_BASE_URL}/tasks/`);
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

  // Create Task (HR only)
  createTask: async (taskData) => {
    try {
      const { name, role } = getUserParams();
      const encodedName = encodeUserName(name);
      
      const response = await api.post(`${API_BASE_URL}/tasks/`, taskData);
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

  // Update Task (HR only)
  updateTask: async (taskId, taskData) => {
    try {
      const { name, role } = getUserParams();
      const encodedName = encodeUserName(name);
      
      const response = await api.put(`${API_BASE_URL}/tasks/${taskId}`, taskData);
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

  // Delete Task (HR only)
  deleteTask: async (taskId) => {
    try {
      const { name, role } = getUserParams();
      const encodedName = encodeUserName(name);
      
      const response = await api.delete(`${API_BASE_URL}/tasks/${taskId}`);
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

  // Assign Task (HR only)
  assignTask: async (taskId, assigneeData) => {
    try {
      const { name, role } = getUserParams();
      const encodedName = encodeUserName(name);
      
      const response = await api.post(`${API_BASE_URL}/tasks/${taskId}/assign`, assigneeData);
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
  },

  // Complete Task (Employee only)
  completeTask: async (taskId) => {
    try {
      const { name, role } = getUserParams();
      const encodedName = encodeUserName(name);
      
      const response = await api.patch(`/api/tasks/${taskId}/complete`);
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

// Document Management API
export const documentAPI = {
  // Get Documents (role-based)
  getDocuments: async (page = 1, pageSize = 10) => {
    try {
      const { name, role } = getUserParams();
      const encodedName = encodeUserName(name);
      console.log('Fetching documents for:', { encodedName, role });
      
      const response = await api.get(`${API_BASE_URL}/documents`, {
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
      console.error('Get documents API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch documents'
      };
    }
  },

  // Upload Document (Employee only)
  uploadDocument: async (formData) => {
    try {
      const { name, role } = getUserParams();
      const encodedName = encodeUserName(name);
      
      const response = await api.post(`${API_BASE_URL}/${encodedName}/employee/documents/upload`, formData, {
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
  // Get Training Modules (role-based)
  getTraining: async (page = 1, pageSize = 10) => {
    try {
      const { name, role } = getUserParams();
      const encodedName = encodeUserName(name);
      
      const response = await api.get(`${API_BASE_URL}/${encodedName}/${role}/training`, {
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
      console.error('Get training API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch training modules'
      };
    }
  },

  // Update Training Progress (Employee only)
  updateTraining: async (trainingId, progressData) => {
    try {
      const { name, role } = getUserParams();
      const encodedName = encodeUserName(name);
      
      const response = await api.put(`${API_BASE_URL}/${encodedName}/employee/training/${trainingId}`, progressData);
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

// Performance API (HR only)
export const performanceAPI = {
  // Get Overall Performance
  getPerformance: async () => {
    try {
      const { name, role } = getUserParams();
      const encodedName = encodeUserName(name);
      
      const response = await api.get(`${API_BASE_URL}/${encodedName}/hr/performance`);
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

  // Get Employee Performance
  getEmployeePerformance: async (employeeId) => {
    try {
      const { name, role } = getUserParams();
      const encodedName = encodeUserName(name);
      
      const response = await api.get(`${API_BASE_URL}/${encodedName}/hr/performance/${employeeId}`);
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

// New helper function for components
export const getEncodedUserParams = () => {
  const { name, role } = getUserParams();
  return {
    encodedName: encodeUserName(name),
    role
  };
};

// Debug function to test endpoints
export const testEndpoints = async () => {
  const { encodedName, role } = getEncodedUserParams();
  const endpoints = [
    { name: 'Dashboard', path: `${API_BASE_URL}/dashboard/`, method: 'GET' },
    { name: 'Employees', path: `${API_BASE_URL}/${encodedName}/hr/employees`, method: 'GET' },
    { name: 'Tasks', path: `${API_BASE_URL}/${encodedName}/${role}/tasks`, method: 'GET' },
    { name: 'Documents', path: `${API_BASE_URL}/${encodedName}/${role}/documents`, method: 'GET' },
    { name: 'Training', path: `${API_BASE_URL}/${encodedName}/${role}/training`, method: 'GET' },
    { name: 'Performance', path: `${API_BASE_URL}/${encodedName}/hr/performance`, method: 'GET' }
  ];

  console.log('🔍 Testing API Endpoints...');
  console.log('User params:', { encodedName, role });
  
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