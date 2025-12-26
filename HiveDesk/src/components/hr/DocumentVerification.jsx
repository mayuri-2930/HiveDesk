import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  LinearProgress,
  Chip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadDocument, getVerificationResult } from '../../services/api';

const DocumentVerification = ({ employeeId }) => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Upload document
      const uploadResult = await uploadDocument(file, employeeId);
      
      // Get AI verification result
      const verification = await getVerificationResult(uploadResult.documentId);
      setVerificationResult(verification);
      
      toast.success('Document processed successfully!');
    } catch (error) {
      toast.error('Upload failed: ' + error.message);
    }
    setUploading(false);
  };

  return (
    <>
      <Button 
        size="small" 
        variant="outlined" 
        onClick={() => setOpen(true)}
      >
        Upload Docs
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
        <DialogTitle>Document Verification</DialogTitle>
        <DialogContent>
          {/* Upload Section */}
          <Box sx={{ textAlign: 'center', py: 4, border: '2px dashed #ccc', borderRadius: 2 }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography gutterBottom>
              Drop your document here or click to upload
            </Typography>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="document-upload"
            />
            <label htmlFor="document-upload">
              <Button
                variant="contained"
                component="span"
                disabled={uploading}
              >
                Select Document
              </Button>
            </label>
            
            {uploading && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress />
                <Typography variant="caption">
                  Processing with AI...
                </Typography>
              </Box>
            )}
          </Box>

          {/* Verification Results */}
          {verificationResult && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                AI Verification Results
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label={`Status: ${verificationResult.status}`}
                  color={verificationResult.status === 'Verified' ? 'success' : 'warning'}
                />
                <Chip label={`Confidence: ${verificationResult.confidence}%`} />
                <Chip label={`Type: ${verificationResult.documentType}`} />
              </Box>
              
              {/* Extracted Data */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Extracted Information:</Typography>
                <pre style={{ 
                  background: '#f5f5f5', 
                  padding: '10px', 
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  {JSON.stringify(verificationResult.extractedData, null, 2)}
                </pre>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DocumentVerification;