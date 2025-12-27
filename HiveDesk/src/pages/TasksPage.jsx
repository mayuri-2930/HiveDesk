import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaTasks, FaCheckCircle, FaClock, FaPlus, FaFilter, FaCalendar, FaUser } from 'react-icons/fa'

const TasksPage = ({ role }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  
  // Mock tasks data
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Complete tax forms',
      description: 'Fill out all required tax documentation',
      priority: 'High',
      status: 'Completed',
      dueDate: '2024-02-01',
      assignedTo: 'John Doe',
      category: 'Documentation'
    },
    {
      id: 2,
      title: 'Setup work email',
      description: 'Configure your company email account',
      priority: 'Medium',
      status: 'Completed',
      dueDate: '2024-02-01',
      assignedTo: 'John Doe',
      category: 'IT'
    },
    {
      id: 3,
      title: 'Complete security training',
      description: 'Mandatory security awareness training',
      priority: 'High',
      status: 'In Progress',
      dueDate: '2024-02-05',
      assignedTo: 'John Doe',
      category: 'Training'
    },
    {
      id: 4,
      title: 'Meet with manager',
      description: 'Initial onboarding meeting with your manager',
      priority: 'Medium',
      status: 'Pending',
      dueDate: '2024-02-06',
      assignedTo: 'John Doe',
      category: 'Meetings'
    },
    {
      id: 5,
      title: 'IT equipment setup',
      description: 'Setup laptop, software, and access',
      priority: 'Medium',
      status: 'Pending',
      dueDate: '2024-02-03',
      assignedTo: 'John Doe',
      category: 'IT'
    }
  ])

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed'
        return { ...task, status: newStatus }
      }
      return task
    }))
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'completed') return task.status === 'Completed'
    if (filter === 'pending') return task.status !== 'Completed'
    if (filter === 'high') return task.priority === 'High'
    return true
  })

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Tasks Management</h1>
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
                <FaTasks className="text-3xl text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Tasks</h2>
                <p className="text-gray-600">
                  {role === 'hr' 
                    ? 'Manage and track team tasks' 
                    : 'View and complete your tasks'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white appearance-none pr-10"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="high">High Priority</option>
                </select>
                <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              {role === 'hr' && (
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                  <FaPlus />
                  Create Task
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <FaCalendar />
                      {task.dueDate}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>

              <p className="text-gray-700 mb-6">{task.description}</p>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {role === 'hr' && (
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-400" />
                      <span>Assigned to: <strong>{task.assignedTo}</strong></span>
                    </div>
                  )}
                  <div className="mt-1">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                      {task.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {task.status !== 'Completed' && (
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <FaCheckCircle />
                      Mark Complete
                    </button>
                  )}
                  
                  <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Tasks</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">{tasks.length}</p>
              </div>
              <FaTasks className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {tasks.filter(t => t.status === 'Completed').length}
                </p>
              </div>
              <FaCheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
                <p className="text-2xl font-bold text-yellow-600 mt-2">
                  {tasks.filter(t => t.status !== 'Completed').length}
                </p>
              </div>
              <FaClock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TasksPage