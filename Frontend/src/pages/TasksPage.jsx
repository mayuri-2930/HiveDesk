import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { taskAPI } from '../api/taskAPI' // Import your API
import { FaTasks, FaCheckCircle, FaClock, FaPlus, FaFilter, FaCalendar, FaUser, FaTrash, FaEdit } from 'react-icons/fa'

const TasksPage = ({ role }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  
  // Form states
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    category: '',
    assignedTo: ''
  })
  
  const [assignForm, setAssignForm] = useState({
    employeeId: '',
    dueDate: ''
  })
  
  const [tasks, setTasks] = useState([])

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    const result = await taskAPI.getTasks()
    if (result.success) {
      setTasks(result.data)
    } else {
      console.error('Failed to fetch tasks:', result.error)
    }
    setLoading(false)
  }

  const toggleTaskStatus = async (taskId) => {
    if (role === 'employee') {
      const result = await taskAPI.completeTask(taskId)
      if (result.success) {
        fetchTasks() // Refresh tasks
      }
    } else {
      // For HR, update task status
      const task = tasks.find(t => t.id === taskId)
      if (task) {
        const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed'
        const result = await taskAPI.updateTask(taskId, { ...task, status: newStatus })
        if (result.success) {
          fetchTasks() // Refresh tasks
        }
      }
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    const result = await taskAPI.createTask(taskForm)
    if (result.success) {
      setShowCreateModal(false)
      setTaskForm({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        category: '',
        assignedTo: ''
      })
      fetchTasks() // Refresh tasks
    }
  }

  const handleAssignTask = async (taskId) => {
    const result = await taskAPI.assignTask(taskId, assignForm)
    if (result.success) {
      setShowAssignModal(false)
      setAssignForm({
        employeeId: '',
        dueDate: ''
      })
      fetchTasks() // Refresh tasks
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await taskAPI.deleteTask(taskId)
      if (result.success) {
        fetchTasks() // Refresh tasks
      }
    }
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

  // Create Task Modal
  const CreateTaskModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full">
        <h3 className="text-2xl font-bold mb-6">Create New Task</h3>
        <form onSubmit={handleCreateTask}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={taskForm.title}
                onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Due Date</label>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Create Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )

  // Assign Task Modal
  const AssignTaskModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full">
        <h3 className="text-2xl font-bold mb-6">Assign Task</h3>
        <form onSubmit={(e) => { e.preventDefault(); handleAssignTask(selectedTask.id); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Employee ID/Email</label>
              <input
                type="text"
                value={assignForm.employeeId}
                onChange={(e) => setAssignForm({...assignForm, employeeId: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Due Date</label>
              <input
                type="date"
                value={assignForm.dueDate}
                onChange={(e) => setAssignForm({...assignForm, dueDate: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Assign Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading tasks...</div>
      </div>
    )
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
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
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
                
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  {role === 'hr' && (
                    <>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setAssignForm({...assignForm, dueDate: task.dueDate});
                          setShowAssignModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <FaUser />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-6">{task.description}</p>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {role === 'hr' && task.assignedTo && (
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
                      {role === 'hr' ? 'Mark Complete' : 'Complete Task'}
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

      {/* Modals */}
      {showCreateModal && <CreateTaskModal />}
      {showAssignModal && <AssignTaskModal />}
    </div>
  )
}

export default TasksPage