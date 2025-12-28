// components/HRDashboard/TaskManagement.jsx
import React, { useState } from 'react';
import { 
  FaUser, 
  FaTrash, 
  FaCheckCircle, 
  FaCalendar, 
  FaTimes,
  FaFilter,
  FaPlus,
  FaFileAlt,
  FaBook
} from 'react-icons/fa';

// Task Modal Component
const TaskModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <FaTimes className="h-5 w-5" />
        </button>
        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white pr-8">{title}</h3>
        {children}
      </div>
    </div>
  );
};

const TaskManagement = ({ 
  tasks, 
  taskFilter, 
  setTaskFilter,
  getPriorityColor, 
  getStatusColor, 
  toggleTaskStatus, 
  handleDeleteTask,
  setShowCreateTaskModal,
  selectedTask,
  setSelectedTask,
  setShowAssignTaskModal,
  assignForm,
  setAssignForm,
  showCreateTaskModal,
  showAssignTaskModal,
  handleCreateTask,
  handleAssignTask,
  employees // Add employees prop for dropdown
}) => {
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    task_type: 'read',
    content: '',
    required_document_type: 'aadhar',
    is_active: true,
    due_date: '',
    category: '',
    assigned_to: ''
  });

  const handleTaskFormSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare payload according to API structure
    const payload = {
      title: taskForm.title,
      description: taskForm.description,
      task_type: taskForm.task_type,
      content: taskForm.content,
      required_document_type: taskForm.required_document_type,
      is_active: taskForm.is_active,
      due_date: taskForm.due_date || null,
      category: taskForm.category || null,
      assigned_to: taskForm.assigned_to || null
    };

    const success = await handleCreateTask(payload);
    if (success) {
      setShowCreateTaskModal(false);
      // Reset form
      setTaskForm({
        title: '',
        description: '',
        task_type: 'read',
        content: '',
        required_document_type: 'aadhar',
        is_active: true,
        due_date: '',
        category: '',
        assigned_to: ''
      });
    }
  };

  const handleAssignFormSubmit = async (e) => {
    e.preventDefault();
    if (selectedTask && handleAssignTask(selectedTask.id, assignForm)) {
      setShowAssignTaskModal(false);
      setAssignForm({
        employeeId: '',
        dueDate: ''
      });
    }
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Tasks</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{tasks.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FaCheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Completed</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                {tasks.filter(t => t.status === 'Completed').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FaCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Tasks</h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
                {tasks.filter(t => t.is_active).length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <FaBook className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Read Tasks</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                {tasks.filter(t => t.task_type === 'read').length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FaFileAlt className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <select
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 appearance-none pr-10 text-gray-700 dark:text-gray-300 w-full"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active Tasks</option>
            <option value="inactive">Inactive Tasks</option>
            <option value="read">Read Tasks</option>
            <option value="write">Write Tasks</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <button 
          onClick={() => setShowCreateTaskModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 w-full sm:w-auto justify-center"
        >
          <FaPlus />
          Create Task
        </button>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{task.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <FaCalendar className="flex-shrink-0" />
                    <span className="line-clamp-1">{task.due_date || 'No due date'}</span>
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.task_type === 'read' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    task.task_type === 'write' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                  } flex-shrink-0`}>
                    {task.task_type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  } flex-shrink-0`}>
                    {task.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)} whitespace-nowrap`}>
                  {task.status || 'Pending'}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    title="Delete Task"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setAssignForm({employeeId: '', dueDate: task.due_date});
                      setShowAssignTaskModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                    title="Assign Task"
                  >
                    <FaUser />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{task.description}</p>
            
            {task.content && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Content:</p>
                <p className="text-gray-700 dark:text-gray-300 line-clamp-2">{task.content}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {task.required_document_type && (
                  <div className="flex items-center gap-2 mb-2">
                    <FaFileAlt className="text-gray-400 flex-shrink-0" />
                    <span>Document: <strong className="text-gray-900 dark:text-white">{task.required_document_type}</strong></span>
                  </div>
                )}
                {task.assigned_to && (
                  <div className="flex items-center gap-2 mb-2">
                    <FaUser className="text-gray-400 flex-shrink-0" />
                    <span className="line-clamp-1">Assigned to: <strong className="text-gray-900 dark:text-white">{task.assigned_to}</strong></span>
                  </div>
                )}
                {task.category && (
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded text-xs whitespace-nowrap">
                      {task.category}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                {task.status !== 'Completed' && (
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full sm:w-auto justify-center"
                  >
                    <FaCheckCircle />
                    Mark Complete
                  </button>
                )}
                
                <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 w-full sm:w-auto text-center">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <FaCheckCircle className="h-12 w-12 mx-auto opacity-50" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No tasks found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {taskFilter !== 'all' 
              ? `No ${taskFilter} tasks found. Try changing the filter.`
              : 'Create your first task to get started.'}
          </p>
          <button
            onClick={() => setShowCreateTaskModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create New Task
          </button>
        </div>
      )}

      {/* Create Task Modal */}
      <TaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        title="Create New Task"
      >
        <form onSubmit={handleTaskFormSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Title *</label>
              <input
                type="text"
                value={taskForm.title}
                onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter task title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description *</label>
              <textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                rows="2"
                placeholder="Enter task description"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Task Type *</label>
                <select
                  value={taskForm.task_type}
                  onChange={(e) => setTaskForm({...taskForm, task_type: e.target.value})}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                >
                  <option value="read">Read</option>
                  <option value="write">Write</option>
                  <option value="review">Review</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Document Type *</label>
                <select
                  value={taskForm.required_document_type}
                  onChange={(e) => setTaskForm({...taskForm, required_document_type: e.target.value})}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                >
                  <option value="aadhar">Aadhar Card</option>
                  <option value="pan">PAN Card</option>
                  <option value="passport">Passport</option>
                  <option value="driving_license">Driving License</option>
                  <option value="voter_id">Voter ID</option>
                  <option value="bank_statement">Bank Statement</option>
                  <option value="salary_slip">Salary Slip</option>
                  <option value="offer_letter">Offer Letter</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Content</label>
              <textarea
                value={taskForm.content}
                onChange={(e) => setTaskForm({...taskForm, content: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                rows="2"
                placeholder="Additional content or instructions"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Due Date</label>
                <input
                  type="date"
                  value={taskForm.due_date}
                  onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category</label>
                <input
                  type="text"
                  value={taskForm.category}
                  onChange={(e) => setTaskForm({...taskForm, category: e.target.value})}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="e.g., Documentation, Training"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Assign To</label>
              <select
                value={taskForm.assigned_to}
                onChange={(e) => setTaskForm({...taskForm, assigned_to: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              >
                <option value="">Select employee</option>
                {employees && employees.map((employee) => (
                  <option key={employee.id} value={employee.email || employee.name}>
                    {employee.name} - {employee.email}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="is_active"
                checked={taskForm.is_active}
                onChange={(e) => setTaskForm({...taskForm, is_active: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700 dark:text-gray-300">
                Task is active
              </label>
            </div>
            
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => setShowCreateTaskModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Task
              </button>
            </div>
          </div>
        </form>
      </TaskModal>

      {/* Assign Task Modal */}
      <TaskModal
        isOpen={showAssignTaskModal}
        onClose={() => setShowAssignTaskModal(false)}
        title={`Assign Task: ${selectedTask?.title || ''}`}
      >
        <form onSubmit={handleAssignFormSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Assign To *</label>
              <select
                value={assignForm.employeeId}
                onChange={(e) => setAssignForm({...assignForm, employeeId: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              >
                <option value="">Select employee</option>
                {employees && employees.map((employee) => (
                  <option key={employee.id} value={employee.email || employee.id}>
                    {employee.name} - {employee.email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Due Date *</label>
              <input
                type="date"
                value={assignForm.dueDate}
                onChange={(e) => setAssignForm({...assignForm, dueDate: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              />
            </div>
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => setShowAssignTaskModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Assign Task
              </button>
            </div>
          </div>
        </form>
      </TaskModal>
    </div>
  );
};

export default TaskManagement;