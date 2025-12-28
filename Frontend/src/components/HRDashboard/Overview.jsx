// components/HRDashboard/Overview.jsx
import React from 'react';
import {
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaChartLine,
  FaExclamationTriangle,
  FaLightbulb,
  FaCalendar,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

// StatCard Component for Overview
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

const Overview = ({ 
  employees,
  tasks,
  documents,
  dashboardData,
  getStatusColor,
  getInsightColor,
  getInsightIcon
}) => {
  const stats = dashboardData?.stats || {
    total_onboarded: 0,
    in_progress: 0,
    pending_verification: 0,
    completion_rate: 0
  };

  const recentCandidates = dashboardData?.recent_candidates || [];
  const aiInsights = dashboardData?.ai_insights || [];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Onboarded"
          value={stats.total_onboarded}
          icon={FaUsers}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
          change="+12%"
        />
        <StatCard 
          title="In Progress"
          value={stats.in_progress}
          icon={FaClock}
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
          change="+5%"
        />
        <StatCard 
          title="Pending Verification"
          value={stats.pending_verification}
          icon={FaCheckCircle}
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
          change="-3%"
        />
        <StatCard 
          title="Completion Rate"
          value={`${stats.completion_rate}%`}
          icon={FaChartLine}
          color="bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
          change="+8%"
        />
      </div>

      {/* Recent Activity & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Candidates */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Candidates</h3>
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">View All</span>
          </div>
          
          <div className="space-y-4">
            {recentCandidates.length > 0 ? (
              recentCandidates.slice(0, 5).map((candidate, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {candidate.name?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{candidate.name || 'Candidate Name'}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.position || 'Position'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                    {candidate.status || 'Applied'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FaUsers className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No recent candidates</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Insights</h3>
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Powered by AI</span>
          </div>
          
          <div className="space-y-4">
            {aiInsights.length > 0 ? (
              aiInsights.slice(0, 3).map((insight, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{insight.title || 'Insight Title'}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{insight.description || 'Insight description goes here...'}</p>
                      {insight.action && (
                        <button className="mt-3 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                          {insight.action}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Default insights if none from API
              <>
                <div className="p-4 rounded-lg border bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <FaCheckCircle className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Onboarding Progress Good</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">72% of new hires are completing onboarding within 2 weeks.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <FaLightbulb className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Training Suggestions</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Consider adding cybersecurity training for all new hires.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <FaExclamationTriangle className="text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Document Delays</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">3 employees have pending document verifications over 7 days.</p>
                      <button className="mt-3 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                        Review Now
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Employees */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Total Employees</h4>
            <FaUsers className="text-blue-500 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{employees.length}</p>
          <div className="flex items-center gap-2 mt-2">
            <FaArrowUp className="text-emerald-500" />
            <span className="text-sm text-emerald-600 dark:text-emerald-400">+5 this month</span>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Active Tasks</h4>
            <FaCheckCircle className="text-green-500 dark:text-green-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {tasks.filter(t => t.is_active && t.status !== 'Completed').length}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <FaArrowDown className="text-red-500" />
            <span className="text-sm text-red-600 dark:text-red-400">-2 completed</span>
          </div>
        </div>

        {/* Pending Documents */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Pending Documents</h4>
            <FaClock className="text-yellow-500 dark:text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {documents.filter(d => d.status !== 'Verified').length}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <FaArrowUp className="text-red-500" />
            <span className="text-sm text-red-600 dark:text-red-400">+3 pending</span>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Tasks</h3>
          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">View All Tasks</span>
        </div>
        
        <div className="space-y-4">
          {tasks.slice(0, 5).map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <FaCheckCircle className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <FaCalendar />
                      {task.due_date || 'No due date'}
                    </span>
                    <span className="capitalize">{task.task_type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status || 'Pending'}
                </span>
                {task.assigned_to && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {task.assigned_to}
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center py-8">
              <FaCheckCircle className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No tasks available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;