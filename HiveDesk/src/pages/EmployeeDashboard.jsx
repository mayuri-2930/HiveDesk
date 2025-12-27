import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaTasks, FaGraduationCap, FaFileAlt, FaUser, FaCalendarAlt, FaCheckCircle, FaClock, FaBuilding } from 'react-icons/fa'

const EmployeeDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete tax forms', completed: true, dueDate: '2024-02-01' },
    { id: 2, title: 'Setup work email', completed: true, dueDate: '2024-02-01' },
    { id: 3, title: 'Complete security training', completed: false, dueDate: '2024-02-05' },
    { id: 4, title: 'Meet with manager', completed: false, dueDate: '2024-02-06' },
    { id: 5, title: 'IT equipment setup', completed: false, dueDate: '2024-02-03' },
  ])

  const [trainings, setTrainings] = useState([
    { id: 1, title: 'Company Policies', duration: '30 min', completed: true },
    { id: 2, title: 'Security Awareness', duration: '45 min', completed: true },
    { id: 3, title: 'Software Tools', duration: '60 min', completed: false },
    { id: 4, title: 'Team Collaboration', duration: '40 min', completed: false },
  ])

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const toggleTraining = (id) => {
    setTrainings(trainings.map(training =>
      training.id === id ? { ...training, completed: !training.completed } : training
    ))
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const progress = Math.round((completedTasks / totalTasks) * 100)

  const completedTrainings = trainings.filter(training => training.completed).length
  const totalTrainings = trainings.length
  const trainingProgress = Math.round((completedTrainings / totalTrainings) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <FaBuilding className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Employee Portal</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Welcome, <span className="font-semibold">{user?.name}</span>
              </div>
              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">{user?.name?.charAt(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-white p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
              <p className="text-blue-100">Your onboarding journey is {progress}% complete. Keep going!</p>
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  <span>Software Engineer</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>Start Date: Jan 15, 2024</span>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{progress}%</div>
                  <div className="text-sm">Overall Progress</div>
                  <div className="mt-2 w-48 bg-white/30 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FaTasks className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Onboarding Tasks</h2>
                </div>
                <div className="text-sm text-gray-600">
                  {completedTasks} of {totalTasks} completed
                </div>
              </div>

              <div className="space-y-4">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`p-4 rounded-lg border ${task.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                            task.completed 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-gray-300'
                          }`}
                        >
                          {task.completed && <FaCheckCircle className="text-white text-xs" />}
                        </button>
                        <div>
                          <div className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.title}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <FaClock className="mr-1" />
                            <span>Due: {task.dueDate}</span>
                          </div>
                        </div>
                      </div>
                      {!task.completed && (
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
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
            <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FaGraduationCap className="h-6 w-6 text-purple-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Required Training</h2>
                </div>
                <div className="text-sm text-gray-600">
                  {completedTrainings} of {totalTrainings} completed
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainings.map((training) => (
                  <div 
                    key={training.id} 
                    className={`p-4 rounded-lg border ${training.completed ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className={`font-medium ${training.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {training.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Duration: {training.duration}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleTraining(training.id)}
                        className={`px-3 py-1 text-sm rounded-lg ${
                          training.completed
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
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
          <div className="space-y-8">
            {/* Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Tasks</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Training</span>
                    <span className="font-medium">{trainingProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${trainingProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Documentation</span>
                    <span className="font-medium">40%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: '40%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FaFileAlt className="h-5 w-5 text-gray-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">Employment Contract</div>
                    <div className="text-xs text-gray-500">Submitted</div>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Verified</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">Tax Forms</div>
                    <div className="text-xs text-gray-500">Pending</div>
                  </div>
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Review</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">ID Proof</div>
                    <div className="text-xs text-gray-500">Not Submitted</div>
                  </div>
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Required</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/employee/documents')}
                className="w-full mt-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Upload Documents
              </button>
            </div>

            {/* Upcoming */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FaCalendarAlt className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Team Meeting</div>
                    <div className="text-xs text-gray-500">Tomorrow, 10:00 AM</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <FaGraduationCap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Training Session</div>
                    <div className="text-xs text-gray-500">Feb 5, 2:00 PM</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <FaUser className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">1:1 with Manager</div>
                    <div className="text-xs text-gray-500">Feb 6, 11:00 AM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard