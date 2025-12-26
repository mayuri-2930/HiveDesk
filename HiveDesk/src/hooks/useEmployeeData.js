import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useEmployeeData = (employeeId) => {
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API calls
      // const employeeResponse = await api.get(`/employees/${employeeId}`);
      // const tasksResponse = await api.get(`/employees/${employeeId}/tasks`);
      // const docsResponse = await api.get(`/employees/${employeeId}/documents`);
      
      // Mock data
      const mockEmployee = {
        id: employeeId,
        name: 'John Doe',
        email: 'john@company.com',
        role: 'Software Engineer',
        department: 'Engineering',
        startDate: '2024-02-15',
        status: 'active'
      };
      
      const mockTasks = [
        { id: 1, title: 'Complete tax forms', completed: true },
        { id: 2, title: 'Setup work email', completed: false },
      ];
      
      const mockDocuments = [
        { id: 1, name: 'Passport.pdf', status: 'verified' },
        { id: 2, name: 'Resume.pdf', status: 'pending' },
      ];
      
      setEmployee(mockEmployee);
      setTasks(mockTasks);
      setDocuments(mockDocuments);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeData();
    }
  }, [employeeId]);

  const updateTask = async (taskId, updates) => {
    // TODO: Connect to backend
    console.log('Update task:', taskId, updates);
  };

  const uploadDocument = async (file) => {
    // TODO: Connect to backend
    console.log('Upload document:', file);
  };

  return {
    employee,
    tasks,
    documents,
    loading,
    error,
    refresh: fetchEmployeeData,
    updateTask,
    uploadDocument,
  };
};