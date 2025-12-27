import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'

// Pages
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HRDashboard from './pages/HRDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import TasksPage from './pages/TasksPage'
import DocumentsPage from './pages/DocumentsPage'
import TrainingPage from './pages/TrainingPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 'bold',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* HR Routes */}
          <Route path="/hr-dashboard" element={
            <ProtectedRoute role="hr">
              <HRDashboard />
            </ProtectedRoute>
          } />
          <Route path="/hr/tasks" element={
            <ProtectedRoute role="hr">
              <TasksPage role="hr" />
            </ProtectedRoute>
          } />
          <Route path="/hr/documents" element={
            <ProtectedRoute role="hr">
              <DocumentsPage role="hr" />
            </ProtectedRoute>
          } />
          <Route path="/hr/training" element={
            <ProtectedRoute role="hr">
              <TrainingPage role="hr" />
            </ProtectedRoute>
          } />
          
          {/* Employee Routes */}
          <Route path="/employee-dashboard" element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          } />
          <Route path="/employee/tasks" element={
            <ProtectedRoute>
              <TasksPage role="employee" />
            </ProtectedRoute>
          } />
          <Route path="/employee/documents" element={
            <ProtectedRoute>
              <DocumentsPage role="employee" />
            </ProtectedRoute>
          } />
          <Route path="/employee/training" element={
            <ProtectedRoute>
              <TrainingPage role="employee" />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App