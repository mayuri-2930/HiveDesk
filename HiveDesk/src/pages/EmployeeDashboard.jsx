// src/pages/EmployeeDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaTasks,
  FaGraduationCap,
  FaFileAlt,
  FaUser,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaBuilding,
  FaUpload,
  FaSignOutAlt,
  FaBell,
  FaFilter,
  FaDownload,
  FaHome,
  FaChartBar
} from 'react-icons/fa';
import {
  MdDashboard,
  MdSettings
} from 'react-icons/md';

// Import Employee Dashboard Components
import EmpHome from "../components/EmployeeDashboard/EmpHome";
import EmpTasks from "../components/EmployeeDashboard/EmpTasks";
import EmpProgress from "../components/EmployeeDashboard/EmpProgress";
import EmpDocs from "../components/EmployeeDashboard/EmpDocs";
import EmpSettings from "../components/EmployeeDashboard/EmpSettings";

// Sidebar Item Component
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-colors ${
      active
        ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
    }`}
  >
    <Icon className="h-5 w-5" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  // Task State
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete tax forms', completed: true, dueDate: '2024-02-01', priority: 'high' },
    { id: 2, title: 'Setup work email', completed: true, dueDate: '2024-02-01', priority: 'medium' },
    { id: 3, title: 'Complete security training', completed: false, dueDate: '2024-02-05', priority: 'high' },
    { id: 4, title: 'Meet with manager', completed: false, dueDate: '2024-02-06', priority: 'medium' },
    { id: 5, title: 'IT equipment setup', completed: false, dueDate: '2024-02-03', priority: 'low' },
    { id: 6, title: 'Read company handbook', completed: false, dueDate: '2024-02-07', priority: 'medium' },
  ]);

  // Training State
  const [trainings, setTrainings] = useState([
    { id: 1, title: 'Company Policies', duration: '30 min', completed: true, category: 'mandatory' },
    { id: 2, title: 'Security Awareness', duration: '45 min', completed: true, category: 'mandatory' },
    { id: 3, title: 'Software Tools', duration: '60 min', completed: false, category: 'technical' },
    { id: 4, title: 'Team Collaboration', duration: '40 min', completed: false, category: 'soft-skills' },
    { id: 5, title: 'Workplace Safety', duration: '35 min', completed: false, category: 'mandatory' },
  ]);

  // Documents State
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Employment Contract', status: 'verified', date: '2024-01-15' },
    { id: 2, name: 'Tax Forms', status: 'pending', date: '2024-01-20' },
    { id: 3, name: 'ID Proof', status: 'required', date: null },
    { id: 4, name: 'Bank Details', status: 'pending', date: '2024-01-25' },
    { id: 5, name: 'Emergency Contact', status: 'verified', date: '2024-01-18' },
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to Employee Portal', message: 'Start your onboarding journey', time: '10:30 AM', read: true },
    { id: 2, title: 'New Task Assigned', message: 'Complete tax forms by Feb 1', time: 'Yesterday', read: false },
    { id: 3, title: 'Training Reminder', message: 'Security training due in 3 days', time: '2 hours ago', read: false },
  ]);

  // Activities State
  const [activities, setActivities] = useState([
    { id: 1, action: 'Completed task', details: 'Tax forms submission', time: 'Today, 9:30 AM', icon: 'check' },
    { id: 2, action: 'Started training', details: 'Company Policies module', time: 'Yesterday, 3:45 PM', icon: 'book' },
    { id: 3, action: 'Uploaded document', details: 'ID Proof uploaded', time: 'Jan 25, 11:20 AM', icon: 'upload' },
    { id: 4, action: 'Task assigned', details: 'Security training assigned', time: 'Jan 24, 2:15 PM', icon: 'assignment' },
  ]);

  // Authentication Effect
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      // Check if user is logged in
      const userData = localStorage.getItem('user');

      if (!userData) {
        toast.error('Please login first');
        navigate('/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Check if user is employee (not HR)
        if (parsedUser.role === 'hr') {
          toast.error('Please use HR dashboard');
          navigate('/hr-dashboard');
          return;
        }

        // Add default fields if missing
        if (!parsedUser.startDate) {
          parsedUser.startDate = 'Jan 15, 2024';
        }
        if (!parsedUser.position) {
          parsedUser.position = 'Software Engineer';
        }
        if (!parsedUser.employeeId) {
          parsedUser.employeeId = 'EMP-2024-001';
        }
        if (!parsedUser.department) {
          parsedUser.department = 'Engineering';
        }

        setTimeout(() => {
          toast.success(`Welcome back, ${parsedUser.name}!`);
        }, 100);
      } catch (error) {
        console.error('Error parsing user data:', error);
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    checkAuth();

    return () => {
      const timeoutIds = setTimeout(() => {}, 0);
      clearTimeout(timeoutIds);
    };
  }, [navigate]);

  // Task Functions
  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    toast.success('Task status updated!');
  };

  const toggleTraining = (id) => {
    setTrainings(trainings.map(training =>
      training.id === id ? { ...training, completed: !training.completed } : training
    ));
    toast.success('Training status updated!');
  };

  const updateTrainingProgress = (trainingId, progress) => {
    setTrainings(prevTrainings =>
      prevTrainings.map(training =>
        training.id === trainingId
          ? {
              ...training,
              progress: Math.min(100, Math.max(0, progress)),
              completed: progress === 100
            }
          : training
      )
    );

    if (progress === 100) {
      const training = trainings.find(t => t.id === trainingId);
      toast.success(`Completed training: ${training.title}`);
    }
  };

  // Document Functions
  const uploadDocument = (file, documentId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setDocuments(prevDocs =>
          prevDocs.map(doc =>
            doc.id === documentId
              ? {
                  ...doc,
                  status: 'pending',
                  date: new Date().toISOString().split('T')[0],
                  fileName: file.name
                }
              : doc
          )
        );

        const document = documents.find(d => d.id === documentId);
        toast.success(`Uploaded ${file.name} for ${document.name}`);

        resolve({ success: true });
      }, 1500);
    });
  };

  const deleteDocument = (documentId) => {
    const document = documents.find(d => d.id === documentId);
    setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId));
    toast.success(`Removed ${document.name}`);
  };

  // Notification Functions
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  // User Functions
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const updateUserProfile = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...currentUser, ...updatedData }));

    toast.success('Profile updated successfully');
  };

  // Progress Calculations
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const completedTrainings = trainings.filter(training => training.completed).length;
  const totalTrainings = trainings.length;
  const trainingProgress = totalTrainings > 0 ? Math.round((completedTrainings / totalTrainings) * 100) : 0;

  const verifiedDocs = documents.filter(doc => doc.status === 'verified').length;
  const totalDocs = documents.length;
  const docsProgress = totalDocs > 0 ? Math.round((verifiedDocs / totalDocs) * 100) : 0;

  const overallProgress = Math.round((taskProgress + trainingProgress + docsProgress) / 3);

  // Statistics
  const stats = {
    tasks: {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      highPriority: tasks.filter(t => t.priority === 'high').length
    },
    trainings: {
      total: trainings.length,
      completed: trainings.filter(t => t.completed).length,
      inProgress: trainings.filter(t => !t.completed).length,
      mandatory: trainings.filter(t => t.category === 'mandatory').length
    },
    documents: {
      total: documents.length,
      verified: documents.filter(d => d.status === 'verified').length,
      pending: documents.filter(d => d.status === 'pending').length,
      required: documents.filter(d => d.status === 'required').length
    }
  };

  // Render active section component
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <EmpHome
            user={user}
            tasks={tasks}
            trainings={trainings}
            documents={documents}
            activities={activities}
            stats={stats}
            overallProgress={overallProgress}
            taskProgress={taskProgress}
            trainingProgress={trainingProgress}
            docsProgress={docsProgress}
            onToggleTask={toggleTask}
          />
        );
      case 'tasks':
        return (
          <EmpTasks
            tasks={tasks}
            trainings={trainings}
            onToggleTask={toggleTask}
            onUpdateTraining={updateTrainingProgress}
          />
        );
      case 'progress':
        return (
          <EmpProgress
            taskProgress={taskProgress}
            trainingProgress={trainingProgress}
            docsProgress={docsProgress}
            overallProgress={overallProgress}
            tasks={tasks}
            trainings={trainings}
            documents={documents}
            activities={activities}
          />
        );
      case 'documents':
        return (
          <EmpDocs
            documents={documents}
            onUpload={uploadDocument}
            onDelete={deleteDocument}
          />
        );
      case 'settings':
        return (
          <EmpSettings
            user={user}
            onUpdateProfile={updateUserProfile}
          />
        );
      default:
        return (
          <EmpHome
            user={user}
            tasks={tasks}
            trainings={trainings}
            documents={documents}
            activities={activities}
            stats={stats}
            overallProgress={overallProgress}
            taskProgress={taskProgress}
            trainingProgress={trainingProgress}
            docsProgress={docsProgress}
            onToggleTask={toggleTask}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shrink-0">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200 dark:border-gray-800">
          <div className="bg-green-600 aspect-square rounded-lg w-8 h-8 flex items-center justify-center text-white">
            <FaBuilding className="text-xl" />
          </div>
          <div>
            <h1 className="text-gray-900 dark:text-white text-lg font-bold">Hive Desk</h1>
            <h2 className="text-gray-900/80 dark:text-white/80 text-sm font-medium">Employee Portal</h2>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-4 overflow-y-auto">
          <SidebarItem
            icon={FaHome}
            label="Home"
            active={activeSection === 'home'}
            onClick={() => setActiveSection('home')}
          />
          <SidebarItem
            icon={FaTasks}
            label="My Tasks"
            active={activeSection === 'tasks'}
            onClick={() => setActiveSection('tasks')}
          />
          <SidebarItem
            icon={FaChartBar}
            label="Progress"
            active={activeSection === 'progress'}
            onClick={() => setActiveSection('progress')}
          />
          <SidebarItem
            icon={FaFileAlt}
            label="Documents"
            active={activeSection === 'documents'}
            onClick={() => setActiveSection('documents')}
          />

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
          </div>

          <SidebarItem
            icon={MdSettings}
            label="Settings"
            active={activeSection === 'settings'}
            onClick={() => setActiveSection('settings')}
          />
        </div>

        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold">
                {user?.name?.charAt(0) || 'E'}
              </span>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Employee'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.position || 'Position'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
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
                  {activeSection === 'home' ? 'Dashboard Home' :
                    activeSection === 'tasks' ? 'My Tasks & Training' :
                      activeSection === 'progress' ? 'Onboarding Progress' :
                        activeSection === 'documents' ? 'Document Management' :
                          activeSection === 'settings' ? 'Account Settings' : 'Employee Portal'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {activeSection === 'home' ? 'Welcome to your employee dashboard' :
                    activeSection === 'tasks' ? 'Manage your tasks and complete training modules' :
                      activeSection === 'progress' ? 'Track your onboarding progress and milestones' :
                        activeSection === 'documents' ? 'Upload and manage your documents' :
                          activeSection === 'settings' ? 'Manage your account preferences' : 'Employee Management System'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 shadow-sm">
                  <FaCalendarAlt className="text-[18px]" />
                  <span>Last 30 Days</span>
                  <FaFilter className="text-[16px]" />
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-green-600 text-white text-sm font-bold shadow-md hover:bg-green-700 transition-colors">
                  <FaDownload className="text-[20px]" />
                  <span>Export Progress</span>
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
    </div>
  );
};

export default EmployeeDashboard;