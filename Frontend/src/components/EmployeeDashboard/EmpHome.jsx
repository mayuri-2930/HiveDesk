import React from 'react';
import { FaTasks, FaGraduationCap, FaFileAlt, FaCheckCircle, FaClock, FaBell } from 'react-icons/fa';

const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
        <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{value}</p>
        {subtext && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="text-xl text-white" />
      </div>
    </div>
  </div>
);

const ProgressCard = ({ title, progress, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex justify-between items-center mb-3">
      <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
      <span className="text-sm font-bold">{progress}%</span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

const EmpHome = ({ user, tasks, trainings, documents, stats, overallProgress, taskProgress, trainingProgress, docsProgress, onToggleTask }) => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Employee'}! 👋</h1>
        <p className="opacity-90 mt-2">Track your onboarding progress and stay updated with tasks</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-sm">Employee ID</p>
            <p className="font-bold">{user?.employeeId || 'EMP-001'}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-sm">Department</p>
            <p className="font-bold">{user?.department || 'Department'}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-sm">Start Date</p>
            <p className="font-bold">{user?.startDate || 'Jan 2024'}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={FaTasks}
          label="Total Tasks"
          value={stats.tasks.total}
          subtext={`${stats.tasks.completed} completed`}
          color="bg-blue-500"
        />
        <StatCard
          icon={FaGraduationCap}
          label="Trainings"
          value={stats.trainings.total}
          subtext={`${stats.trainings.completed} completed`}
          color="bg-purple-500"
        />
        <StatCard
          icon={FaFileAlt}
          label="Documents"
          value={stats.documents.total}
          subtext={`${stats.documents.verified} verified`}
          color="bg-amber-500"
        />
        <StatCard
          icon={FaCheckCircle}
          label="Overall Progress"
          value={`${overallProgress}%`}
          subtext="Onboarding completion"
          color="bg-green-500"
        />
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ProgressCard
          title="Tasks Progress"
          progress={taskProgress}
          color="bg-blue-500"
        />
        <ProgressCard
          title="Training Progress"
          progress={trainingProgress}
          color="bg-purple-500"
        />
        <ProgressCard
          title="Documents Progress"
          progress={docsProgress}
          color="bg-amber-500"
        />
      </div>

      {/* Tasks & Trainings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pending Tasks</h3>
            <span className="text-sm text-gray-500">{stats.tasks.pending} remaining</span>
          </div>
          <div className="space-y-3">
            {tasks.slice(0, 4).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'}`}
                  >
                    {task.completed && <FaCheckCircle className="text-white text-xs" />}
                  </button>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FaClock className="text-gray-400 text-xs" />
                      <span className="text-xs text-gray-500">Due: {task.dueDate}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Trainings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Trainings</h3>
            <span className="text-sm text-gray-500">{stats.trainings.inProgress} pending</span>
          </div>
          <div className="space-y-3">
            {trainings.slice(0, 4).map(training => (
              <div key={training.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{training.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">{training.duration}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${training.category === 'mandatory' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {training.category}
                      </span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${training.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    <FaGraduationCap />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                    <div
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{ width: training.completed ? '100%' : '40%' }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpHome;