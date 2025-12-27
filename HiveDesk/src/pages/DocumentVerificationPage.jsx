import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaUpload, FaCheckCircle, FaTimesCircle, FaEye, FaFilePdf, FaImage, FaRobot, FaChartBar } from 'react-icons/fa'

const DocumentVerificationPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedFile, setSelectedFile] = useState(null)
  const [verifying, setVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)

  // Mock verification data
  const mockVerificationData = {
    status: 'verified',
    confidence: 96.5,
    extractedData: {
      name: 'John Doe',
      dateOfBirth: '1990-05-15',
      documentNumber: 'A12345678',
      issueDate: '2022-06-01',
      expiryDate: '2032-05-31',
      nationality: 'Indian'
    },
    anomalies: [],
    documentType: 'Passport'
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setVerificationResult(null)
    }
  }

  const handleVerify = () => {
    if (!selectedFile) {
      alert('Please select a document first')
      return
    }

    setVerifying(true)
    
    // Simulate AI verification
    setTimeout(() => {
      setVerificationResult(mockVerificationData)
      setVerifying(false)
    }, 2000)
  }

  const getFileIcon = () => {
    if (!selectedFile) return null
    const filename = selectedFile.name.toLowerCase()
    if (filename.endsWith('.pdf')) return <FaFilePdf className="text-red-500 text-4xl" />
    if (filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png')) 
      return <FaImage className="text-green-500 text-4xl" />
    return <FaFilePdf className="text-blue-500 text-4xl" />
  }

  const VerificationBadge = ({ status }) => {
    if (status === 'verified') {
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
          <FaCheckCircle />
          <span className="font-medium">Verified</span>
        </div>
      )
    } else if (status === 'rejected') {
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-full">
          <FaTimesCircle />
          <span className="font-medium">Rejected</span>
        </div>
      )
    } else {
      return (
        <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-medium">
          Pending
        </div>
      )
    }
  }

  const ConfidenceMeter = ({ confidence }) => {
    const getColor = (conf) => {
      if (conf >= 90) return 'text-green-600'
      if (conf >= 70) return 'text-yellow-600'
      return 'text-red-600'
    }

    const getBarColor = (conf) => {
      if (conf >= 90) return 'bg-green-500'
      if (conf >= 70) return 'bg-yellow-500'
      return 'bg-red-500'
    }

    return (
      <div className="w-full">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Confidence Score</span>
          <span className={`text-lg font-bold ${getColor(confidence)}`}>{confidence}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full ${getBarColor(confidence)}`}
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/hr-dashboard')}
                className="px-4 py-2 text-gray-600 hover:text-blue-600"
              >
                ← Back to Dashboard
              </button>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">AI Document Verification</h1>
              <p className="text-sm text-gray-600">HR Portal - Intelligent Verification System</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
              <FaRobot className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">AI-Powered Document Verification</h2>
              <p className="text-gray-600">
                Upload employee documents for AI-powered verification and data extraction
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">📤 Upload Document</h3>
              
              <div className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors bg-blue-50/50">
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      {getFileIcon()}
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
                    <FaUpload className="text-5xl text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag & drop document here</p>
                    <p className="text-sm text-gray-500 mb-4">Supports PDF, JPG, PNG formats</p>
                    <label className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer inline-block">
                      Choose Document
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                )}
              </div>

              <button
                onClick={handleVerify}
                disabled={!selectedFile || verifying}
                className={`w-full mt-6 py-3 rounded-lg font-medium transition-colors ${
                  !selectedFile || verifying
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                }`}
              >
                {verifying ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    AI Verification in Progress...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FaRobot />
                    Start AI Verification
                  </div>
                )}
              </button>

              <div className="mt-6 text-sm text-gray-600">
                <p className="font-medium mb-2">📝 How AI Verification Works:</p>
                <ul className="space-y-1 pl-5 list-disc">
                  <li>Extracts text using OCR technology</li>
                  <li>Validates document authenticity</li>
                  <li>Checks for anomalies and tampering</li>
                  <li>Cross-references extracted data</li>
                  <li>Provides confidence score</li>
                </ul>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">📊 Verification Statistics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">248</div>
                  <div className="text-sm text-gray-600">Documents Verified</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">94.7%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">2.3s</div>
                  <div className="text-sm text-gray-600">Avg. Processing Time</div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">12</div>
                  <div className="text-sm text-gray-600">Anomalies Detected</div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">🔍 Verification Results</h3>
              
              {verificationResult ? (
                <div className="space-y-6">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Verification Status</p>
                      <VerificationBadge status={verificationResult.status} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Document Type</p>
                      <p className="font-medium">{verificationResult.documentType}</p>
                    </div>
                  </div>

                  {/* Confidence Meter */}
                  <ConfidenceMeter confidence={verificationResult.confidence} />

                  {/* Extracted Data */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">📋 Extracted Information</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(verificationResult.extractedData).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="font-medium">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Anomalies */}
                  {verificationResult.anomalies.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaTimesCircle className="text-red-500" />
                        Anomalies Detected
                      </h4>
                      <div className="bg-red-50 rounded-lg p-4">
                        <ul className="space-y-2">
                          {verificationResult.anomalies.map((anomaly, index) => (
                            <li key={index} className="text-red-700 flex items-center gap-2">
                              <FaTimesCircle />
                              {anomaly}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t">
                    <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                      <FaEye className="inline mr-2" />
                      View Detailed Report
                    </button>
                    <button className="flex-1 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 font-medium">
                      <FaCheckCircle className="inline mr-2" />
                      Approve Document
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🔍</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">No Results Yet</h4>
                  <p className="text-gray-600 mb-6">
                    Upload a document and click "Start AI Verification" to see results
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                    <FaChartBar />
                    <span>Powered by AI & Machine Learning</span>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Verifications */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">🕒 Recent Verifications</h3>
              
              <div className="space-y-4">
                {[
                  { name: 'John Doe', doc: 'Passport', status: 'verified', time: '2 min ago' },
                  { name: 'Jane Smith', doc: 'ID Card', status: 'verified', time: '15 min ago' },
                  { name: 'Robert Johnson', doc: 'Degree Certificate', status: 'rejected', time: '1 hour ago' },
                  { name: 'Sarah Williams', doc: 'Resume', status: 'verified', time: '2 hours ago' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.doc} • {item.time}</p>
                    </div>
                    <VerificationBadge status={item.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentVerificationPage