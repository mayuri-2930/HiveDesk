// src/components/employee/Sidebar.js
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaHome,
  FaTasks,
  FaChartBar,
  FaFileAlt,
  FaSignOutAlt,
  FaBuilding,
  FaUser,
  FaCalendarAlt
} from 'react-icons/fa'

const Sidebar = ({ user, onLogout, currentPath }) => {
  const navigate = useNavigate()

  const navItems = [
    {
      name: 'Overview',
      path: '/employee-dashboard/overview',
      icon: <FaHome className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Task Management',
      path: '/employee-dashboard/tasks',
      icon: <FaTasks className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Progress',
      path: '/employee-dashboard/progress',
      icon: <FaChartBar className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Document Upload',
      path: '/employee-dashboard/documents',
      icon: <FaFileAlt className="w-5 h-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-lg flex flex-col">
      {/* Logo and Project Name */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
            <FaBuilding className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">WorkFlow Pro</h1>
            <p className="text-xs text-gray-500">Employee Portal</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{user?.name || 'User'}</h3>
            <p className="text-sm text-gray-500 truncate">{user?.position || 'Employee'}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <FaUser className="w-4 h-4 mr-2 text-gray-400" />
            <span>ID: {user?.employeeId || 'N/A'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-400" />
            <span>Started: {user?.startDate || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${currentPath === item.path 
                  ? `${item.bgColor} ${item.color} font-semibold shadow-sm` 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <div className={`p-2 rounded-lg ${currentPath === item.path ? item.bgColor : 'bg-gray-100'}`}>
                {item.icon}
              </div>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
        >
          <div className="p-2 rounded-lg bg-red-50 group-hover:bg-red-100">
            <FaSignOutAlt className="w-5 h-5" />
          </div>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar