// src/components/EmployeeDashboard/EmpProgress.jsx
import React from 'react'
import { 
  FaChartLine, 
  FaCalendar, 
  FaArrowUp, 
  FaBullseye,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaUser,
  FaGraduationCap,
  FaFileAlt,
  FaChartBar,
  FaArrowCircleUp
} from 'react-icons/fa'

const EmpProgress = ({
  taskProgress,
  trainingProgress,
  docsProgress,
  overallProgress,
  tasks,
  trainings,
  documents,
  activities
}) => {
  // Calculate stats
  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = tasks.filter(t => !t.completed).length
  const overdueTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length
  
  const completedTrainings = trainings.filter(t => t.completed).length
  const inProgressTrainings = trainings.filter(t => t.progress > 0 && t.progress < 100).length
  
  const verifiedDocs = documents.filter(d => d.status === 'verified').length
  const pendingDocs = documents.filter(d => d.status === 'pending').length
  const requiredDocs = documents.filter(d => d.status === 'required').length

  const progressData = [
    { label: 'Tasks', value: taskProgress, color: 'blue', icon: FaCheckCircle },
    { label: 'Training', value: trainingProgress, color: 'purple', icon: FaArrowUp }, // Changed to FaArrowUp
    { label: 'Documents', value: docsProgress, color: 'green', icon: FaBullseye },
  ]

  const getColorClasses = (color) => {
    switch (color) {
      case 'blue': return { bg: 'bg-blue-100', text: 'text-blue-600', progress: 'bg-blue-500' }
      case 'purple': return { bg: 'bg-purple-100', text: 'text-purple-600', progress: 'bg-purple-500' }
      case 'green': return { bg: 'bg-green-100', text: 'text-green-600', progress: 'bg-green-500' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', progress: 'bg-gray-500' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Progress Dashboard</h1>
          <p className="text-gray-600">Track your onboarding journey and milestones</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Overall Score</p>
            <p className="text-2xl font-bold text-gray-900">{overallProgress}%</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <FaChartLine className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Main Progress Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Your Onboarding Journey</h2>
            <p className="text-blue-100 mb-6">
              Complete all sections to finish your onboarding process and unlock full access.
            </p>
            <div className="space-y-4">
              {progressData.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="w-full bg-blue-500/30 rounded-full h-2.5">
                    <div
                      className="bg-white h-2.5 rounded-full"
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 text-center min-w-[200px]">
            <div className="text-5xl font-bold mb-2">{overallProgress}</div>
            <div className="text-blue-100 mb-4">Overall Progress</div>
            <div className="w-32 h-32 mx-auto relative">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${overallProgress * 2.83} 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {progressData.map((item) => {
          const colors = getColorClasses(item.color)
          const Icon = item.icon
          
          return (
            <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 ${colors.bg} rounded-xl`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{item.value}%</div>
                  <div className="text-sm text-gray-500">Completion</div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{item.label} Progress</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Current Progress</span>
                    <span className="font-semibold">{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${colors.progress}`}
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">
                      {item.label === 'Tasks' && completedTasks}
                      {item.label === 'Training' && completedTrainings}
                      {item.label === 'Documents' && verifiedDocs}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.label === 'Tasks' && 'Completed'}
                      {item.label === 'Training' && 'Finished'}
                      {item.label === 'Documents' && 'Verified'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">
                      {item.label === 'Tasks' && pendingTasks}
                      {item.label === 'Training' && inProgressTrainings}
                      {item.label === 'Documents' && pendingDocs}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.label === 'Tasks' && 'Pending'}
                      {item.label === 'Training' && 'In Progress'}
                      {item.label === 'Documents' && 'Pending'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Statistics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Task Statistics</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Completion Rate</span>
                <span className="font-semibold">{taskProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: `${taskProgress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{completedTasks}</div>
                <div className="text-sm text-blue-600">Completed</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-700">{pendingTasks}</div>
                <div className="text-sm text-yellow-600">Pending</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-700">{overdueTasks}</div>
                <div className="text-sm text-red-600">Overdue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Onboarding Timeline</h3>
          <div className="space-y-6">
            {[
              { stage: 'Document Submission', progress: docsProgress, date: 'Week 1-2' },
              { stage: 'Initial Training', progress: Math.min(trainingProgress, 50), date: 'Week 2-3' },
              { stage: 'Task Completion', progress: taskProgress, date: 'Week 3-4' },
              { stage: 'Final Review', progress: Math.min(overallProgress, 100), date: 'Week 4' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${item.progress === 100 ? 'bg-green-100 text-green-600' :
                      item.progress >= 50 ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-900">{item.stage}</span>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.progress === 100 ? 'bg-green-500' :
                        item.progress >= 50 ? 'bg-blue-500' :
                        'bg-gray-400'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{item.progress}% complete</span>
                    <span>
                      {item.progress === 100 ? 'Completed' :
                       item.progress >= 50 ? 'In Progress' :
                       'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Progress Activity</h3>
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                  {activity.icon === 'check' && <FaCheckCircle className="w-5 h-5 text-green-600" />}
                  {activity.icon === 'book' && <FaClock className="w-5 h-5 text-blue-600" />}
                  {activity.icon === 'upload' && <FaArrowUp className="w-5 h-5 text-purple-600" />}
                  {activity.icon === 'assignment' && <FaExclamationTriangle className="w-5 h-5 text-orange-600" />}
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.details}</p>
              </div>
              <div className="text-sm text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmpProgress