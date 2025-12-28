// src/components/employee/EmpDocs.js
import React, { useState, useRef } from 'react'
import { 
  FaUpload, 
  FaFilePdf, 
  FaFileWord, 
  FaFileImage, 
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaTrash,
  FaEye,
  FaDownload
} from 'react-icons/fa'

const EmpDocs = ({ documents, onUpload, onDelete }) => {
  const [uploading, setUploading] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef(null)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <FaCheckCircle className="w-5 h-5 text-green-500" />
      case 'pending': return <FaClock className="w-5 h-5 text-yellow-500" />
      case 'required': return <FaExclamationCircle className="w-5 h-5 text-red-500" />
      default: return <FaFileAlt className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'required': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FaFilePdf className="w-8 h-8 text-red-500" />
      case 'doc': return <FaFileWord className="w-8 h-8 text-blue-500" />
      case 'image': return <FaFileImage className="w-8 h-8 text-green-500" />
      default: return <FaFileAlt className="w-8 h-8 text-gray-500" />
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file || !selectedDoc) return

    setUploading(true)
    
    try {
      await onUpload(file, selectedDoc.id)
      setSelectedDoc(null)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleUploadClick = (doc) => {
    setSelectedDoc(doc)
    setTimeout(() => {
      document.getElementById('file-upload-input')?.click()
    }, 100)
  }

  const stats = {
    total: documents.length,
    verified: documents.filter(d => d.status === 'verified').length,
    pending: documents.filter(d => d.status === 'pending').length,
    required: documents.filter(d => d.status === 'required').length
  }

  const documentGroups = {
    verified: documents.filter(d => d.status === 'verified'),
    pending: documents.filter(d => d.status === 'pending'),
    required: documents.filter(d => d.status === 'required')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Center</h1>
          <p className="text-gray-600">Upload and manage your required documents</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Completion</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0}%
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
            <FaUpload className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Total Documents</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-green-200 bg-green-50">
          <p className="text-sm text-green-600 mb-2">Verified</p>
          <p className="text-2xl font-bold text-green-700">{stats.verified}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-yellow-200 bg-yellow-50">
          <p className="text-sm text-yellow-600 mb-2">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-red-200 bg-red-50">
          <p className="text-sm text-red-600 mb-2">Required</p>
          <p className="text-2xl font-bold text-red-700">{stats.required}</p>
        </div>
      </div>

      {/* Upload Area */}
      {selectedDoc && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 border-dashed rounded-2xl p-8 text-center">
          <div className="max-w-md mx-auto">
            <FaUpload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload {selectedDoc.name}
            </h3>
            <p className="text-gray-600 mb-6">
              Select a file to upload for verification
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                id="file-upload-input"
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {uploading ? 'Uploading...' : 'Choose File'}
              </button>
              <button
                onClick={() => setSelectedDoc(null)}
                disabled={uploading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancel
              </button>
            </div>
            {uploading && (
              <div className="mt-6">
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Uploading document...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Document Lists */}
      <div className="space-y-8">
        {/* Required Documents */}
        {documentGroups.required.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-red-50">
              <h2 className="text-xl font-semibold text-gray-900">Required Documents</h2>
              <p className="text-gray-600 text-sm mt-1">
                These documents are required for your onboarding process
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documentGroups.required.map((doc) => (
                  <div
                    key={doc.id}
                    className="border border-red-200 rounded-xl p-5 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{doc.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                            Required
                          </span>
                        </div>
                      </div>
                      {getStatusIcon(doc.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      This document is required for verification
                    </p>
                    <button
                      onClick={() => handleUploadClick(doc)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Upload Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pending Documents */}
        {documentGroups.pending.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-yellow-50">
              <h2 className="text-xl font-semibold text-gray-900">Pending Verification</h2>
              <p className="text-gray-600 text-sm mt-1">
                These documents have been uploaded and are awaiting verification
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {documentGroups.pending.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-yellow-200 rounded-xl bg-yellow-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-lg border border-yellow-200">
                        {getFileIcon(doc.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                        <p className="text-sm text-gray-600">
                          Uploaded on {doc.date} • {doc.fileName}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                            Pending Review
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowPreview(doc)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <FaEye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleUploadClick(doc)}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Reupload"
                      >
                        <FaUpload className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(doc.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Verified Documents */}
        {documentGroups.verified.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-green-50">
              <h2 className="text-xl font-semibold text-gray-900">Verified Documents</h2>
              <p className="text-gray-600 text-sm mt-1">
                These documents have been verified and approved
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documentGroups.verified.map((doc) => (
                  <div
                    key={doc.id}
                    className="border border-green-200 rounded-xl p-5 bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{doc.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                            Verified
                          </span>
                          <span className="text-xs text-gray-500">Verified on {doc.date}</span>
                        </div>
                      </div>
                      {getStatusIcon(doc.status)}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => setShowPreview(doc)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                      >
                        View
                      </button>
                      <button
                        className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium text-sm"
                      >
                        <FaDownload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Documents State */}
        {documents.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFileAlt className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-4">All required documents have been processed</p>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Refresh to check for updates
            </button>
          </div>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Guidelines</h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <FaCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>Upload clear, legible copies of all documents</span>
          </li>
          <li className="flex items-start gap-3">
            <FaCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>Accepted formats: PDF, JPG, PNG, DOC (Max 10MB)</span>
          </li>
          <li className="flex items-start gap-3">
            <FaCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>Ensure all information is visible and not cropped</span>
          </li>
          <li className="flex items-start gap-3">
            <FaCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>Verification typically takes 2-3 business days</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default EmpDocs