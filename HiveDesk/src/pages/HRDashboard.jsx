// src/pages/HRDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  dashboardAPI, 
  employeeAPI, 
  taskAPI, 
  documentAPI, 
  trainingAPI,
  performanceAPI 
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
 
} from "react-icons/fa";
// import {FaWarning} from 'react-icons/fa6';
// import { FaTrendingUp } from "react-icons/fa";
import {
  MdDashboard,
  MdGroup,
  MdBadge,
  MdDescription,
  MdSettings
} from "react-icons/md";
const HRDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [activeSection, setActiveSection] = useState('overview');

  // Fetch all dashboard data
  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch dashboard data
        const dashboardResponse = await dashboardAPI.getDashboard(user.name, user.role);
        if (dashboardResponse.success) {
          setDashboardData(dashboardResponse.data);
        }

        // Fetch employees
        const employeesResponse = await employeeAPI.getEmployees(user.name, user.role);
        if (employeesResponse.success) {
          setEmployees(employeesResponse.data.employees || []);
        }

        // Fetch tasks
        const tasksResponse = await taskAPI.getTasks(user.name, user.role);
        if (tasksResponse.success) {
          setTasks(tasksResponse.data.tasks || []);
        }

        // Fetch documents
        const documentsResponse = await documentAPI.getDocuments(user.name, user.role);
        if (documentsResponse.success) {
          setDocuments(documentsResponse.data.documents || []);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        
        // Mock data for development
        setDashboardData({
          stats: {
            total_onboarded: 142,
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
        });

        setEmployees([
          { id: 1, name: 'John Doe', email: 'john@company.com', department: 'Engineering', position: 'Software Engineer', status: 'Active', progress: 85 },
          { id: 2, name: 'Jane Smith', email: 'jane@company.com', department: 'Product', position: 'Product Manager', status: 'Onboarding', progress: 45 },
          { id: 3, name: 'Robert Johnson', email: 'robert@company.com', department: 'Design', position: 'UX Designer', status: 'Active', progress: 90 }
        ]);

        setTasks([
          { id: 1, title: 'Review John Doe documents', assigned_to: 'John Doe', due_date: '2024-02-01', status: 'completed' },
          { id: 2, title: 'Assign training modules', assigned_to: 'Jane Smith', due_date: '2024-02-05', status: 'in_progress' },
          { id: 3, title: 'Schedule orientation', assigned_to: 'Robert Johnson', due_date: '2024-02-03', status: 'pending' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'hired':
      case 'active':
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
      case 'onboarding':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'review':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
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
      case 'warning': return <FaBell className="text-red-600" />;
      case 'suggestion': return <FaLightbulb className="text-indigo-600" />;
      case 'positive': return <FaLightbulb className="text-emerald-600" />;
      default: return <FaBell className="text-gray-600" />;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                title="Total Onboarded"
                value={dashboardData?.stats?.total_onboarded || 142}
                icon={FaUserPlus}
                color="bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                change="+12%"
              />
              <StatCard
                title="In Progress"
                value={dashboardData?.stats?.in_progress || 28}
                icon={FaTasks}
                color="bg-amber-50 dark:bg-amber-900/20 text-amber-600"
                change="+5%"
              />
              <StatCard
                title="Pending Verification"
                value={dashboardData?.stats?.pending_verification || 7}
                icon={FaFileAlt}
                color="bg-red-50 dark:bg-red-900/20 text-red-600"
                change="-2%"
              />
              <StatCard
                title="Completion Rate"
                value={`${dashboardData?.stats?.completion_rate || 94}%`}
                icon={FaChartBar}
                color="bg-purple-50 dark:bg-purple-900/20 text-purple-600"
                change="Target: 95%"
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
                      {dashboardData?.velocity_data?.map((data, index) => (
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

                {/* Chart 2 & 3: Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Department Wise */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4">Department Distribution</h3>
                    <div className="flex flex-col gap-5 flex-1 justify-center">
                      {dashboardData?.department_distribution?.map((dept, index) => (
                        <div key={index} className="w-full">
                          <div className="flex justify-between mb-1 text-sm font-medium">
                            <span className="text-gray-700 dark:text-gray-300">{dept.department}</span>
                            <span className="text-gray-500 dark:text-gray-400">{dept.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full bg-blue-600" 
                              style={{ width: `${dept.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity List */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                      <h3 className="text-gray-900 dark:text-white text-lg font-bold">Recent Candidates</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <div className="flex flex-col">
                        {dashboardData?.recent_candidates?.map((candidate, index) => (
                          <div key={index} className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                              <span className="text-blue-600 font-bold">
                                {candidate.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {candidate.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {candidate.role} • {candidate.department}
                              </p>
                            </div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(candidate.status)}`}>
                              {candidate.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
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
                    {dashboardData?.ai_insights?.map((insight, index) => (
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
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Employee Management</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Manage all employees and their onboarding status</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    <FaPlus />
                    Add Employee
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
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
                          <div className="flex space-x-2">
                            <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                              <FaEdit />
                            </button>
                            <button className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HRDashboard;