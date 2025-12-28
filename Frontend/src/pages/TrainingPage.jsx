import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaGraduationCap, FaPlay, FaCheckCircle, FaClock, FaBook, FaVideo, FaChartLine, FaUsers } from 'react-icons/fa'

const TrainingPage = ({ role }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  
  // Mock training data
  const [trainings, setTrainings] = useState([
    {
      id: 1,
      title: 'Company Policies & Culture',
      description: 'Learn about our company values, policies, and workplace culture',
      duration: '45 min',
      category: 'Compliance',
      status: 'completed',
      progress: 100,
      type: 'Video',
      dueDate: '2024-02-01'
    },
    {
      id: 2,
      title: 'Security Awareness Training',
      description: 'Essential security practices and protocols for employees',
      duration: '60 min',
      category: 'Security',
      status: 'in-progress',
      progress: 65,
      type: 'Interactive',
      dueDate: '2024-02-05'
    },
    {
      id: 3,
      title: 'Software Tools Introduction',
      description: 'Getting started with company software and tools',
      duration: '90 min',
      category: 'Technical',
      status: 'not-started',
      progress: 0,
      type: 'Video',
      dueDate: '2024-02-10'
    },
    {
      id: 4,
      title: 'Team Collaboration Best Practices',
      description: 'Learn effective communication and collaboration techniques',
      duration: '40 min',
      category: 'Soft Skills',
      status: 'not-started',
      progress: 0,
      type: 'Article',
      dueDate: '2024-02-15'
    },
    {
      id: 5,
      title: 'Data Privacy & GDPR',
      description: 'Understanding data protection regulations and compliance',
      duration: '50 min',
      category: 'Compliance',
      status: 'completed',
      progress: 100,
      type: 'Video',
      dueDate: '2024-02-03'
    },
    {
      id: 6,
      title: 'Project Management Basics',
      description: 'Introduction to project management methodologies',
      duration: '75 min',
      category: 'Professional',
      status: 'in-progress',
      progress: 30,
      type: 'Interactive',
      dueDate: '2024-02-20'
    }
  ])

  const startTraining = (id) => {
    setTrainings(trainings.map(training => 
      training.id === id ? { ...training, status: 'in-progress', progress: 10 } : training
    ))
  }

  const completeTraining = (id) => {
    setTrainings(trainings.map(training => 
      training.id === id ? { ...training, status: 'completed', progress: 100 } : training
    ))
  }

  const filteredTrainings = trainings.filter(training => {
    if (activeTab === 'all') return true
    if (activeTab === 'completed') return training.status === 'completed'
    if (activeTab === 'in-progress') return training.status === 'in-progress'
    if (activeTab === 'not-started') return training.status === 'not-started'
    return true
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'not-started': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Video': return <FaVideo className="text-red-500" />
      case 'Interactive': return <FaPlay className="text-blue-500" />
      case 'Article': return <FaBook className="text-green-500" />
      default: return <FaGraduationCap className="text-purple-500" />
    }
  }

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Compliance': return 'bg-red-50 text-red-700 border-red-200'
      case 'Security': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Technical': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'Soft Skills': return 'bg-green-50 text-green-700 border-green-200'
      case 'Professional': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const stats = {
    total: trainings.length,
    completed: trainings.filter(t => t.status === 'completed').length,
    inProgress: trainings.filter(t => t.status === 'in-progress').length,
    notStarted: trainings.filter(t => t.status === 'not-started').length,
    averageProgress: Math.round(trainings.reduce((acc, t) => acc + t.progress, 0) / trainings.length)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(role === 'hr' ? '/hr-dashboard' : '/employee-dashboard')}
                className="px-4 py-2 text-gray-600 hover:text-blue-600"
              >
                ← Back to Dashboard
              </button>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">Training Portal</h1>
              <p className="text-sm text-gray-600">{role === 'hr' ? 'HR' : 'Employee'} Portal</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                <FaGraduationCap className="text-3xl text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Training & Development</h2>
                <p className="text-gray-600">
                  {role === 'hr' 
                    ? 'Manage employee training programs' 
                    : 'Complete required training modules'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.averageProgress}%</div>
                <div className="text-sm text-gray-600">Avg. Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Modules</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">{stats.total}</p>
              </div>
              <FaGraduationCap className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">{stats.completed}</p>
              </div>
              <FaCheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">In Progress</h3>
                <p className="text-2xl font-bold text-yellow-600 mt-2">{stats.inProgress}</p>
              </div>
              <FaClock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Not Started</h3>
                <p className="text-2xl font-bold text-gray-600 mt-2">{stats.notStarted}</p>
              </div>
              <FaBook className="h-8 w-8 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              All Modules ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'completed' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Completed ({stats.completed})
            </button>
            <button
              onClick={() => setActiveTab('in-progress')}
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'in-progress' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              In Progress ({stats.inProgress})
            </button>
            <button
              onClick={() => setActiveTab('not-started')}
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'not-started' ? 'bg-gray-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Not Started ({stats.notStarted})
            </button>
          </div>
        </div>

        {/* Training Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTrainings.map((training) => (
            <div key={training.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTypeIcon(training.type)}
                    <h3 className="text-xl font-bold text-gray-900">{training.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(training.status)}`}>
                      {training.status === 'in-progress' ? 'In Progress' : 
                       training.status === 'completed' ? 'Completed' : 'Not Started'}
                    </span>
                    <span className={`px-3 py-1 border rounded-full text-xs font-medium ${getCategoryColor(training.category)}`}>
                      {training.category}
                    </span>
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <FaClock /> {training.duration}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{training.description}</p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{training.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      training.status === 'completed' ? 'bg-green-500' :
                      training.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                    style={{ width: `${training.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    Due: {new Date(training.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {training.status === 'not-started' && (
                    <button
                      onClick={() => startTraining(training.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <FaPlay />
                      Start Training
                    </button>
                  )}
                  
                  {training.status === 'in-progress' && (
                    <>
                      <button
                        onClick={() => completeTraining(training.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <FaCheckCircle />
                        Mark Complete
                      </button>
                      <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                        Continue
                      </button>
                    </>
                  )}
                  
                  {training.status === 'completed' && (
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recommended Training */}
        {role === 'employee' && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <FaChartLine className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Recommended For You</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FaUsers className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Leadership Skills</h4>
                    <p className="text-sm text-gray-600">Intermediate • 3 modules</p>
                  </div>
                </div>
                <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                  Explore
                </button>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FaChartLine className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Data Analysis</h4>
                    <p className="text-sm text-gray-600">Advanced • 5 modules</p>
                  </div>
                </div>
                <button className="w-full py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50">
                  Explore
                </button>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FaGraduationCap className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Communication Skills</h4>
                    <p className="text-sm text-gray-600">Beginner • 4 modules</p>
                  </div>
                </div>
                <button className="w-full py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50">
                  Explore
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrainingPage