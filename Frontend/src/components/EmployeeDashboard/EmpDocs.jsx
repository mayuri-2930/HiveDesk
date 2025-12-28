// src/components/employee/EmpDocs.js
import React, { useState, useRef, useEffect } from 'react'
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
  FaDownload,
  FaSpinner,
  FaRobot,
  FaPlus,
  FaTimes,
  FaInfoCircle,
  FaEdit,
  FaChevronDown,
  FaChevronUp,
  FaCopy,
  FaExternalLinkAlt
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { documentAPI } from '../../services/api' // Adjust path as needed

const EmpDocs = ({ documents: initialDocuments, onUpload, onDelete, onAddDocument }) => {
  const [uploading, setUploading] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [documents, setDocuments] = useState(initialDocuments || [])
  const [analyzing, setAnalyzing] = useState({})
  const [aiAnalysis, setAiAnalysis] = useState({})
  const [showAddDocumentForm, setShowAddDocumentForm] = useState(false)
  const [newDocumentName, setNewDocumentName] = useState('')
  const [activeTab, setActiveTab] = useState('all') // 'all', 'analysis'
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)
  const [showCustomUploadModal, setShowCustomUploadModal] = useState(false)
  const [customFile, setCustomFile] = useState(null)
  const [customDocumentType, setCustomDocumentType] = useState('')
  const [apiResponse, setApiResponse] = useState(null)
  const [showApiResponse, setShowApiResponse] = useState(false)
  const fileInputRef = useRef(null)
  const customFileInputRef = useRef(null)

  // Sync with parent component documents
  useEffect(() => {
    if (initialDocuments) {
      setDocuments(initialDocuments)
    }
  }, [initialDocuments])

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

  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFileAlt className="w-8 h-8 text-gray-500" />
    
    const extension = fileName.split('.').pop().toLowerCase()
    switch (extension) {
      case 'pdf': return <FaFilePdf className="w-8 h-8 text-red-500" />
      case 'doc':
      case 'docx': return <FaFileWord className="w-8 h-8 text-blue-500" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <FaFileImage className="w-8 h-8 text-green-500" />
      default: return <FaFileAlt className="w-8 h-8 text-gray-500" />
    }
  }

  const handleAddDocument = () => {
    if (!newDocumentName.trim()) {
      toast.error('Please enter a document name')
      return
    }

    const newDoc = {
      id: `custom-${Date.now()}`,
      name: newDocumentName,
      status: 'required',
      category: 'custom',
      isCustom: true,
      date: null,
      fileName: null,
      fileSize: null,
      document_type: 'custom_document',
      custom_name: newDocumentName
    }

    setDocuments(prev => [...prev, newDoc])
    setNewDocumentName('')
    setShowAddDocumentForm(false)
    
    if (onAddDocument) {
      onAddDocument(newDoc)
    }
    
    toast.success(`Added "${newDocumentName}" to required documents`)
  }

  // Handle Custom Document Upload via Modal
  const handleCustomDocumentUpload = async () => {
    if (!customFile) {
      toast.error('Please select a file')
      return
    }

    if (!customDocumentType.trim()) {
      toast.error('Please enter a document type')
      return
    }

    setUploading(true)
    
    try {
      const metadata = {
        document_type: customDocumentType,
        custom_name: customDocumentType
      }
      
      // Call the API to upload document
      const result = await documentAPI.uploadDocument(customFile, metadata)
      
      if (result.success) {
        toast.success('Document uploaded successfully!')
        
        // Store API response
        setApiResponse(result.data)
        setShowApiResponse(true)
        
        // Add to documents list
        const newDoc = {
          id: `custom-${Date.now()}`,
          name: customDocumentType,
          status: 'pending',
          category: 'custom',
          isCustom: true,
          date: new Date().toISOString().split('T')[0],
          fileName: customFile.name,
          fileSize: (customFile.size / 1024 / 1024).toFixed(2) + ' MB',
          document_id: result.data.document_id,
          uploadedAt: new Date().toISOString(),
          api_document_type: customDocumentType,
          document_type: customDocumentType
        }
        
        setDocuments(prev => [...prev, newDoc])
        
        // Call parent callback if provided
        if (onUpload) {
          onUpload(customFile, newDoc.id, newDoc)
        }
        
        // Trigger AI analysis
        if (result.data.document_id) {
          triggerAIAnalysis(result.data.document_id, newDoc.id, metadata)
        }
        
        // Reset modal
        setCustomFile(null)
        setCustomDocumentType('')
        setShowCustomUploadModal(false)
        
      } else {
        toast.error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file || !selectedDoc) {
      toast.error('Please select a file and document')
      return
    }

    // Validate file
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 
                         'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload PDF, JPEG, PNG, or DOC files only')
      return
    }
    
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB')
      return
    }

    setUploading(true)
    
    try {
      const metadata = {
        document_type: selectedDoc.isCustom ? 'custom_document' : selectedDoc.document_type || 'general',
       
      }
      
      const result = await documentAPI.uploadDocument(file, metadata)
      
      if (result.success) {
        toast.success('Document uploaded successfully!')
        
        // Store API response
        setApiResponse(result.data)
        setShowApiResponse(true)
        
        const updatedDoc = {
          ...selectedDoc,
          status: 'pending',
          date: new Date().toISOString().split('T')[0],
          fileName: file.name,
          fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          document_id: result.data.document_id,
          uploadedAt: new Date().toISOString(),
          api_document_type: selectedDoc.isCustom ? 'custom_document' : selectedDoc.document_type
        }
        
        setDocuments(prev => prev.map(doc => 
          doc.id === selectedDoc.id ? updatedDoc : doc
        ))
        
        if (onUpload) {
          onUpload(file, selectedDoc.id, updatedDoc)
        }
        
        if (result.data.document_id) {
          triggerAIAnalysis(result.data.document_id, selectedDoc.id, metadata)
        }
        
        setSelectedDoc(null)
      } else {
        toast.error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerAIAnalysis = async (documentId, docId, metadata = {}) => {
    setAnalyzing(prev => ({ ...prev, [docId]: true }))
    
    try {
      const result = await documentAPI.getAIAnalysis(documentId, metadata)
      
      if (result.success) {
        const analysisData = {
          ...result.data,
          documentId,
          analyzedAt: new Date().toISOString(),
          docId,
          metadata: metadata
        }
        
        setAiAnalysis(prev => ({ ...prev, [docId]: analysisData }))
        
        if (activeTab === 'analysis') {
          setSelectedAnalysis(analysisData)
        }
        
        toast.success('AI analysis completed!')
        
        if (result.data.verification_status === 'verified') {
          setTimeout(() => {
            setDocuments(prev => prev.map(doc => 
              doc.id === docId ? { ...doc, status: 'verified' } : doc
            ))
            toast.success('Document verified successfully!')
          }, 2000)
        } else if (result.data.verification_status === 'rejected') {
          toast.error('Document verification failed. Please upload a valid document.')
        }
      } else {
        toast.error(result.error || 'AI analysis failed')
      }
    } catch (error) {
      console.error('AI analysis failed:', error)
      toast.error('AI analysis failed. Document will be reviewed manually.')
    } finally {
      setAnalyzing(prev => ({ ...prev, [docId]: false }))
    }
  }

  const handleUploadClick = (doc) => {
    setSelectedDoc(doc)
    setTimeout(() => {
      document.getElementById('file-upload-input')?.click()
    }, 100)
  }

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to remove this document?')) {
      return
    }

    const docToDelete = documents.find(d => d.id === docId)
    
    if (onDelete) {
      onDelete(docId)
    }
    
    setDocuments(prev => prev.filter(doc => doc.id !== docId))
    
    setAiAnalysis(prev => {
      const newAnalysis = { ...prev }
      delete newAnalysis[docId]
      return newAnalysis
    })
    
    toast.success(`Removed "${docToDelete?.name}"`)
  }

  const handleDownloadDocument = async (docId) => {
    const doc = documents.find(d => d.id === docId)
    if (!doc?.document_id) {
      toast.error('Document not available for download')
      return
    }

    try {
      toast.success(`Downloading ${doc.name}...`)
      // Implement your download logic here
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Download failed. Please try again.')
    }
  }

  const renderAnalysisDetails = (analysis) => {
    if (!analysis) return null
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Verification Status</p>
            <p className={`text-lg font-semibold ${
              analysis.verification_status === 'verified' ? 'text-green-600 dark:text-green-400' :
              analysis.verification_status === 'rejected' ? 'text-red-600 dark:text-red-400' :
              'text-yellow-600 dark:text-yellow-400'
            }`}>
              {analysis.verification_status?.toUpperCase() || 'PENDING'}
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">AI Confidence Score</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 dark:bg-green-400 h-2 rounded-full"
                  style={{ width: `${(analysis.confidence_score || 0) * 100}%` }}
                ></div>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {((analysis.confidence_score || 0) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {analysis.metadata && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Document Information</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Document Type:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {analysis.metadata.document_type === 'custom_document' ? 'Custom Document' : analysis.metadata.document_type}
                </span>
              </div>
              {analysis.metadata.custom_name && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Custom Name:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {analysis.metadata.custom_name}
                  </span>
                </div>
              )}
              {analysis.document_type && analysis.document_type !== analysis.metadata.document_type && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">AI Detected Type:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {analysis.document_type}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {analysis.extracted_data && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Extracted Information</p>
            <div className="space-y-2">
              {Object.entries(analysis.extracted_data).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span className="text-gray-600 dark:text-gray-400">{key}:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{value || 'Not found'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.issues && analysis.issues.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">Issues Found</p>
            <ul className="space-y-1">
              {analysis.issues.map((issue, index) => (
                <li key={index} className="flex items-start gap-2 text-red-700 dark:text-red-300">
                  <FaExclamationCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysis.analysis_notes && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-2">Analysis Notes</p>
            <p className="text-gray-700 dark:text-gray-300">{analysis.analysis_notes}</p>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
          Analyzed on {new Date(analysis.analyzedAt).toLocaleString()}
        </div>
      </div>
    )
  }

  // Render API Response Section
  const renderApiResponse = () => {
    if (!apiResponse) return null
    
    return (
      <div className="mt-8">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-indigo-50 dark:bg-indigo-900/20">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">API Response</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowApiResponse(!showApiResponse)}
                  className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                >
                  {showApiResponse ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                  {showApiResponse ? 'Hide' : 'Show'} Response
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(apiResponse, null, 2))
                    toast.success('Response copied to clipboard!')
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <FaCopy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Document uploaded successfully! Response received from API
            </div>
          </div>
          
          {showApiResponse && (
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Summary */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Response Summary</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Document ID</p>
                        <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                          {apiResponse.document_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Document Type</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {apiResponse.document_type}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Confidence Score</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-green-500 dark:bg-green-400 h-2 rounded-full"
                              style={{ width: `${(apiResponse.confidence_score || 0) * 100}%` }}
                            ></div>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {(apiResponse.confidence_score * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      {apiResponse.ai_analysis?.verification_status && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Verification Status</p>
                          <p className={`font-medium ${
                            apiResponse.ai_analysis.verification_status === 'VERIFIED' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-yellow-600 dark:text-yellow-400'
                          }`}>
                            {apiResponse.ai_analysis.verification_status}
                          </p>
                        </div>
                      )}
                      {apiResponse.processed_at && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Processed At</p>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {new Date(apiResponse.processed_at).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Extracted Fields */}
                  {apiResponse.ai_analysis?.extracted_fields && (
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Extracted Fields</h3>
                      <div className="space-y-2">
                        {Object.entries(apiResponse.ai_analysis.extracted_fields).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{key}:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white text-right">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Full Response */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">Raw API Response</span>
                      <button
                        onClick={() => {
                          const jsonString = JSON.stringify(apiResponse, null, 2)
                          const blob = new Blob([jsonString], { type: 'application/json' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `api-response-${apiResponse.document_id}.json`
                          document.body.appendChild(a)
                          a.click()
                          document.body.removeChild(a)
                          URL.revokeObjectURL(url)
                          toast.success('Response downloaded as JSON!')
                        }}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <FaDownload className="w-3 h-3" />
                        Download JSON
                      </button>
                    </div>
                    <pre className="p-4 text-sm text-gray-100 overflow-auto max-h-96">
                      {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                  </div>

                  {/* Extracted Text Preview */}
                  {apiResponse.extracted_text && (
                    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Extracted Text</h3>
                      </div>
                      <div className="p-4 max-h-48 overflow-y-auto">
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                          {apiResponse.extracted_text.length > 500 
                            ? `${apiResponse.extracted_text.substring(0, 500)}...` 
                            : apiResponse.extracted_text}
                        </p>
                        {apiResponse.extracted_text.length > 500 && (
                          <button
                            onClick={() => {
                              const textWindow = window.open('', 'Extracted Text', 'width=800,height=600')
                              textWindow.document.write(`
                                <html>
                                  <head>
                                    <title>Extracted Text - ${apiResponse.document_type}</title>
                                    <style>
                                      body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
                                      pre { background: white; padding: 20px; border-radius: 5px; border: 1px solid #ddd; overflow: auto; }
                                      h2 { color: #333; }
                                    </style>
                                  </head>
                                  <body>
                                    <h2>Extracted Text from ${apiResponse.document_type}</h2>
                                    <pre>${apiResponse.extracted_text}</pre>
                                  </body>
                                </html>
                              `)
                            }}
                            className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View full extracted text
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
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

  const documentsWithAnalysis = documents.filter(doc => aiAnalysis[doc.id])

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Document Center</h1>
          <p className="text-gray-600 dark:text-gray-400">Upload and manage your required documents</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Completion</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0}%
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
            <FaUpload className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            All Documents
          </button>
          <button
            onClick={() => {
              setActiveTab('analysis')
              if (documentsWithAnalysis.length > 0) {
                const firstDoc = documentsWithAnalysis[0]
                setSelectedAnalysis(aiAnalysis[firstDoc.id])
              }
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm relative ${
              activeTab === 'analysis'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400 dark:border-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FaRobot className="w-4 h-4" />
              AI Analysis
              {documentsWithAnalysis.length > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-purple-500 rounded-full">
                  {documentsWithAnalysis.length}
                </span>
              )}
            </div>
          </button>
        </nav>
      </div>

      {/* Custom Document Upload Modal */}
      {showCustomUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Custom Document</h3>
                <button
                  onClick={() => {
                    setShowCustomUploadModal(false)
                    setCustomFile(null)
                    setCustomDocumentType('')
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* File Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    {customFile ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          {getFileIcon(customFile.name)}
                          <div className="text-left">
                            <p className="font-medium text-gray-900 dark:text-white">{customFile.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {(customFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setCustomFile(null)}
                          className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FaUpload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-400 mb-2">Drag & drop or click to select</p>
                        <button
                          onClick={() => customFileInputRef.current?.click()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Browse Files
                        </button>
                        <input
                          ref={customFileInputRef}
                          type="file"
                          onChange={(e) => setCustomFile(e.target.files[0])}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Supported formats: PDF, JPG, PNG, DOC (Max 10MB)
                  </p>
                </div>

                {/* Document Type Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Document Type
                  </label>
                  <input
                    type="text"
                    value={customDocumentType}
                    onChange={(e) => setCustomDocumentType(e.target.value)}
                    placeholder="Enter document type (e.g., resume, certificate, license)"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && !uploading && handleCustomDocumentUpload()}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    This will be sent as document_type in the API request
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCustomUploadModal(false)
                  setCustomFile(null)
                  setCustomDocumentType('')
                }}
                disabled={uploading}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomDocumentUpload}
                disabled={!customFile || !customDocumentType.trim() || uploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload className="w-4 h-4" />
                    Upload Document
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Tab Content */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Document List with Analysis */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Documents with AI Analysis</h3>
                {documentsWithAnalysis.length > 0 ? (
                  <div className="space-y-3">
                    {documentsWithAnalysis.map(doc => {
                      const analysis = aiAnalysis[doc.id]
                      return (
                        <button
                          key={doc.id}
                          onClick={() => setSelectedAnalysis(analysis)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedAnalysis?.docId === doc.id
                              ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                              : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  analysis.verification_status === 'verified' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                  {analysis.verification_status}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {((analysis.confidence_score || 0) * 100).toFixed(1)}% confidence
                                </span>
                              </div>
                              {doc.isCustom && (
                                <span className="text-xs text-blue-600 dark:text-blue-400 mt-1 block">
                                  Custom Document
                                </span>
                              )}
                            </div>
                            <FaRobot className={`w-4 h-4 ${
                              analysis.verification_status === 'verified' 
                                ? 'text-green-500' 
                                : 'text-yellow-500'
                            }`} />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FaRobot className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">No AI analysis available yet</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Upload documents to see AI analysis results
                    </p>
                  </div>
                )}
              </div>
              
              {/* Add Custom Document Button */}
              <button
                onClick={() => setShowCustomUploadModal(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors text-center"
              >
                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                  <FaPlus className="w-5 h-5" />
                  <span className="font-medium">Upload Custom Document</span>
                </div>
              </button>
            </div>

            {/* Analysis Details Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 h-full">
                {selectedAnalysis ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Analysis Details</h3>
                      <div className="flex items-center gap-2">
                        {analyzing[selectedAnalysis.docId] && (
                          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                            <FaSpinner className="animate-spin" />
                            Analyzing...
                          </span>
                        )}
                      </div>
                    </div>
                    {renderAnalysisDetails(selectedAnalysis)}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <FaRobot className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a Document</h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      Choose a document from the list to view detailed AI analysis results including verification status, confidence scores, and extracted information.
                    </p>
                    <button
                      onClick={() => setShowCustomUploadModal(true)}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Upload Your First Document
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Documents Tab Content */}
      {activeTab === 'all' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20">
              <p className="text-sm text-green-600 dark:text-green-400 mb-2">Verified</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.verified}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-900/20">
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">Pending</p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{stats.pending}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20">
              <p className="text-sm text-red-600 dark:text-red-400 mb-2">Required</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.required}</p>
            </div>
          </div>

          {/* API Response Display */}
          {renderApiResponse()}

          {/* Add Custom Document Button */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Documents</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upload and manage your documents</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddDocumentForm(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FaPlus className="w-4 h-4" />
                Add to List
              </button>
              <button
                onClick={() => setShowCustomUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaUpload className="w-4 h-4" />
                Upload Custom Document
              </button>
            </div>
          </div>

          {/* Add to List Form */}
          {showAddDocumentForm && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-blue-200 dark:border-blue-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Add Document to Required List</h3>
                <button
                  onClick={() => {
                    setShowAddDocumentForm(false)
                    setNewDocumentName('')
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newDocumentName}
                  onChange={(e) => setNewDocumentName(e.target.value)}
                  placeholder="Enter document name to add to required list"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDocument()}
                />
                <button
                  onClick={handleAddDocument}
                  disabled={!newDocumentName.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Add to List
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                This will add the document to your required list. You can upload it later.
              </p>
            </div>
          )}

          {/* Upload Area */}
          {selectedDoc && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-300 dark:border-blue-700 border-dashed rounded-2xl p-8 text-center">
              <div className="max-w-md mx-auto">
                <FaUpload className="w-12 h-12 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Upload {selectedDoc.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {selectedDoc.isCustom ? (
                    <>This custom document will be sent to the API with document_type: 'custom_document'</>
                  ) : (
                    <>Select a file to upload for verification</>
                  )}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <input
                    id="file-upload-input"
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
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
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Cancel
                  </button>
                </div>
                {uploading && (
                  <div className="mt-6">
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <div className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Uploading document...</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  Supported formats: PDF, JPG, PNG, DOC (Max 10MB)
                </p>
                {selectedDoc.isCustom && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>API Parameters:</strong> document_type='custom_document', custom_name='{selectedDoc.name}'
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Document Lists */}
          <div className="space-y-8">
            {/* Required Documents */}
            {documentGroups.required.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Required Documents</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {documentGroups.required.filter(d => d.isCustom).length > 0 && 
                     `${documentGroups.required.filter(d => d.isCustom).length} custom document(s) added by you`}
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documentGroups.required.map((doc) => (
                      <div
                        key={doc.id}
                        className="border border-red-200 dark:border-red-800 rounded-xl p-5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{doc.name}</h3>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                                Required
                              </span>
                              {doc.isCustom ? (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                  Custom
                                </span>
                              ) : (
                                doc.document_type && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400">
                                    {doc.document_type}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                          {getStatusIcon(doc.status)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {doc.description || 'This document is required for verification'}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUploadClick(doc)}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <FaUpload />
                            Upload Now
                          </button>
                          {doc.isCustom && (
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              title="Remove from list"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pending Documents */}
            {documentGroups.pending.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pending Verification</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    These documents have been uploaded and are awaiting verification
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {documentGroups.pending.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border border-yellow-200 dark:border-yellow-800 rounded-xl bg-yellow-50 dark:bg-yellow-900/20"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-yellow-200 dark:border-yellow-700">
                            {getFileIcon(doc.fileName)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{doc.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {doc.fileName && `File: ${doc.fileName} • `}
                              Uploaded on {doc.date || 'N/A'}
                              {doc.api_document_type && (
                                <span className="block text-xs text-gray-500 dark:text-gray-400">
                                  API Type: {doc.api_document_type}
                                </span>
                              )}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                                Pending Review
                              </span>
                              {doc.isCustom && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                  Custom
                                </span>
                              )}
                              {analyzing[doc.id] && (
                                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                  <FaSpinner className="animate-spin" />
                                  AI Analyzing...
                                </span>
                              )}
                              {aiAnalysis[doc.id] && (
                                <button
                                  onClick={() => {
                                    setActiveTab('analysis')
                                    setSelectedAnalysis(aiAnalysis[doc.id])
                                  }}
                                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/40"
                                >
                                  <FaRobot />
                                  View Analysis
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleUploadClick(doc)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
                            title="Reupload"
                          >
                            <FaUpload className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
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
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/20">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Verified Documents</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    These documents have been verified and approved
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documentGroups.verified.map((doc) => (
                      <div
                        key={doc.id}
                        className="border border-green-200 dark:border-green-800 rounded-xl p-5 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{doc.name}</h3>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                                Verified
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {doc.date ? `Verified on ${doc.date}` : 'Verified'}
                              </span>
                              {doc.isCustom && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                  Custom
                                </span>
                              )}
                            </div>
                            {aiAnalysis[doc.id]?.confidence_score && (
                              <div className="mt-2 flex items-center gap-1">
                                <FaRobot className="w-3 h-3 text-indigo-500" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  AI Confidence: {(aiAnalysis[doc.id].confidence_score * 100).toFixed(1)}%
                                </span>
                              </div>
                            )}
                            {doc.api_document_type && (
                              <div className="mt-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  API Type: {doc.api_document_type}
                                </span>
                              </div>
                            )}
                          </div>
                          {getStatusIcon(doc.status)}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleDownloadDocument(doc.id)}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                          >
                            <FaDownload />
                            Download
                          </button>
                          {aiAnalysis[doc.id] && (
                            <button
                              onClick={() => {
                                setActiveTab('analysis')
                                setSelectedAnalysis(aiAnalysis[doc.id])
                              }}
                              className="px-4 py-2 border border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors font-medium text-sm flex items-center justify-center"
                              title="View AI Analysis"
                            >
                              <FaRobot className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* No Documents State */}
            {documents.length === 0 && !showAddDocumentForm && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileAlt className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No documents found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Add your first document to get started</p>
                <button
                  onClick={() => setShowCustomUploadModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Upload Custom Document
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Upload Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Guidelines</h3>
        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-3">
            <FaCheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span>You can add custom documents - they will be sent to the API as document_type: 'custom_document'</span>
          </li>
          <li className="flex items-start gap-3">
            <FaCheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span>Upload clear, legible copies of all documents</span>
          </li>
          <li className="flex items-start gap-3">
            <FaCheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span>View AI analysis results in the "AI Analysis" tab</span>
          </li>
          <li className="flex items-start gap-3">
            <FaCheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span>Accepted formats: PDF, JPG, PNG, DOC (Max 10MB)</span>
          </li>
          <li className="flex items-start gap-3">
            <FaCheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span>Custom document names are passed as 'custom_name' parameter in API</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default EmpDocs