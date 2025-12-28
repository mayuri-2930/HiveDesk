import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { authAPI } from '../../services/api';

const Employees = ({ 
  employees = [], 
  handleEditEmployee, 
  handleViewEmployee, 
  handleOpenDeleteModal,
  getStatusColor,
  token, // Make sure this is being passed from parent
  onEmployeeAdded
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: 'employee',
    is_active: true,
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authError, setAuthError] = useState(false);

  // Debug: Log the token when component renders
  useEffect(() => {
    console.log('Employees component - Token:', token);
  }, [token]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!newEmployee.name.trim()) {
      return 'Name is required';
    }
    if (!newEmployee.email.trim()) {
      return 'Email is required';
    }
    if (!/\S+@\S+\.\S+/.test(newEmployee.email)) {
      return 'Please enter a valid email address';
    }
    if (!newEmployee.password.trim()) {
      return 'Password is required';
    }
    if (newEmployee.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  // Check if user can add employee
  const handleAddClick = () => {
    if (!token) {
      setAuthError(true);
      setError('You must be logged in to add employees. Please login first.');
      return;
    }
    setShowAddModal(true);
  };

  // Handle add employee
  const handleAddEmployee = async () => {
    console.log('handleAddEmployee called - Token:', token); // Debug log
    
    // Check if token is available
    if (!token) {
      setAuthError(true);
      setError('Authentication token is missing. Please login again.');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setAuthError(false);

    try {
      console.log('Calling API with data:', newEmployee); // Debug log
      
      // Call the API with token
      const response = await authAPI.registerEmployee(newEmployee, token);
      console.log('API response:', response); // Debug log
      
      // Reset form and close modal
      resetForm();
      setShowAddModal(false);
      
      // Call the callback to refresh employee list
      if (onEmployeeAdded) {
        onEmployeeAdded();
      }
      
      // Show success message
      alert('Employee added successfully!');
      
    } catch (error) {
      console.error('Error in handleAddEmployee:', error); // Debug log
      
      if (error.message.includes('Unauthorized') || error.message.includes('expired') || error.message.includes('missing')) {
        setAuthError(true);
        setError(error.message + '. Please login again.');
        // Clear token and reload or redirect
        localStorage.removeItem('token');
        // Optional: Redirect to login page
        // window.location.href = '/login';
      } else {
        setError(error.message || 'Failed to add employee. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset form function
  const resetForm = () => {
    setNewEmployee({
      name: '',
      email: '',
      role: 'employee',
      is_active: true,
      password: ''
    });
    setError('');
    setAuthError(false);
  };

  // Close modal handler
  const handleCloseModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  // Login redirect handler
  const handleLoginRedirect = () => {
    // Redirect to login page
    window.location.href = '/login'; // Update with your login route
  };

  // Employee Table Row Component (same as before)
  const EmployeeTableRow = ({ employee }) => (
    <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      {/* ... existing row code ... */}
    </tr>
  );

  return (
    <>
      <div className="w-full max-w-[1600px] mx-auto">
        {/* Authentication Error Banner */}
        {authError && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Authentication Required
                  </h3>
                </div>
              </div>
              <button
                onClick={handleLoginRedirect}
                className="ml-3 px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        )}

        {/* Employees Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-800/10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-gray-900 dark:text-white text-lg font-bold">Employee Management</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {employees.length} employees • {employees.filter(e => e.is_active).length} active
                </p>
              </div>
              <button 
                onClick={handleAddClick}
                disabled={!token}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  token 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                <FaPlus />
                Add Employee
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {employees.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tasks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {employees.map((employee) => (
                    <EmployeeTableRow key={employee.id} employee={employee} />
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <FaPlus className="text-2xl text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Employees Found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  There are no employees in the system yet. Add your first employee to get started.
                </p>
                <button 
                  onClick={handleAddClick}
                  disabled={!token}
                  className={`mt-6 flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                    token 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FaPlus />
                  Add First Employee
                </button>
              </div>
            )}
          </div>
          
          {employees.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {employees.length} of {employees.length} employees
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    ← Previous
                  </button>
                  <span className="px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                    1
                  </span>
                  <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Add New Employee
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  disabled={loading}
                >
                  ✕
                </button>
              </div>

              {error && (
                <div className={`mb-4 p-3 rounded-lg ${
                  authError 
                    ? 'bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'
                    : 'bg-yellow-100 border border-yellow-400 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400'
                }`}>
                  {error}
                  {authError && (
                    <button
                      onClick={handleLoginRedirect}
                      className="mt-2 block w-full text-center px-3 py-1 border border-red-400 text-red-700 bg-white hover:bg-red-50 dark:bg-red-800 dark:text-red-200 dark:border-red-600 dark:hover:bg-red-700 rounded text-sm"
                    >
                      Go to Login
                    </button>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newEmployee.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newEmployee.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="john@example.com"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={newEmployee.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={loading}
                  >
                    <option value="employee">Employee</option>
                    <option value="hr">HR</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={newEmployee.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="At least 6 characters"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={newEmployee.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Active Account
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEmployee}
                  disabled={loading || !token}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    token && !loading
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Add Employee
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Employees;