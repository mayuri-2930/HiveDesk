import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = ({ type = 'fullscreen', message = 'Loading...', size = 40 }) => {
  const loaderStyles = {
    fullscreen: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      zIndex: 9999,
    },
    inline: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 0',
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    }
  };

  const style = loaderStyles[type] || loaderStyles.inline;

  return (
    <Box sx={style}>
      <CircularProgress 
        size={size} 
        sx={{ 
          color: 'primary.main',
          ...(type === 'button' && { width: '20px !important', height: '20px !important' })
        }} 
      />
      {message && type !== 'button' && (
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 2, 
            color: 'text.secondary',
            fontSize: type === 'button' ? '0.875rem' : '1rem'
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

// Specific Loader Types
export const FullScreenLoader = ({ message }) => (
  <Loader type="fullscreen" message={message} />
);

export const InlineLoader = ({ message }) => (
  <Loader type="inline" message={message} />
);

export const ButtonLoader = ({ message = 'Processing...' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <CircularProgress size={16} sx={{ color: 'inherit' }} />
    <Typography variant="button">{message}</Typography>
  </Box>
);

// Skeleton Loaders
export const SkeletonLoader = ({ count = 3, height = 60 }) => (
  <Box sx={{ width: '100%' }}>
    {[...Array(count)].map((_, index) => (
      <Box
        key={index}
        sx={{
          height,
          backgroundColor: 'grey.100',
          borderRadius: 1,
          marginBottom: 2,
          animation: 'pulse 1.5s infinite',
          '@keyframes pulse': {
            '0%': { opacity: 0.6 },
            '50%': { opacity: 0.8 },
            '100%': { opacity: 0.6 },
          }
        }}
      />
    ))}
  </Box>
);

export default Loader;