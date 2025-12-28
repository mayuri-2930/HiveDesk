// src/components/employee/EmpSidebar.js
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaHome,
  FaTasks,
  FaChartLine,
  FaFileUpload,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaBell,
  FaEnvelope,
  FaCalendarAlt,
  FaBuilding
} from 'react-icons/fa'

const EmpSidebar = ({ 
  user, 
  currentPath, 
  notifications,
  onLogout,
  onNotificationRead,
  onClearNotifications 
}) => {
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/employee-dashboard/home',
      icon: <FaHome className="w-5 h-5" />,
      badge: notifications.filter(n => !n.read).length
    },
    {
      title: 'My Tasks',
      path: '/employee-dashboard/tasks',
      icon: <FaTasks className="w-5 h-5" />,
      badge: 'new'
    },
    {
      title: 'Progress',
      path: '/employee-dashboard/progress',
      icon: <FaChartLine className="w-5 h-5" />,
      badge: null
    },
    {
      title: 'Documents',
      path: '/employee-dashboard/documents',
      icon: <FaFileUpload className="w-5 h-5" />,
      badge: '3'
    },
    {
      title: 'Settings',
      path: '/employee-dashboard/settings',
      icon: <FaCog className="w-5 h-5" />,
      badge: null
    }
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-lg flex flex-col z-50">
      {/* Logo Header */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/employee-dashboard/home" className="flex items-center gap-3 group">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
            <FaBuilding className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">WorkFlow Pro</h1>
            <p className="text-xs text-gray-500 font-medium">Employee Portal</p>
          </div>
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase() || 'E'}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{user?.name || 'Employee'}</h3>
            <p className="text-sm text-gray-500 truncate">{user?.position || 'Team Member'}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center text-gray-600">
            <FaCalendarAlt className="w-3 h-3 mr-2" />
            <span>Day {user?.day || '15'}</span>
          </div>
          <div className="text-right">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                ${currentPath === item.path
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  p-2 rounded-lg transition-colors
                  ${currentPath === item.path ? 'bg-blue-100' : 'bg-gray-100'}
                `}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.title}</span>
              </div>
              {item.badge && (
                <span className={`
                  text-xs font-medium px-2 py-1 rounded-full
                  ${currentPath === item.path
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700'
                  }
                `}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-3">Quick Stats</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-blue-700 mb-1">
                <span>Tasks Done</span>
                <span>68%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-blue-700 mb-1">
                <span>Training</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications & Logout */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <FaBell className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="font-medium">Notifications</span>
            </div>
            <svg 
              className={`w-4 h-4 transition-transform ${showNotifications ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-900">Notifications</h4>
                  <button
                    onClick={onClearNotifications}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors
                        ${!notification.read ? 'bg-blue-50' : ''}
                      `}
                      onClick={() => onNotificationRead(notification.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <FaBell className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
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

export default EmpSidebar