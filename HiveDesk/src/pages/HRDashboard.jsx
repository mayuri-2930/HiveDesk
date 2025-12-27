// src/pages/HRDashboard.js
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaPlus, FaSearch, FaFilter, FaUserPlus, FaFileUpload, FaChartBar, FaBell, FaEdit, FaTrash, FaBuilding, FaUsers, FaTasks, FaGraduationCap, FaSignOutAlt } from 'react-icons/fa'

const HRDashboard = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [user, setUser] = useState(null)
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    startDate: ''
  })

  // Mock data for demo
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@company.com',
      department: 'Engineering',
      position: 'Software Engineer',
      startDate: '2024-01-15',
      status: 'Active',
      progress: 85
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@company.com',
      department: 'Product',
      position: 'Product Manager',
      startDate: '2024-02-01',
      status: 'Onboarding',
      progress: 45
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert@company.com',
      department: 'Design',
      position: 'UX Designer',
      startDate: '2024-01-20',
      status: 'Active',
      progress: 90
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah@company.com',
      department: 'Analytics',
      position: 'Data Analyst',
      startDate: '2024-02-10',
      status: 'Pending',
      progress: 20
    },
    {
      id: 5,
      name: 'Michael Brown',
      email: 'michael@company.com',
      department: 'Sales',
      position: 'Sales Manager',
      startDate: '2024-02-05',
      status: 'Onboarding',
      progress: 30
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily@company.com',
      department: 'Marketing',
      position: 'Marketing Specialist',
      startDate: '2024-01-25',
      status: 'Active',
      progress: 95
    }
  ])

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (!userData) {
      toast.error('Please login first')
      navigate('/login')
      return
    }
    
    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      // Check if user is HR
      if (parsedUser.role !== 'hr') {
        toast.error('Access denied. HR only.')
        navigate('/employee-dashboard')
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
      toast.error('Session expired. Please login again.')
      navigate('/login')
    }
  }, [navigate])

  const stats = {
    total: employees.length,
    onboarding: employees.filter(e => e.status === 'Onboarding').length,
    active: employees.filter(e => e.status === 'Active').length,
    pending: employees.filter(e => e.status === 'Pending').length
  }

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email) {
      toast.error('Please fill required fields')
      return
    }

    const employee = {
      id: employees.length + 1,
      ...newEmployee,
      status: 'Pending',
      progress: 10
    }

    setEmployees([employee, ...employees])
    setNewEmployee({ name: '', email: '', department: '', position: '', startDate: '' })
    setShowAddModal(false)
    toast.success('Employee added successfully!')
  }

  const handleViewEmployee = (id) => {
    navigate(`/employee/${id}`)
  }

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id))
    toast.success('Employee deleted successfully!')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    toast.success('Logged out successfully!')
    navigate('/login')
  }

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800 border border-green-200'
      case 'Onboarding': return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Active': return '✅'
      case 'Onboarding': return '🔄'
      case 'Pending': return '⏳'
      default: return '📝'
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className="h-6 w-6" style={{ color: color.replace('bg-', 'text-') }} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <FaBuilding className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">HR Portal</span>
                  <p className="text-xs text-gray-500">Employee Management System</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <FaBell className="h-5 w-5 text-gray-600" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.name?.charAt(0) || 'H'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'HR Manager'}</p>
                  <p className="text-xs text-gray-500">HR Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaSignOutAlt />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, <span className="font-semibold text-blue-600">{user?.name || 'HR Manager'}</span>! 
            Manage employee onboarding and HR operations
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">Last updated: Today</span>
            <span>•</span>
            <span>{employees.length} total employees</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard
            title="Total Employees"
            value={stats.total}
            icon={FaUsers}
            color="text-blue-600"
          />
          <StatCard
            title="Onboarding"
            value={stats.onboarding}
            icon={FaUserPlus}
            color="text-purple-600"
          />
          <StatCard
            title="Active Employees"
            value={stats.active}
            icon={FaChartBar}
            color="text-green-600"
          />
          <StatCard
            title="Pending Tasks"
            value={stats.pending}
            icon={FaBell}
            color="text-yellow-600"
          />
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1 w-full">
              <div className="relative max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <FaFilter />
                <span className="hidden sm:inline">Filter</span>
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <FaFileUpload />
                <span className="hidden sm:inline">Bulk Upload</span>
              </button>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg text-sm"
              >
                <FaPlus />
                Add Employee
              </button>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Employees</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {filteredEmployees.length} of {employees.length} employees shown
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm outline-none">
                  <option>Latest</option>
                  <option>Name A-Z</option>
                  <option>Department</option>
                  <option>Progress</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold">
                              {employee.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.email}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              Started: {employee.startDate}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{employee.department}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="text-sm text-gray-900">{employee.position}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span>{getStatusIcon(employee.status)}</span>
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                            {employee.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${employee.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-sm font-medium text-gray-700">{employee.progress}%</div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewEmployee(employee.id)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <div className="text-gray-400">
                        <FaSearch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No employees found</p>
                        <p className="mt-1">Try adjusting your search terms</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">24</p>
                <p className="text-sm text-gray-500 mt-1">+3 from last week</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FaTasks className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pending Documents</h3>
                <p className="text-2xl font-bold text-yellow-600 mt-2">12</p>
                <p className="text-sm text-gray-500 mt-1">Require verification</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <FaFileUpload className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Training Completed</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">89%</p>
                <p className="text-sm text-gray-500 mt-1">Overall completion rate</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <FaGraduationCap className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Showing data as of {new Date().toLocaleDateString()} • System is up to date</p>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add New Employee</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="john@company.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      value={newEmployee.department}
                      onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="">Select Department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      value={newEmployee.position}
                      onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Software Engineer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newEmployee.startDate}
                    onChange={(e) => setNewEmployee({...newEmployee, startDate: e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEmployee}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  Add Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HRDashboard