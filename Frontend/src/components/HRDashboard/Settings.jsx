import React from 'react';
import { FaUserCog, FaBell, FaShieldAlt, FaDatabase } from 'react-icons/fa';

const Settings = () => {
  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/10 dark:to-gray-800/10">
          <h3 className="text-gray-900 dark:text-white text-lg font-bold">Settings</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Manage your HR portal settings and preferences
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Settings */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FaUserCog className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">Profile Settings</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal information</p>
                </div>
              </div>
              <button className="w-full mt-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm">
                Edit Profile
              </button>
            </div>

            {/* Notifications */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FaBell className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">Notifications</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage email and push notifications</p>
                </div>
              </div>
              <button className="w-full mt-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm">
                Configure Notifications
              </button>
            </div>

            {/* Security */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <FaShieldAlt className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">Security</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Change password and security settings</p>
                </div>
              </div>
              <button className="w-full mt-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm">
                Security Settings
              </button>
            </div>

            {/* Data Management */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <FaDatabase className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">Data Management</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Export data and manage backups</p>
                </div>
              </div>
              <button className="w-full mt-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm">
                Data Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;