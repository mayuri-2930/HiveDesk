import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Custom Toast Components
export const SuccessToast = ({ message }) => (
  <div style={{
    padding: '12px 16px',
    background: '#10b981',
    color: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  }}>
    <span style={{ fontSize: '20px' }}>✓</span>
    <span>{message}</span>
  </div>
);

export const ErrorToast = ({ message }) => (
  <div style={{
    padding: '12px 16px',
    background: '#ef4444',
    color: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  }}>
    <span style={{ fontSize: '20px' }}>✗</span>
    <span>{message}</span>
  </div>
);

export const WarningToast = ({ message }) => (
  <div style={{
    padding: '12px 16px',
    background: '#f59e0b',
    color: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }}>
    <span style={{ fontSize: '20px' }}>⚠</span>
    <span>{message}</span>
  </div>
);

export const InfoToast = ({ message }) => (
  <div style={{
    padding: '12px 16px',
    background: '#3b82f6',
    color: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }}>
    <span style={{ fontSize: '20px' }}>ℹ</span>
    <span>{message}</span>
  </div>
);

// Toast Hook Functions
export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  warning: (message) => toast.error(message, { icon: '⚠' }),
  info: (message) => toast(message, { icon: 'ℹ' }),
  loading: (message) => toast.loading(message),
  promise: (promise, messages) => toast.promise(promise, messages),
};

// Toast Container Configuration
export const ToastContainer = () => (
  <Toaster
    position="top-right"
    gutter={8}
    toastOptions={{
      duration: 4000,
      style: {
        borderRadius: '8px',
        background: '#333',
        color: '#fff',
      },
      success: {
        duration: 3000,
        style: {
          background: '#10b981',
        },
      },
      error: {
        duration: 4000,
        style: {
          background: '#ef4444',
        },
      },
    }}
  />
);

// Custom Toast Functions
export const showSuccess = (message) => showToast.success(message);
export const showError = (message) => showToast.error(message);
export const showLoading = (message) => toast.loading(message);
export const dismissToast = (id) => toast.dismiss(id);
export const dismissAllToasts = () => toast.dismiss();

export default ToastContainer;