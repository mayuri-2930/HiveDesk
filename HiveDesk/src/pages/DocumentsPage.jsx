import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaFileUpload, FaFilePdf, FaFileWord, FaFileExcel, FaCheckCircle, FaClock, FaTrash, FaDownload, FaImage } from 'react-icons/fa'

const DocumentsPage = ({ role }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [documentType, setDocumentType] = useState('resume')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock documents data
  const [documents, setDocuments] = useState([
    {
      id: 1,
      filename: 'employment_contract.pdf',
      documentType: 'Contract',
      uploadDate: '2024-01-15',
      status: 'verified',
      size: '2.4 MB',
      uploadedBy: 'John Doe'
    },
    {
      id: 2,
      filename: 'tax_forms_2024.pdf',
      documentType: 'Tax',
      uploadDate: '2024-01-16',
      status: 'pending',
      size: '1.8 MB',
      uploadedBy: 'John Doe'
    },
    {
      id: 3,
      filename: 'id_proof.jpg',
      documentType: 'ID',
      uploadDate: '2024-01-20',
      status: 'verified',
      size: '3.2 MB',
      uploadedBy: 'John Doe'
    },
    {
      id: 4,
      filename: 'education_certificates.pdf',
      documentType: 'Education',
      uploadDate: '2024-01-18',
      status: 'verified',
      size: '4.1 MB',
      uploadedBy: 'Jane Smith'
    },
    {
      id: 5,
      filename: 'bank_details.docx',
      documentType: 'Bank',
      uploadDate: '2024-01-22',
      status: 'pending',
      size: '0.8 MB',
      uploadedBy: 'Jane Smith'
    },
    {
      id: 6,
      filename: 'resume_updated.pdf',
      documentType: 'Resume',
      uploadDate: '2024-01-25',
      status: 'verified',
      size: '1.2 MB',
      uploadedBy: 'Robert Johnson'
    }
  ])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file first')
      return
    }

    setUploading(true)
    
    // Simulate upload
    setTimeout(() => {
      const newDoc = {
        id: documents.length + 1,
        filename: selectedFile.name,
        documentType: documentType,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        size: `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`,
        uploadedBy: user?.name || 'Current User'
      }
      
      setDocuments([newDoc, ...documents])
      setSelectedFile(null)
      setUploading(false)
      alert('Document uploaded successfully!')
    }, 1500)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== id))
    }
  }

  const handleVerify = (id) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, status: 'verified' } : doc
    ))
  }

  const getFileIcon = (filename) => {
    if (filename.endsWith('.pdf')) return <FaFilePdf className="text-red-500 text-2xl" />
    if (filename.endsWith('.doc') || filename.endsWith('.docx')) return <FaFileWord className="text-blue-500 text-2xl" />
    if (filename.endsWith('.xls') || filename.endsWith('.xlsx')) return <FaFileExcel className="text-green-500 text-2xl" />
    if (filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png')) 
      return <FaImage className="text-purple-500 text-2xl" />
    return <FaFilePdf className="text-gray-500 text-2xl" />
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'verified':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <FaCheckCircle /> Verified
          </span>
        )
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            <FaClock /> Pending
          </span>
        )
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            Uploaded
          </span>
        )
    }
  }

  const filteredDocuments = documents.filter(doc =>
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role === 'hr' && doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(role === 'hr' ? '/hr-dashboard' : '/employee-dashboard')}
                className="px-4 py-2 text-gray-600 hover:text-blue-600"
              >
                ← Back to Dashboard
              </button>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
              <p className="text-sm text-gray-600">{role === 'hr' ? 'HR' : 'Employee'} Portal</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                <FaFileUpload className="text-3xl text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Documents</h2>
                <p className="text-gray-600">
                  {role === 'hr' 
                    ? 'Manage employee documents' 
                    : 'Upload and manage your documents'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section (Only for Employees) */}
        {role === 'employee' && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">📤 Upload New Document</h3>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <div className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors bg-blue-50/50">
                  {selectedFile ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        {getFileIcon(selectedFile.name)}
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{selectedFile.name}</p>
                          <p className="text-sm text-gray-600">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FaFileUpload className="text-5xl text-blue-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Drag & drop your file here</p>
                      <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                      <label className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer inline-block transition-colors">
                        Choose File
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileSelect}
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:w-64 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="resume">Resume</option>
                    <option value="contract">Contract</option>
                    <option value="id">ID Proof</option>
                    <option value="education">Education</option>
                    <option value="tax">Tax Forms</option>
                    <option value="bank">Bank Details</option>
                    <option value="medical">Medical</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    !selectedFile || uploading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}
                >
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <FaFileUpload />
                      Upload Document
                    </div>
                  )}
                </button>
                
                <div className="text-sm text-gray-600 pt-4 border-t">
                  <p className="font-medium mb-1">Supported formats:</p>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2">
                      <FaFilePdf className="text-red-500" /> PDF files
                    </li>
                    <li className="flex items-center gap-2">
                      <FaFileWord className="text-blue-500" /> Word documents
                    </li>
                    <li className="flex items-center gap-2">
                      <FaFileExcel className="text-green-500" /> Excel sheets
                    </li>
                    <li className="flex items-center gap-2">
                      <FaImage className="text-purple-500" /> Images (JPG, PNG)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {role === 'hr' ? 'All Documents' : 'Your Documents'}
            </h3>
            <div className="text-sm text-gray-600">
              {documents.length} documents • {documents.filter(d => d.status === 'verified').length} verified
            </div>
          </div>
          
          {filteredDocuments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="pb-4 text-left font-semibold text-gray-700">Document</th>
                    <th className="pb-4 text-left font-semibold text-gray-700">Type</th>
                    {role === 'hr' && (
                      <th className="pb-4 text-left font-semibold text-gray-700">Employee</th>
                    )}
                    <th className="pb-4 text-left font-semibold text-gray-700">Upload Date</th>
                    <th className="pb-4 text-left font-semibold text-gray-700">Status</th>
                    <th className="pb-4 text-left font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.filename)}
                          <div>
                            <div className="font-medium text-gray-900">{doc.filename}</div>
                            <div className="text-sm text-gray-500">{doc.size}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {doc.documentType}
                        </span>
                      </td>
                      {role === 'hr' && (
                        <td className="py-4 text-gray-700">
                          {doc.uploadedBy}
                        </td>
                      )}
                      <td className="py-4 text-gray-700">
                        {new Date(doc.uploadDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-4">
                        {getStatusBadge(doc.status)}
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Download"
                          >
                            <FaDownload />
                          </button>
                          {role === 'hr' && doc.status === 'pending' && (
                            <button 
                              onClick={() => handleVerify(doc.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Verify"
                            >
                              <FaCheckCircle />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(doc.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📄</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Documents Found</h3>
              <p className="text-gray-600 mb-6">
                {role === 'hr' 
                  ? 'No documents have been uploaded yet.' 
                  : 'Upload your first document to get started'
                }
              </p>
              {role === 'employee' && (
                <button 
                  onClick={() => document.querySelector('input[type="file"]')?.click()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg"
                >
                  Upload Your First Document
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Documents</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">{documents.length}</p>
              </div>
              <FaFileUpload className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Verified</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {documents.filter(d => d.status === 'verified').length}
                </p>
              </div>
              <FaCheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pending Review</h3>
                <p className="text-2xl font-bold text-yellow-600 mt-2">
                  {documents.filter(d => d.status === 'pending').length}
                </p>
              </div>
              <FaClock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentsPage