// src/pages/HRDashboard.jsx
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
  FaCog,
  FaPlus,
  FaTrash,
  FaEdit,
  FaEye,
  FaUpload,
  FaUserPlus,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLightbulb,
  FaTasks,
  FaFileAlt,
  FaChartBar,
  FaFilter,
  FaCalendarAlt,
  FaDownload,
  FaExclamationCircle,
  FaClipboardList,
  FaFileUpload
} from "react-icons/fa";
import {
  MdDashboard,
  MdGroup,
  MdBadge,
  MdDescription,
  MdSettings
} from "react-icons/md";

// Default mock data
const DEFAULT_DASHBOARD_DATA = {
  stats: {
    total_onboarded: 10,
    in_progress: 28,
    pending_verification: 7,
    completion_rate: 94
  },
  velocity_data: [
    { month: 'May', hired: 20, projected: 25 },
    { month: 'Jun', hired: 25, projected: 30 },
    { month: 'Jul', hired: 30, projected: 35 },
    { month: 'Aug', hired: 35, projected: 40 },
    { month: 'Sep', hired: 40, projected: 45 },
    { month: 'Oct', hired: 45, projected: 50 }
  ],
  department_distribution: [
    { department: 'Engineering', percentage: 42 },
    { department: 'Sales', percentage: 28 },
    { department: 'Product', percentage: 18 },
    { department: 'Marketing', percentage: 12 }
  ],
  recent_candidates: [
    { id: 1, name: 'Michael Foster', role: 'Senior Engineer', department: 'Product', status: 'hired' },
    { id: 2, name: 'Sarah Connor', role: 'Marketing Lead', department: 'Marketing', status: 'pending' },
    { id: 3, name: 'David Chen', role: 'UX Designer', department: 'Design', status: 'review' }
  ],
  ai_insights: [
    {
      type: 'warning',
      title: 'Bottleneck Detected',
      message: 'Engineering background checks are taking 3 days longer than average this month.',
      action: 'View Pending Checks'
    },
    {
      type: 'suggestion',
      title: 'Recommendation',
      message: '5 candidates are pending I-9 verification for over 48 hours. Sending a reminder could improve velocity by 15%.',
      action: 'Nudge All'
    },
    {
      type: 'positive',
      title: 'Efficiency Up',
      message: 'Sales onboarding time has decreased by 12% since the new documentation process was implemented last week.'
    }
  ]
};

// Helper function to transform API employee data to match component format
const transformEmployeeData = (apiEmployees) => {
  if (!apiEmployees || !Array.isArray(apiEmployees)) return [];
  
  return apiEmployees.map(employee => ({
    id: employee.id || employee.employee_id,
    name: employee.name || 'Unknown Employee',
    email: employee.email || 'No email',
    department: employee.department || 'General', // You may need to add this field in your API
    position: employee.position || employee.role || 'Employee', // You may need to add this field
    status: employee.is_active ? 'Active' : 'Inactive',
    progress: employee.completion_rate || 0,
    total_tasks: employee.total_tasks || 0,
    completed_tasks: employee.completed_tasks || 0,
    is_active: employee.is_active || false
  }));
};

// Helper function to transform API task data
const transformTaskData = (apiTasks) => {
  if (!apiTasks || !Array.isArray(apiTasks)) return [];
  
  // If tasks come as strings, try to parse them
  if (typeof apiTasks[0] === 'string') {
    try {
      return apiTasks.map((taskString, index) => {
        // Try to extract meaningful info from string
        return {
          id: index + 1,
          title: taskString,
          assigned_to: 'Unknown',
          due_date: 'N/A',
          status: 'pending'
        };
      });
    } catch (error) {
      console.error('Error parsing task strings:', error);
      return [];
    }
  }
  
  return apiTasks.map(task => ({
    id: task.id || task.task_id,
    title: task.title || task.name || 'Unnamed Task',
    assigned_to: task.assigned_to || task.assigned_employee || 'Unassigned',
    due_date: task.due_date || task.deadline || 'No deadline',
    status: task.status || 'pending',
    description: task.description || '',
    priority: task.priority || 'medium'
  }));
};

// Helper function to transform API document data
const transformDocumentData = (apiDocuments) => {
  if (!apiDocuments || !Array.isArray(apiDocuments)) return [];
  
  // If documents come as strings, try to parse them
  if (typeof apiDocuments[0] === 'string') {
    try {
      return apiDocuments.map((docString, index) => {
        // Extract filename from string
        const filename = docString.split('/').pop() || docString;
        return {
          id: index + 1,
          name: filename,
          type: filename.split('.').pop() || 'file',
          uploaded_by: 'Unknown',
          uploaded_at: 'Recently',
          size: 'Unknown',
          url: docString
        };
      });
    } catch (error) {
      console.error('Error parsing document strings:', error);
      return [];
    }
  }
  
  return apiDocuments.map(doc => ({
    id: doc.id || doc.document_id,
    name: doc.name || doc.filename || 'Unnamed Document',
    type: doc.type || doc.file_type || 'file',
    uploaded_by: doc.uploaded_by || doc.uploader || 'Unknown',
    uploaded_at: doc.uploaded_at || doc.created_at || 'Recently',
    size: doc.size || 'Unknown',
    url: doc.url || doc.file_url || '#'
  }));
};

const HRDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(DEFAULT_DASHBOARD_DATA);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [activeSection, setActiveSection] = useState('overview');

  // Fetch all dashboard data
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch dashboard data
        const dashboardResponse = await dashboardAPI.getDashboard();
        console.log('Dashboard API Response:', dashboardResponse);
        
        if (dashboardResponse.success && dashboardResponse.data) {
          setDashboardData(dashboardResponse.data);
        } else {
          console.log('Using demo dashboard data');
          // Keep using default mock data
        }

        // Fetch employees
        const employeesResponse = await employeeAPI.getEmployees(1, 10);
        console.log('Employees API Response:', employeesResponse);
        
        if (employeesResponse.success && employeesResponse.data) {
          const apiEmployees = employeesResponse.data.employees || [];
          if (apiEmployees.length > 0) {
            const transformedEmployees = transformEmployeeData(apiEmployees);
            setEmployees(transformedEmployees);
          } else {
            setEmployees([]); // Set empty array if no employees
          }
        } else {
          setEmployees([]); // Set empty array on error
          if (employeesResponse.error) {
            toast.error(`Failed to load employees: ${employeesResponse.error}`);
          }
        }

        // Fetch tasks
        const tasksResponse = await taskAPI.getTasks(1, 10);
        console.log('Tasks API Response:', tasksResponse);
        
        if (tasksResponse.success && tasksResponse.data) {
          const apiTasks = tasksResponse.data.tasks || [];
          if (apiTasks.length > 0) {
            const transformedTasks = transformTaskData(apiTasks);
            setTasks(transformedTasks);
          } else {
            setTasks([]); // Set empty array if no tasks
          }
        } else {
          setTasks([]); // Set empty array on error
          if (tasksResponse.error) {
            toast.error(`Failed to load tasks: ${tasksResponse.error}`);
          }
        }

        // Fetch documents
        const documentsResponse = await documentAPI.getDocuments(1, 10);
        console.log('Documents API Response:', documentsResponse);
        
        if (documentsResponse.success && documentsResponse.data) {
          const apiDocuments = documentsResponse.data.documents || [];
          if (apiDocuments.length > 0) {
            const transformedDocuments = transformDocumentData(apiDocuments);
            setDocuments(transformedDocuments);
          } else {
            setDocuments([]); // Set empty array if no documents
          }
        } else {
          setDocuments([]); // Set empty array on error
          if (documentsResponse.error) {
            toast.error(`Failed to load documents: ${documentsResponse.error}`);
          }
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load live data. Showing demo data.');
        // Set empty arrays for all data
        setEmployees([]);
        setTasks([]);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'hired':
      case 'active':
      case 'completed':
      case 'done':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
      case 'onboarding':
      case 'in_progress':
      case 'in-progress':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'review':
      case 'needs_review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'inactive':
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getInsightColor = (type) => {
    switch(type) {
      case 'warning': return 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30';
      case 'suggestion': return 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30';
      case 'positive': return 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30';
      default: return 'bg-gray-50 dark:bg-gray-900/10 border-gray-100 dark:border-gray-900/30';
    }
  };

  const getInsightIcon = (type) => {
    switch(type) {
      case 'warning': return <FaExclamationTriangle className="text-red-600" />;
      case 'suggestion': return <FaLightbulb className="text-indigo-600" />;
      case 'positive': return <FaCheckCircle className="text-emerald-600" />;
      default: return <FaLightbulb className="text-gray-600" />;
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-3 group hover:border-blue-500/50 transition-colors">
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        {change && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            change.startsWith('+') 
              ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' 
              : 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-gray-900 dark:text-white text-3xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );

  const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-colors ${
        active 
          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  // Safety check functions
  const getSafeStats = () => {
    return dashboardData?.stats || DEFAULT_DASHBOARD_DATA.stats;
  };

  const getSafeVelocityData = () => {
    return dashboardData?.velocity_data || DEFAULT_DASHBOARD_DATA.velocity_data;
  };

  const getSafeDepartmentDistribution = () => {
    return dashboardData?.department_distribution || DEFAULT_DASHBOARD_DATA.department_distribution;
  };

  const getSafeRecentCandidates = () => {
    return dashboardData?.recent_candidates || DEFAULT_DASHBOARD_DATA.recent_candidates;
  };

  const getSafeAIInsights = () => {
    return dashboardData?.ai_insights || DEFAULT_DASHBOARD_DATA.ai_insights;
  };

  if (loading) {
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
          <h1 className="text-gray-900 dark:text-white text-lg font-bold">HR Portal</h1>
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
                  Onboarding Overview
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Manage and track employee onboarding progress and velocity.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 shadow-sm">
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
          <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Employees"
                value={employees.length}
                icon={FaUserPlus}
                color="bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                change={`${employees.filter(e => e.is_active).length} active`}
              />
              <StatCard
                title="Total Tasks"
                value={tasks.length}
                icon={FaTasks}
                color="bg-amber-50 dark:bg-amber-900/20 text-amber-600"
                change={`${tasks.filter(t => t.status === 'completed').length} completed`}
              />
              <StatCard
                title="Total Documents"
                value={documents.length}
                icon={FaFileAlt}
                color="bg-red-50 dark:bg-red-900/20 text-red-600"
                change="Uploaded"
              />
              <StatCard
                title="Avg Completion"
                value={`${employees.length > 0 
                  ? Math.round(employees.reduce((sum, emp) => sum + (emp.progress || 0), 0) / employees.length)
                  : 0}%`}
                icon={FaChartBar}
                color="bg-purple-50 dark:bg-purple-900/20 text-purple-600"
                change="Overall"
              />
            </div>

            {/* Split View: Charts & AI Insights */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Main Charts Section */}
              <div className="xl:col-span-2 flex flex-col gap-8">
                {/* Chart 1: Velocity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-gray-900 dark:text-white text-lg font-bold">Onboarding Velocity</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Hires processed over the last 6 months</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                        <span className="block w-2 h-2 rounded-full bg-blue-600"></span>
                        Hired
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                        <span className="block w-2 h-2 rounded-full bg-gray-300"></span>
                        Projected
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full h-[280px]">
                    {/* Simplified Chart */}
                    <div className="w-full h-full flex items-end justify-between pt-4">
                      {getSafeVelocityData().map((data, index) => (
                        <div key={index} className="flex flex-col items-center w-16">
                          <div className="w-8 bg-gray-200 dark:bg-gray-700 rounded-t mb-2" style={{ height: `${data.projected * 4}px` }}>
                            <div 
                              className="w-8 bg-blue-600 rounded-t" 
                              style={{ height: `${data.hired * 4}px` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tasks & Documents Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Tasks Section */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/10 dark:to-amber-800/10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-900 dark:text-white text-lg font-bold flex items-center gap-2">
                          <FaClipboardList className="text-amber-600" />
                          Recent Tasks
                        </h3>
                        <span className="text-xs font-medium px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-full">
                          {tasks.length} total
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[400px]">
                      {tasks.length > 0 ? (
                        <div className="flex flex-col">
                          {tasks.slice(0, 5).map((task, index) => (
                            <div key={task.id || index} className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                task.status === 'completed' ? 'bg-green-100 text-green-600' :
                                task.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                                'bg-amber-100 text-amber-600'
                              }`}>
                                <FaTasks className="text-sm" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                  <span>Assigned: {task.assigned_to}</span>
                                  <span>•</span>
                                  <span>Due: {task.due_date}</span>
                                </div>
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <FaExclamationCircle className="text-3xl text-gray-300 dark:text-gray-600 mb-3" />
                          <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Tasks will appear here when assigned</p>
                        </div>
                      )}
                    </div>
                    {tasks.length > 0 && (
                      <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                          View All Tasks →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Documents Section */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-800/10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-900 dark:text-white text-lg font-bold flex items-center gap-2">
                          <FaFileUpload className="text-blue-600" />
                          Recent Documents
                        </h3>
                        <span className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full">
                          {documents.length} total
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[400px]">
                      {documents.length > 0 ? (
                        <div className="flex flex-col">
                          {documents.slice(0, 5).map((doc, index) => (
                            <div key={doc.id || index} className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <FaFileAlt className="text-sm" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                  {doc.name}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                  <span>By: {doc.uploaded_by}</span>
                                  <span>•</span>
                                  <span>Type: {doc.type}</span>
                                  <span>•</span>
                                  <span>{doc.size}</span>
                                </div>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {doc.uploaded_at}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <FaExclamationCircle className="text-3xl text-gray-300 dark:text-gray-600 mb-3" />
                          <p className="text-gray-500 dark:text-gray-400">No documents found</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Documents will appear here when uploaded</p>
                        </div>
                      )}
                    </div>
                    {documents.length > 0 && (
                      <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                          View All Documents →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Insight Panel */}
              <div className="xl:col-span-1">
                <div className="h-full bg-white dark:bg-gray-800 rounded-xl border border-blue-500/20 shadow-lg dark:shadow-none flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700 relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 text-white">
                        <FaLightbulb className="text-[18px]" />
                      </div>
                      <h3 className="text-gray-900 dark:text-white text-lg font-bold">AI Insights</h3>
                    </div>
                    <span className="bg-blue-500/10 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      Beta
                    </span>
                  </div>
                  
                  <div className="p-6 flex flex-col gap-6 relative z-10 overflow-y-auto max-h-[800px]">
                    {getSafeAIInsights().map((insight, index) => (
                      <div key={index} className={`flex flex-col gap-3 p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getInsightIcon(insight.type)}
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${
                              insight.type === 'warning' ? 'text-red-800 dark:text-red-400' :
                              insight.type === 'suggestion' ? 'text-indigo-800 dark:text-indigo-400' :
                              'text-emerald-800 dark:text-emerald-400'
                            }`}>
                              {insight.title}
                            </p>
                            <p className={`text-xs mt-1 leading-relaxed ${
                              insight.type === 'warning' ? 'text-red-700 dark:text-red-300' :
                              insight.type === 'suggestion' ? 'text-indigo-700 dark:text-indigo-300' :
                              'text-emerald-700 dark:text-emerald-300'
                            }`}>
                              {insight.message}
                            </p>
                          </div>
                        </div>
                        {insight.action && (
                          <button className="w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-semibold py-2 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                            {insight.action}
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>AI analysis updated 15m ago</span>
                        <button className="text-blue-600 hover:underline">Refresh</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors text-sm font-medium">
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
                        <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                <span className="text-blue-600 font-bold">
                                  {employee.name.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {employee.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {employee.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white">{employee.department}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white">{employee.position}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                              {employee.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" 
                                  style={{ width: `${employee.progress}%` }}
                                ></div>
                              </div>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {employee.progress}%
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <span className="text-gray-700 dark:text-gray-300">{employee.completed_tasks || 0}</span>
                              <span className="text-gray-400 dark:text-gray-500">/</span>
                              <span className="text-gray-900 dark:text-white font-medium">{employee.total_tasks || 0}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">tasks</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button 
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                title="View"
                              >
                                <FaEye />
                              </button>
                              <button 
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                    <FaUserPlus className="text-4xl text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Employees Found</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                      There are no employees in the system yet. Add your first employee to get started.
                    </p>
                    <button className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors text-sm font-medium">
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
        </main>
      </div>
    </div>
  );
};

export default HRDashboard;