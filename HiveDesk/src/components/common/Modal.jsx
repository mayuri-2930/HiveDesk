import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Modal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  showCloseButton = true,
  dividers = true,
  sx = {}
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          ...sx,
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
        borderBottom: dividers ? '1px solid' : 'none',
        borderColor: 'divider'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {showCloseButton && (
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ ml: 2 }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      {/* Content */}
      <DialogContent dividers={dividers} sx={{ py: 3 }}>
        {children}
      </DialogContent>

      {/* Actions */}
      {actions && (
        <DialogActions sx={{ 
          px: 3, 
          py: 2,
          borderTop: dividers ? '1px solid' : 'none',
          borderColor: 'divider'
        }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

// Modal Variants
export const ConfirmationModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  loading = false
}) => {
  const actions = (
    <>
      <Button onClick={onClose} disabled={loading}>
        {cancelText}
      </Button>
      <Button 
        onClick={onConfirm} 
        color={confirmColor}
        loading={loading}
      >
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      actions={actions}
    >
      <Typography>{message}</Typography>
    </Modal>
  );
};

export const FullScreenModal = (props) => (
  <Modal maxWidth={false} fullScreen {...props} />
);

export default Modal;