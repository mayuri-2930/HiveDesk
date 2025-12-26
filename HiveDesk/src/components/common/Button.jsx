import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';

const Button = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  fullWidth = false,
  onClick,
  type = 'button',
  sx = {},
  ...props
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      startIcon={loading ? undefined : startIcon}
      endIcon={loading ? undefined : endIcon}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      sx={{
        textTransform: 'none',
        borderRadius: 2,
        fontWeight: 600,
        ...(loading && {
          '& .MuiButton-startIcon, & .MuiButton-endIcon': {
            display: 'none',
          },
        }),
        ...sx,
      }}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress 
            size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
            sx={{ 
              color: 'inherit',
              mr: 1 
            }} 
          />
          Processing...
        </>
      ) : (
        children
      )}
    </MuiButton>
  );
};

// Custom Button Variants
export const PrimaryButton = (props) => (
  <Button color="primary" {...props} />
);

export const SecondaryButton = (props) => (
  <Button color="secondary" {...props} />
);

export const SuccessButton = (props) => (
  <Button 
    sx={{ 
      bgcolor: 'success.main',
      '&:hover': { bgcolor: 'success.dark' }
    }} 
    {...props} 
  />
);

export const DangerButton = (props) => (
  <Button 
    sx={{ 
      bgcolor: 'error.main',
      '&:hover': { bgcolor: 'error.dark' }
    }} 
    {...props} 
  />
);

export const IconButton = ({ icon, label, ...props }) => (
  <Button
    startIcon={icon}
    variant="outlined"
    sx={{ gap: 1 }}
    {...props}
  >
    {label}
  </Button>
);

export default Button;