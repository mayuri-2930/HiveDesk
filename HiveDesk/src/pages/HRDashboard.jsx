// pages/HRDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  dashboardAPI,
  employeeAPI,
  taskAPI,
  documentAPI
} from '../services/api';
import toast from 'react-hot-toast';
import {
  FaFilter,
  FaCalendarAlt,
  FaDownload,
  FaTasks,
  FaExclamationTriangle,
  FaLightbulb,
  FaCheckCircle,
  FaPlus,
  FaTimes
} from "react-icons/fa";
import {
  MdDashboard,
  MdGroup,
  MdBadge,
  MdDescription,
  MdSettings
} from "react-icons/md";

// Import components
import EmployeeModal from '../components/HRDashboard/EmployeeModal';
import Overview from '../components/HRDashboard/Overview';
import Candidates from '../components/HRDashboard/Candidates';
import Employees from '../components/HRDashboard/Employees';
import Documents from '../components/HRDashboard/Documents';
import Settings from '../components/HRDashboard/Settings';
import TaskManagement from '../components/HRDashboard/TaskManagement';

// Import helper functions
import { transformEmployeeData, transformTaskData, transformDocumentData } from '../utils/dataTransformers';

// Sidebar Item Component
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-colors ${active
        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
  >
    <Icon className="h-5 w-5" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

// Task Modal Component
const TaskModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <FaTimes className="h-5 w-5" />
        </button>
        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white pr-8">{title}</h3>
        {children}
      </div>
    </div>
  );
};

const HRDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      total_onboarded: 0,
      in_progress: 0,
      pending_verification: 0,
      completion_rate: 0
    },
    velocity_data: [],
    department_distribution: [],
    recent_candidates: [],
    ai_insights: []
  });
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [activeSection, setActiveSection] = useState('overview');

  // Modal states
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'view',
    employeeData: null
  });

  // Task Management states
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskFilter, setTaskFilter] = useState('all');

  // Form states
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    task_type: 'read',
    content: '',
    required_document_type: 'aadhar',
    is_active: true,
    due_date: '',
    category: '',
    assigned_to: ''
  });

  const [assignForm, setAssignForm] = useState({
    employeeId: '',
    dueDate: ''
  });

  // Fetch all dashboard data
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard data
      const dashboardResponse = await dashboardAPI.getDashboard();
      if (dashboardResponse.success && dashboardResponse.data) {
        setDashboardData(dashboardResponse.data);
      }

      // Fetch employees
      const employeesResponse = await employeeAPI.getEmployees(1, 50);
      if (employeesResponse.success && employeesResponse.data) {
        const apiEmployees = employeesResponse.data.employees || [];
        if (apiEmployees.length > 0) {
          const transformedEmployees = transformEmployeeData(apiEmployees);
          setEmployees(transformedEmployees);
        } else {
          setEmployees([]);
        }
      } else {
        setEmployees([]);
        if (employeesResponse.error) {
          toast.error(`Failed to load employees: ${employeesResponse.error}`);
        }
      }

      // Fetch tasks
      await fetchTasks();

      // Fetch documents
      const documentsResponse = await documentAPI.getDocuments(1, 10);
      if (documentsResponse.success && documentsResponse.data) {
        const apiDocuments = documentsResponse.data.documents || [];
        if (apiDocuments.length > 0) {
          const transformedDocuments = transformDocumentData(apiDocuments);
          setDocuments(transformedDocuments);
        } else {
          setDocuments([]);
        }
      } else {
        setDocuments([]);
        if (documentsResponse.error) {
          toast.error(`Failed to load documents: ${documentsResponse.error}`);
        }
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load live data.');
      setEmployees([]);
      setTasks([]);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const tasksResponse = await taskAPI.getTasks();
      if (tasksResponse.success && tasksResponse.data) {
        const apiTasks = tasksResponse.data.tasks || tasksResponse.data || [];
        if (apiTasks.length > 0) {
          const transformedTasks = transformTaskData(apiTasks);
          setTasks(transformedTasks);
        } else {
          setTasks([]);
        }
      } else {
        setTasks([]);
        if (tasksResponse.error) {
          toast.error(`Failed to load tasks: ${tasksResponse.error}`);
        }
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'all') return true;
    if (taskFilter === 'active') return task.is_active === true;
    if (taskFilter === 'inactive') return task.is_active === false;
    if (taskFilter === 'read') return task.task_type === 'read';
    if (taskFilter === 'write') return task.task_type === 'write';
    if (taskFilter === 'completed') return task.status === 'Completed';
    if (taskFilter === 'pending') return task.status !== 'Completed';
    if (taskFilter === 'high') return task.priority === 'High';
    return true;
  });

  // Handle View Employee
  const handleViewEmployee = async (employeeId) => {
    try {
      setLoading(true);
      const response = await employeeAPI.getEmployee(employeeId);

      if (response.success && response.data) {
        setModalState({
          isOpen: true,
          mode: 'view',
          employeeData: response.data
        });
      } else {
        toast.error(response.error || 'Failed to fetch employee details');
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
      toast.error('Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Employee
  const handleEditEmployee = (employee) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      employeeData: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        is_active: employee.is_active
      }
    });
  };

  // Handle Save Employee
  const handleSaveEmployee = async (updatedData) => {
    try {
      setLoading(true);
      const employeeData = {
        employee: {
          id: updatedData.id,
          name: updatedData.name,
          email: updatedData.email,
          is_active: updatedData.is_active
        }
      };

      const response = await employeeAPI.updateEmployee(updatedData.id, employeeData);

      if (response.success) {
        setEmployees(prev => prev.map(emp =>
          emp.id === updatedData.id ? {
            ...emp,
            name: updatedData.name,
            email: updatedData.email,
            is_active: updatedData.is_active,
            status: updatedData.is_active ? 'Active' : 'Inactive'
          } : emp
        ));
        toast.success('Employee updated successfully');
        return true;
      } else {
        toast.error(response.error || 'Failed to update employee');
        return false;
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Failed to update employee');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Employee
  const handleDeleteEmployee = async (employeeId) => {
    try {
      setLoading(true);
      const response = await employeeAPI.deleteEmployee(employeeId);

      if (response.success) {
        setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
        toast.success('Employee deleted successfully');
        return true;
      } else {
        toast.error(response.error || 'Failed to delete employee');
        return false;
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle Open Delete Modal
  const handleOpenDeleteModal = (employee) => {
    setModalState({
      isOpen: true,
      mode: 'delete',
      employeeData: employee
    });
  };

  // Task Management Functions
  const toggleTaskStatus = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
        const result = await taskAPI.updateTask(taskId, { ...task, status: newStatus });
        if (result.success) {
          toast.success(`Task marked as ${newStatus}`);
          await fetchTasks();
        } else {
          toast.error(result.error || 'Failed to update task');
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const result = await taskAPI.createTask(taskData);
      if (result.success) {
        toast.success('Task created successfully');
        await fetchTasks();
        return true;
      } else {
        toast.error(result.error || 'Failed to create task');
        return false;
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      return false;
    }
  };

  const handleTaskFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: taskForm.title,
      description: taskForm.description,
      task_type: taskForm.task_type,
      content: taskForm.content,
      required_document_type: taskForm.required_document_type,
      is_active: taskForm.is_active,
      due_date: taskForm.due_date || null,
      category: taskForm.category || null,
      assigned_to: taskForm.assigned_to || null
    };

    const success = await handleCreateTask(payload);
    if (success) {
      setShowCreateTaskModal(false);
      setTaskForm({
        title: '',
        description: '',
        task_type: 'read',
        content: '',
        required_document_type: 'aadhar',
        is_active: true,
        due_date: '',
        category: '',
        assigned_to: ''
      });
    }
  };

  const handleAssignTask = async (taskId, assignData) => {
    try {
      const result = await taskAPI.assignTask(taskId, assignData);
      if (result.success) {
        toast.success('Task assigned successfully');
        await fetchTasks();
        return true;
      } else {
        toast.error(result.error || 'Failed to assign task');
        return false;
      }
    } catch (error) {
      console.error('Error assigning task:', error);
      toast.error('Failed to assign task');
      return false;
    }
  };

  const handleAssignFormSubmit = async (e) => {
    e.preventDefault();
    if (selectedTask) {
      const success = await handleAssignTask(selectedTask.id, assignForm);
      if (success) {
        setShowAssignTaskModal(false);
        setAssignForm({
          employeeId: '',
          dueDate: ''
        });
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const result = await taskAPI.deleteTask(taskId);
        if (result.success) {
          toast.success('Task deleted successfully');
          await fetchTasks();
        } else {
          toast.error(result.error || 'Failed to delete task');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'done':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in progress':
      case 'in-progress':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Close modal
  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: 'view',
      employeeData: null
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'warning': return 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30';
      case 'suggestion': return 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30';
      case 'positive': return 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30';
      default: return 'bg-gray-50 dark:bg-gray-900/10 border-gray-100 dark:border-gray-900/30';
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'warning': return <FaExclamationTriangle className="text-red-600 dark:text-red-400" />;
      case 'suggestion': return <FaLightbulb className="text-indigo-600 dark:text-indigo-400" />;
      case 'positive': return <FaCheckCircle className="text-emerald-600 dark:text-emerald-400" />;
      default: return <FaLightbulb className="text-gray-600 dark:text-gray-400" />;
    }
  };

  // Render active section component
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <Overview
            employees={employees}
            tasks={tasks}
            documents={documents}
            dashboardData={dashboardData}
            getStatusColor={getStatusColor}
            getInsightColor={getInsightColor}
            getInsightIcon={getInsightIcon}
          />
        );
      case 'candidates':
        return (
          <Candidates
            employees={employees}
            handleEditEmployee={handleEditEmployee}
            handleViewEmployee={handleViewEmployee}
            handleOpenDeleteModal={handleOpenDeleteModal}
            getStatusColor={getStatusColor}
          />
        );
      case 'employees':
        return (
          <Employees
            employees={employees}
            handleEditEmployee={handleEditEmployee}
            handleViewEmployee={handleViewEmployee}
            handleOpenDeleteModal={handleOpenDeleteModal}
            getStatusColor={getStatusColor}
          />
        );
      case 'tasks':
        return (
          <TaskManagement
            tasks={filteredTasks}
            taskFilter={taskFilter}
            setTaskFilter={setTaskFilter}
            getPriorityColor={getPriorityColor}
            getStatusColor={getStatusColor}
            toggleTaskStatus={toggleTaskStatus}
            handleDeleteTask={handleDeleteTask}
            setShowCreateTaskModal={setShowCreateTaskModal}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            setShowAssignTaskModal={setShowAssignTaskModal}
            assignForm={assignForm}
            setAssignForm={setAssignForm}
            showCreateTaskModal={showCreateTaskModal}
            showAssignTaskModal={showAssignTaskModal}
            handleCreateTask={handleTaskFormSubmit}
            handleAssignTask={handleAssignFormSubmit}
            employees={employees}
          />
        );
      case 'documents':
        return (
          <Documents
            documents={documents}
            getStatusColor={getStatusColor}
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return (
          <Overview
            employees={employees}
            tasks={tasks}
            documents={documents}
            dashboardData={dashboardData}
            getStatusColor={getStatusColor}
            getInsightColor={getInsightColor}
            getInsightIcon={getInsightIcon}
          />
        );
    }
  };

  if (loading && activeSection === 'overview') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shrink-0">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200 dark:border-gray-800">
          <div className="bg-blue-600 aspect-square rounded-lg w-8 h-8 flex items-center justify-center text-white">
            <MdDashboard className="text-xl" />
          </div>
          <h1 className="text-gray-900 dark:text-white text-lg font-bold">Hive Desk</h1>
          <h2 className="text-gray900/80 dark:text-white/80.text-sm.font-medium">HR Portal</h2>

        </div>

        <div className="flex flex-col gap-2 p-4 overflow-y-auto">
          <SidebarItem
            icon={MdDashboard}
            label="Overview"
            active={activeSection === 'overview'}
            onClick={() => setActiveSection('overview')}
          />
          <SidebarItem
            icon={MdGroup}
            label="Candidates"
            active={activeSection === 'candidates'}
            onClick={() => setActiveSection('candidates')}
          />
          <SidebarItem
            icon={MdBadge}
            label="Employees"
            active={activeSection === 'employees'}
            onClick={() => setActiveSection('employees')}
          />
          <SidebarItem
            icon={FaTasks}
            label="Task Management"
            active={activeSection === 'tasks'}
            onClick={() => setActiveSection('tasks')}
          />
          <SidebarItem
            icon={MdDescription}
            label="Documents"
            active={activeSection === 'documents'}
            onClick={() => setActiveSection('documents')}
          />

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</p>
          </div>

          <SidebarItem
            icon={MdSettings}
            label="Settings"
            active={activeSection === 'settings'}
            onClick={() => setActiveSection('settings')}
          />
        </div>

        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">
                {user?.name?.charAt(0) || 'H'}
              </span>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'HR Manager'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">HR Manager</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-auto shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-8 py-6 w-full max-w-[1600px] mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">
                  {activeSection === 'overview' ? 'Onboarding Overview' :
                    activeSection === 'candidates' ? 'Candidates Management' :
                      activeSection === 'employees' ? 'Employee Management' :
                        activeSection === 'tasks' ? 'Task Management' :
                          activeSection === 'documents' ? 'Document Management' :
                            activeSection === 'settings' ? 'Settings' : 'HR Portal'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {activeSection === 'overview' ? 'Manage and track employee onboarding progress and velocity.' :
                    activeSection === 'candidates' ? 'Manage candidate applications and hiring process.' :
                      activeSection === 'employees' ? 'Manage employee information and activities.' :
                        activeSection === 'tasks' ? 'Create, assign, and track tasks for employees.' :
                          activeSection === 'documents' ? 'View and manage all uploaded documents.' :
                            activeSection === 'settings' ? 'Configure your HR portal settings.' : 'HR Management System'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {activeSection === 'tasks' && (
                  <>
                    <button
                      onClick={() => setShowCreateTaskModal(true)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                    >
                      <FaPlus />
                      Create Task
                    </button>
                  </>
                )}

                <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 shadow-sm">
                  <FaCalendarAlt className="text-[18px]" />
                  <span>Last 30 Days</span>
                  <FaFilter className="text-[16px]" />
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-bold shadow-md hover:bg-blue-700 transition-colors">
                  <FaDownload className="text-[20px]" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-8 pt-2">
          {renderActiveSection()}
        </main>
      </div>

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        employeeData={modalState.employeeData}
        onClose={closeModal}
        onSave={handleSaveEmployee}
        onDelete={() => handleDeleteEmployee(modalState.employeeData?.employee?.id || modalState.employeeData?.id)}
      />

      {/* Create Task Modal */}
      <TaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        title="Create New Task"
      >
        <form onSubmit={handleTaskFormSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Title *</label>
              <input
                type="text"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description *</label>
              <textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                rows="2"
                placeholder="Enter task description"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Task Type *</label>
                <select
                  value={taskForm.task_type}
                  onChange={(e) => setTaskForm({ ...taskForm, task_type: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                >
                  <option value="read">Read</option>
                  <option value="write">Write</option>
                  <option value="review">Review</option>
                  <option value="complete">Complete</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Document Type *</label>
                <select
                  value={taskForm.required_document_type}
                  onChange={(e) => setTaskForm({ ...taskForm, required_document_type: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                >
                  <option value="aadhar">Aadhar Card</option>
                  <option value="pan">PAN Card</option>
                  <option value="passport">Passport</option>
                  <option value="driving_license">Driving License</option>
                  <option value="voter_id">Voter ID</option>
                  <option value="bank_statement">Bank Statement</option>
                  <option value="salary_slip">Salary Slip</option>
                  <option value="offer_letter">Offer Letter</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Content</label>
              <textarea
                value={taskForm.content}
                onChange={(e) => setTaskForm({ ...taskForm, content: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                rows="2"
                placeholder="Additional content or instructions"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Due Date</label>
                <input
                  type="date"
                  value={taskForm.due_date}
                  onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category</label>
                <input
                  type="text"
                  value={taskForm.category}
                  onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="e.g., Documentation, Training"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Assign To</label>
              <select
                value={taskForm.assigned_to}
                onChange={(e) => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              >
                <option value="">Select employee</option>
                {employees && employees.map((employee) => (
                  <option key={employee.id} value={employee.email || employee.name}>
                    {employee.name} - {employee.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="is_active"
                checked={taskForm.is_active}
                onChange={(e) => setTaskForm({ ...taskForm, is_active: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700 dark:text-gray-300">
                Task is active
              </label>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => setShowCreateTaskModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Task
              </button>
            </div>
          </div>
        </form>
      </TaskModal>

      {/* Assign Task Modal */}
      <TaskModal
        isOpen={showAssignTaskModal}
        onClose={() => setShowAssignTaskModal(false)}
        title={`Assign Task: ${selectedTask?.title || ''}`}
      >
        <form onSubmit={handleAssignFormSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Assign To *</label>
              <select
                value={assignForm.employeeId}
                onChange={(e) => setAssignForm({ ...assignForm, employeeId: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              >
                <option value="">Select employee</option>
                {employees && employees.map((employee) => (
                  <option key={employee.id} value={employee.email || employee.id}>
                    {employee.name} - {employee.email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Due Date *</label>
              <input
                type="date"
                value={assignForm.dueDate}
                onChange={(e) => setAssignForm({ ...assignForm, dueDate: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              />
            </div>
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => setShowAssignTaskModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Assign Task
              </button>
            </div>
          </div>
        </form>
      </TaskModal>
    </div>
  );
};

export default HRDashboard;