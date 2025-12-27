// src/pages/EmployeeDashboard.js
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { 
  FaTasks, FaGraduationCap, FaFileAlt, FaUser, FaCalendarAlt, 
  FaCheckCircle, FaClock, FaBuilding, FaUpload, FaSignOutAlt, 
  FaBell, FaEnvelope, FaCog, FaQuestionCircle 
} from 'react-icons/fa'

const EmployeeDashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete tax forms', completed: true, dueDate: '2024-02-01', priority: 'high' },
    { id: 2, title: 'Setup work email', completed: true, dueDate: '2024-02-01', priority: 'medium' },
    { id: 3, title: 'Complete security training', completed: false, dueDate: '2024-02-05', priority: 'high' },
    { id: 4, title: 'Meet with manager', completed: false, dueDate: '2024-02-06', priority: 'medium' },
    { id: 5, title: 'IT equipment setup', completed: false, dueDate: '2024-02-03', priority: 'low' },
    { id: 6, title: 'Read company handbook', completed: false, dueDate: '2024-02-07', priority: 'medium' },
  ])

  const [trainings, setTrainings] = useState([
    { id: 1, title: 'Company Policies', duration: '30 min', completed: true, category: 'mandatory' },
    { id: 2, title: 'Security Awareness', duration: '45 min', completed: true, category: 'mandatory' },
    { id: 3, title: 'Software Tools', duration: '60 min', completed: false, category: 'technical' },
    { id: 4, title: 'Team Collaboration', duration: '40 min', completed: false, category: 'soft-skills' },
    { id: 5, title: 'Workplace Safety', duration: '35 min', completed: false, category: 'mandatory' },
  ])

  const [documents, setDocuments] = useState([
    { id: 1, name: 'Employment Contract', status: 'verified', date: '2024-01-15' },
    { id: 2, name: 'Tax Forms', status: 'pending', date: '2024-01-20' },
    { id: 3, name: 'ID Proof', status: 'required', date: null },
    { id: 4, name: 'Bank Details', status: 'pending', date: '2024-01-25' },
    { id: 5, name: 'Emergency Contact', status: 'verified', date: '2024-01-18' },
  ])

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (!userData) {
      toast.error('Please login first')
      navigate('/login')
      return
    }
    
    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      // Check if user is employee (not HR)
      if (parsedUser.role === 'hr') {
        toast.error('Please use HR dashboard')
        navigate('/hr-dashboard')
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
      toast.error('Session expired. Please login again.')
      navigate('/login')
    }
  }, [navigate])

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
    toast.success('Task status updated!')
  }

  const toggleTraining = (id) => {
    setTrainings(trainings.map(training =>
      training.id === id ? { ...training, completed: !training.completed } : training
    ))
    toast.success('Training status updated!')
  }

  const handleUploadDocument = () => {
    toast.success('Document upload triggered!')
    // In a real app, this would open a file upload dialog
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    toast.success('Logged out successfully!')
    navigate('/login')
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const completedTrainings = trainings.filter(training => training.completed).length
  const totalTrainings = trainings.length
  const trainingProgress = totalTrainings > 0 ? Math.round((completedTrainings / totalTrainings) * 100) : 0

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'required': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category) => {
    switch(category) {
      case 'mandatory': return 'bg-red-50 text-red-700 border-red-200'
      case 'technical': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'soft-skills': return 'bg-purple-50 text-purple-700 border-purple-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
                  <FaBuilding className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">Employee Portal</span>
                  <p className="text-xs text-gray-500">Onboarding & Task Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 md:space-x-6">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <FaBell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 hidden md:block">
                <FaEnvelope className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 hidden md:block">
                <FaQuestionCircle className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.name?.charAt(0) || 'E'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Employee'}</p>
                  <p className="text-xs text-gray-500">Onboarding in progress</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaSignOutAlt />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-4 md:p-6 lg:p-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-600 to-teal-700 rounded-2xl shadow-xl text-white p-6 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
              <p className="text-green-100 mb-4">
                Your onboarding journey is {progress}% complete. Keep going to unlock all benefits!
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <FaUser className="mr-2" />
                  <span className="text-sm">Software Engineer</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <FaCalendarAlt className="mr-2" />
                  <span className="text-sm">Start Date: Jan 15, 2024</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <FaCheckCircle className="mr-2" />
                  <span className="text-sm">{completedTasks}/{totalTasks} tasks done</span>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 min-w-[200px]">
              <div className="text-center">
                <div className="text-3xl font-bold">{progress}%</div>
                <div className="text-sm text-green-100 mt-1">Overall Progress</div>
                <div className="mt-4 w-full bg-white/30 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-white to-green-100 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Tasks & Training */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tasks Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <FaTasks className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Onboarding Tasks</h2>
                    <p className="text-sm text-gray-600">Complete these tasks to finish onboarding</p>
                  </div>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium">
                  {completedTasks} of {totalTasks} completed
                </div>
              </div>

              <div className="space-y-4">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      task.completed 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                        : 'bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center mr-4 transition-all ${
                            task.completed 
                              ? 'bg-green-500 border-green-500 hover:bg-green-600' 
                              : 'border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {task.completed && <FaCheckCircle className="text-white text-xs" />}
                        </button>
                        <div>
                          <div className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.title}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center text-sm text-gray-500">
                              <FaClock className="mr-1" />
                              <span>Due: {task.dueDate}</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                      {!task.completed && (
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Training Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <FaGraduationCap className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Required Training</h2>
                    <p className="text-sm text-gray-600">Complete mandatory training modules</p>
                  </div>
                </div>
                <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg font-medium">
                  {completedTrainings} of {totalTrainings} completed
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainings.map((training) => (
                  <div 
                    key={training.id} 
                    className={`p-5 rounded-xl border transition-all duration-300 hover:shadow-sm ${
                      training.completed 
                        ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200' 
                        : 'bg-gradient-to-r from-gray-50 to-purple-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`font-medium ${training.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {training.title}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(training.category)}`}>
                            {training.category}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          Duration: {training.duration}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleTraining(training.id)}
                        className={`px-4 py-2 text-sm rounded-lg transition-all ${
                          training.completed
                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-sm hover:shadow'
                        }`}
                      >
                        {training.completed ? 'Completed' : 'Start'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Progress Overview</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-600 font-medium">Tasks</span>
                    <span className="font-bold text-blue-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-600 font-medium">Training</span>
                    <span className="font-bold text-purple-600">{trainingProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${trainingProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-600 font-medium">Documents</span>
                    <span className="font-bold text-green-600">
                      {Math.round((documents.filter(d => d.status === 'verified').length / documents.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-teal-600 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.round((documents.filter(d => d.status === 'verified').length / documents.length) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <FaFileAlt className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                </div>
                <button
                  onClick={handleUploadDocument}
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all text-sm"
                >
                  <FaUpload />
                  Upload
                </button>
              </div>
              
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="font-medium text-sm">{doc.name}</div>
                      <div className="text-xs text-gray-500">
                        {doc.date ? `Submitted: ${doc.date}` : 'Not submitted'}
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Events</h3>
              
              <div className="space-y-5">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-xl mr-4">
                    <FaCalendarAlt className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Team Meeting</div>
                    <div className="text-sm text-gray-500">Tomorrow, 10:00 AM</div>
                    <div className="text-xs text-blue-600 mt-1">Main Conference Room</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-xl mr-4">
                    <FaGraduationCap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Training Session</div>
                    <div className="text-sm text-gray-500">Feb 5, 2:00 PM</div>
                    <div className="text-xs text-purple-600 mt-1">Virtual - Zoom</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-xl mr-4">
                    <FaUser className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">1:1 with Manager</div>
                    <div className="text-sm text-gray-500">Feb 6, 11:00 AM</div>
                    <div className="text-xs text-green-600 mt-1">HR Department</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-xl mr-4">
                    <FaTasks className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Project Kickoff</div>
                    <div className="text-sm text-gray-500">Feb 8, 9:30 AM</div>
                    <div className="text-xs text-yellow-600 mt-1">Building B, Room 302</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <div className="text-sm text-gray-600">Completed Tasks</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">{trainings.length}</div>
            <div className="text-sm text-gray-600">Training Modules</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">
              {documents.filter(d => d.status === 'verified').length}
            </div>
            <div className="text-sm text-gray-600">Verified Docs</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard