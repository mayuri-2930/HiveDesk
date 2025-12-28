// src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

// const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE_URL = 'https://hivedesk-backend.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for uploads
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
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.');
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
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

// ============================================
// AUTHENTICATION API
// ============================================
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

  // Logout
  logout: async () => {
    try {
      await api.post(`${API_BASE_URL}/auth/logout`);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  }
};

// ============================================
// DASHBOARD API
// ============================================
export const dashboardAPI = {
  // Get Dashboard
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
  },

  // Get Stats
  getStats: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/dashboard/stats`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get stats API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch stats'
      };
    }
  }
};

// ============================================
// EMPLOYEE MANAGEMENT API (HR only)
// ============================================
export const employeeAPI = {
  // Get All Employees with pagination
  getEmployees: async (page = 1, pageSize = 10, search = '', department = '') => {
    try {
      const params = {
        page,
        page_size: pageSize
      };
      
      if (search) params.search = search;
      if (department) params.department = department;
      
      const response = await api.get(`${API_BASE_URL}/employees`, { params });
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

  // Create Employee
  createEmployee: async (employeeData) => {
    try {
      const response = await api.post(`${API_BASE_URL}/employees`, employeeData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Create employee API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to create employee'
      };
    }
  },

  // Update Employee
  updateEmployee: async (employeeId, employeeData) => {
    try {
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

  // Get Departments
  getDepartments: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/employees/departments`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get departments API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch departments'
      };
    }
  },

  // Bulk Import Employees
  bulkImportEmployees: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`${API_BASE_URL}/employees/bulk-import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Bulk import employees API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to import employees'
      };
    }
  }
};

// ============================================
// TASK MANAGEMENT API
// ============================================
export const taskAPI = {
  // Get Tasks (role-based: HR sees all, Employee sees assigned)
  getTasks: async (status = '', priority = '', page = 1, pageSize = 10) => {
    try {
      const params = { page, page_size: pageSize };
      if (status) params.status = status;
      if (priority) params.priority = priority;
      
      const response = await api.get(`${API_BASE_URL}/tasks`, { params });
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

  // Get Task by ID
  getTask: async (taskId) => {
    try {
      const response = await api.get(`${API_BASE_URL}/tasks/${taskId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get task API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch task'
      };
    }
  },

  // Create Task (HR only)
  createTask: async (taskData) => {
    try {
      const response = await api.post(`${API_BASE_URL}/tasks`, taskData);
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
      const response = await api.patch(`${API_BASE_URL}/tasks/${taskId}/complete`);
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

  // Get My Tasks (Employee only)
  getMyTasks: async (status = '', priority = '') => {
    try {
      const params = {};
      if (status) params.status = status;
      if (priority) params.priority = priority;
      
      const response = await api.get(`${API_BASE_URL}/tasks/my`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get my tasks API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch your tasks'
      };
    }
  },

  // Get Task Statistics
  getTaskStats: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/tasks/stats`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get task stats API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch task statistics'
      };
    }
  }
};

// ============================================
// DOCUMENT MANAGEMENT API
// ============================================
export const documentAPI = {
  // Get Documents (role-based)
  getDocuments: async (status = '', type = '', page = 1, pageSize = 10) => {
    try {
      const params = { page, page_size: pageSize };
      if (status) params.status = status;
      if (type) params.type = type;
      
      const response = await api.get(`${API_BASE_URL}/documents`, { params });
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

  // Get Single Document
  getDocument: async (documentId) => {
    try {
      const response = await api.get(`${API_BASE_URL}/documents/${documentId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get document API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch document'
      };
    }
  },

// Update the uploadDocument function in the documentAPI section
uploadDocument: async (file, metadata) => {
  try {
    // Validate file
    if (!file) {
      return {
        success: false,
        error: 'No file selected'
      };
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'File type not supported. Please upload PDF, JPG, PNG, or DOC files.'
      };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size exceeds 10MB limit.'
      };
    }

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    
    // Handle metadata (could be a string or object)
    if (typeof metadata === 'string') {
      // If metadata is a string (backward compatibility)
      formData.append('document_type', metadata);
    } else if (typeof metadata === 'object' && metadata !== null) {
      // If metadata is an object (new format)
      formData.append('document_type', metadata.custom_name || 'general');
      
      if (metadata.custom_name) {
        formData.append('custom_name', metadata.custom_name);
      }
      
      if (metadata.description) {
        formData.append('description', metadata.description);
      }
      
      if (metadata.additional_data) {
        formData.append('additional_data', JSON.stringify(metadata.additional_data));
      }
    } else {
      // Default fallback
      formData.append('document_type', 'general');
    }

    console.log('Uploading document:', {
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      metadata: metadata
    });

    const response = await api.post(`${API_BASE_URL}/documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for upload
    });

    console.log('Upload successful:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Upload document API error:', error);
    let errorMessage = 'Failed to upload document';
    
    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Upload timeout. Please try again.';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
},

// Update the getAIAnalysis function to accept metadata
getAIAnalysis: async (documentId, metadata = {}) => {
  try {
    console.log('Getting AI analysis for document:', documentId);
    
    const response = await api.get(`${API_BASE_URL}/documents/${documentId}/ai-analysis`);
    
    console.log('AI analysis received:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Get AI analysis API error:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to get AI analysis'
    };
  }
},
  // Verify Document (HR only)
  verifyDocument: async (documentId, verificationData) => {
    try {
      const response = await api.post(`${API_BASE_URL}/documents/${documentId}/verify`, verificationData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Verify document API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to verify document'
      };
    }
  },

  // Reject Document (HR only)
  rejectDocument: async (documentId, rejectionReason) => {
    try {
      const response = await api.post(`${API_BASE_URL}/documents/${documentId}/reject`, {
        reason: rejectionReason
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Reject document API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to reject document'
      };
    }
  },

  // Download Document
  downloadDocument: async (documentId) => {
    try {
      const response = await api.get(`${API_BASE_URL}/documents/${documentId}/download`, {
        responseType: 'blob'
      });
      
      // Get filename from headers
      const contentDisposition = response.headers['content-disposition'];
      let filename = `document_${documentId}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return {
        success: true,
        data: { message: 'Download started', filename }
      };
    } catch (error) {
      console.error('Download document API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to download document'
      };
    }
  },

  // Delete Document
  deleteDocument: async (documentId) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/documents/${documentId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Delete document API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to delete document'
      };
    }
  },

  // Get Document Statistics
  getDocumentStats: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/documents/stats`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get document stats API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch document statistics'
      };
    }
  },

  // Get My Documents (Employee only)
  getMyDocuments: async (status = '', type = '') => {
    try {
      const params = {};
      if (status) params.status = status;
      if (type) params.type = type;
      
      const response = await api.get(`${API_BASE_URL}/documents/my`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get my documents API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch your documents'
      };
    }
  },

  // Update Document
  updateDocument: async (documentId, file, documentType) => {
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      if (documentType) {
        formData.append('document_type', documentType);
      }
      
      const response = await api.put(`${API_BASE_URL}/documents/${documentId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Update document API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to update document'
      };
    }
  },

  // Get Document Preview URL
  getDocumentPreviewUrl: (documentId) => {
    return `${API_BASE_URL}/documents/${documentId}/preview`;
  }
};

// ============================================
// TRAINING API
// ============================================
export const trainingAPI = {
  // Get Training Modules
  getTraining: async (status = '', category = '', page = 1, pageSize = 10) => {
    try {
      const params = { page, page_size: pageSize };
      if (status) params.status = status;
      if (category) params.category = category;
      
      const response = await api.get(`${API_BASE_URL}/training`, { params });
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

  // Get Training by ID
  getTrainingById: async (trainingId) => {
    try {
      const response = await api.get(`${API_BASE_URL}/training/${trainingId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get training by ID API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch training'
      };
    }
  },

  // Update Training Progress (Employee only)
  updateTrainingProgress: async (trainingId, progressData) => {
    try {
      const response = await api.patch(`${API_BASE_URL}/training/${trainingId}/progress`, progressData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Update training progress API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to update training progress'
      };
    }
  },

  // Complete Training (Employee only)
  completeTraining: async (trainingId) => {
    try {
      const response = await api.post(`${API_BASE_URL}/training/${trainingId}/complete`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Complete training API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to complete training'
      };
    }
  },

  // Get My Training (Employee only)
  getMyTraining: async (status = '', category = '') => {
    try {
      const params = {};
      if (status) params.status = status;
      if (category) params.category = category;
      
      const response = await api.get(`${API_BASE_URL}/training/my`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get my training API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch your training'
      };
    }
  },

  // Create Training (HR only)
  createTraining: async (trainingData) => {
    try {
      const response = await api.post(`${API_BASE_URL}/training`, trainingData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Create training API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to create training'
      };
    }
  },

  // Update Training (HR only)
  updateTraining: async (trainingId, trainingData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/training/${trainingId}`, trainingData);
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
  },

  // Delete Training (HR only)
  deleteTraining: async (trainingId) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/training/${trainingId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Delete training API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to delete training'
      };
    }
  }
};

// ============================================
// PERFORMANCE API (HR only)
// ============================================
export const performanceAPI = {
  // Get Overall Performance
  getPerformance: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/performance`);
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
      const response = await api.get(`${API_BASE_URL}/performance/employees/${employeeId}`);
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
  },

  // Get Department Performance
  getDepartmentPerformance: async (departmentId) => {
    try {
      const response = await api.get(`${API_BASE_URL}/performance/departments/${departmentId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get department performance API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch department performance'
      };
    }
  },

  // Update Performance Review
  updatePerformanceReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/performance/reviews/${reviewId}`, reviewData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Update performance review API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to update performance review'
      };
    }
  },

  // Create Performance Review
  createPerformanceReview: async (employeeId, reviewData) => {
    try {
      const response = await api.post(`${API_BASE_URL}/performance/employees/${employeeId}/reviews`, reviewData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Create performance review API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to create performance review'
      };
    }
  }
};

// ============================================
// NOTIFICATION API
// ============================================
export const notificationAPI = {
  // Get Notifications
  getNotifications: async (page = 1, pageSize = 20) => {
    try {
      const response = await api.get(`${API_BASE_URL}/notifications`, {
        params: { page, page_size: pageSize }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get notifications API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch notifications'
      };
    }
  },

  // Mark Notification as Read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.patch(`${API_BASE_URL}/notifications/${notificationId}/read`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Mark notification as read API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to mark notification as read'
      };
    }
  },

  // Mark All Notifications as Read
  markAllAsRead: async () => {
    try {
      const response = await api.patch(`${API_BASE_URL}/notifications/read-all`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Mark all notifications as read API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to mark all notifications as read'
      };
    }
  },

  // Get Unread Count
  getUnreadCount: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/notifications/unread-count`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get unread count API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch unread count'
      };
    }
  }
};

// ============================================
// SETTINGS API
// ============================================
export const settingsAPI = {
  // Get User Settings
  getUserSettings: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/settings`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get user settings API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch user settings'
      };
    }
  },

  // Update User Settings
  updateUserSettings: async (settingsData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/settings`, settingsData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Update user settings API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to update user settings'
      };
    }
  },

  // Change Password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post(`${API_BASE_URL}/settings/change-password`, passwordData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Change password API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to change password'
      };
    }
  },

  // Update Profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/settings/profile`, profileData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Update profile API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to update profile'
      };
    }
  }
};

// ============================================
// ANALYTICS API
// ============================================
export const analyticsAPI = {
  // Get Analytics Data
  getAnalytics: async (period = 'month', metrics = []) => {
    try {
      const params = { period };
      if (metrics.length > 0) {
        params.metrics = metrics.join(',');
      }
      
      const response = await api.get(`${API_BASE_URL}/analytics`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get analytics API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch analytics'
      };
    }
  },

  // Export Analytics
  exportAnalytics: async (period = 'month', format = 'csv') => {
    try {
      const response = await api.get(`${API_BASE_URL}/analytics/export`, {
        params: { period, format },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics_${period}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return {
        success: true,
        data: { message: 'Export started' }
      };
    } catch (error) {
      console.error('Export analytics API error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to export analytics'
      };
    }
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
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

// Document Type Helper
export const documentTypeHelper = {
  getDocumentType: (displayName) => {
    const mapping = {
      'Aadhar Card': 'aadhar',
      'PAN Card': 'pan',
      'Passport': 'passport',
      'Driving License': 'driving_license',
      'Voter ID': 'voter_id',
      'Bank Statement': 'bank_statement',
      'Salary Slip': 'salary_slip',
      'Offer Letter': 'offer_letter',
      'Degree Certificate': 'degree_certificate',
      'Experience Certificate': 'experience_certificate',
      'Address Proof': 'address_proof',
      'Photo': 'photo',
      'Resume': 'resume',
      'Medical Certificate': 'medical_certificate',
      'Police Clearance': 'police_clearance'
    };
    
    return mapping[displayName] || displayName.toLowerCase().replace(/\s+/g, '_');
  },

  getDisplayName: (documentType) => {
    const mapping = {
      'aadhar': 'Aadhar Card',
      'pan': 'PAN Card',
      'passport': 'Passport',
      'driving_license': 'Driving License',
      'voter_id': 'Voter ID',
      'bank_statement': 'Bank Statement',
      'salary_slip': 'Salary Slip',
      'offer_letter': 'Offer Letter',
      'degree_certificate': 'Degree Certificate',
      'experience_certificate': 'Experience Certificate',
      'address_proof': 'Address Proof',
      'photo': 'Photo',
      'resume': 'Resume',
      'medical_certificate': 'Medical Certificate',
      'police_clearance': 'Police Clearance'
    };
    
    return mapping[documentType] || documentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  },

  getAllDocumentTypes: () => {
    return [
      { value: 'aadhar', label: 'Aadhar Card' },
      { value: 'pan', label: 'PAN Card' },
      { value: 'passport', label: 'Passport' },
      { value: 'driving_license', label: 'Driving License' },
      { value: 'voter_id', label: 'Voter ID' },
      { value: 'bank_statement', label: 'Bank Statement' },
      { value: 'salary_slip', label: 'Salary Slip' },
      { value: 'offer_letter', label: 'Offer Letter' },
      { value: 'degree_certificate', label: 'Degree Certificate' },
      { value: 'experience_certificate', label: 'Experience Certificate' },
      { value: 'address_proof', label: 'Address Proof' },
      { value: 'photo', label: 'Photo' },
      { value: 'resume', label: 'Resume' },
      { value: 'medical_certificate', label: 'Medical Certificate' },
      { value: 'police_clearance', label: 'Police Clearance' }
    ];
  }
};

// Test API Connection
export const testAPIConnection = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/health`);
    return {
      success: true,
      data: response.data,
      message: 'API connection successful'
    };
  } catch (error) {
    return {
      success: false,
      error: 'API connection failed',
      details: error.message
    };
  }
};

// Debug function to test endpoints
export const testEndpoints = async () => {
  console.log('🔍 Testing API Endpoints...');
  
  const endpoints = [
    { name: 'Health Check', path: `${API_BASE_URL}/health`, method: 'GET' },
    { name: 'Dashboard', path: `${API_BASE_URL}/dashboard/`, method: 'GET' },
    { name: 'Employees', path: `${API_BASE_URL}/employees`, method: 'GET' },
    { name: 'Tasks', path: `${API_BASE_URL}/tasks`, method: 'GET' },
    { name: 'Documents', path: `${API_BASE_URL}/documents`, method: 'GET' },
    { name: 'Training', path: `${API_BASE_URL}/training`, method: 'GET' },
    { name: 'Performance', path: `${API_BASE_URL}/performance`, method: 'GET' }
  ];

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