import React from 'react';
import { FaPlus } from 'react-icons/fa';

const Candidates = ({ 
  employees = [], 
  handleEditEmployee, 
  handleViewEmployee, 
  handleOpenDeleteModal,
  getStatusColor 
}) => {
  
  // Employee Table Row Component
  const EmployeeTableRow = ({ employee }) => (
    <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <span className="text-blue-600 font-bold">
              {employee.name.charAt(0)}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {employee.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {employee.email}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-white">{employee.department}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-white">{employee.position}</div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          employee.is_active 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }`}>
          {employee.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" 
              style={{ width: `${employee.progress}%` }}
            ></div>
          </div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {employee.progress}%
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm">
          <span className="text-gray-700 dark:text-gray-300">{employee.completed_tasks || 0}</span>
          <span className="text-gray-400 dark:text-gray-500">/</span>
          <span className="text-gray-900 dark:text-white font-medium">{employee.total_tasks || 0}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">tasks</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <button 
            onClick={() => handleEditEmployee(employee)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button 
            onClick={() => handleViewEmployee(employee.id)}
            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="View"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button 
            onClick={() => handleOpenDeleteModal(employee)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      {/* Candidates Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-800/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-gray-900 dark:text-white text-lg font-bold">Candidates Management</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {employees.length} candidates • {employees.filter(e => e.is_active).length} active
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors text-sm font-medium">
              <FaPlus />
              Add Candidate
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {employees.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tasks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {employees.map((employee) => (
                  <EmployeeTableRow key={employee.id} employee={employee} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <i className="fas fa-user-plus text-2xl text-blue-600 dark:text-blue-400"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Candidates Found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                There are no candidates in the system yet. Add your first candidate to get started.
              </p>
              <button className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors text-sm font-medium">
                <FaPlus />
                Add First Candidate
              </button>
            </div>
          )}
        </div>
        
        {employees.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {employees.length} of {employees.length} candidates
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  ← Previous
                </button>
                <span className="px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                  1
                </span>
                <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;