import React from 'react';
import { 
  TextField, 
  InputAdornment, 
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  error = false,
  helperText = '',
  placeholder = '',
  disabled = false,
  required = false,
  fullWidth = true,
  multiline = false,
  rows = 4,
  startIcon,
  endIcon,
  size = 'medium',
  sx = {},
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  if (type === 'password') {
    return (
      <FormControl 
        variant="outlined" 
        fullWidth={fullWidth} 
        error={error}
        size={size}
      >
        <InputLabel>{label}</InputLabel>
        <OutlinedInput
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                edge="end"
                size={size}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label={label}
          sx={sx}
          {...props}
        />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }

  return (
    <TextField
      label={label}
      type={inputType}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      size={size}
      variant="outlined"
      InputProps={{
        startAdornment: startIcon && (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ),
        endAdornment: endIcon && (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ),
      }}
      sx={sx}
      {...props}
    />
  );
};

// Specialized Input Components
export const EmailInput = (props) => (
  <Input 
    type="email" 
    label="Email Address" 
    placeholder="Enter your email"
    {...props} 
  />
);

export const PasswordInput = (props) => (
  <Input 
    type="password" 
    label="Password" 
    placeholder="Enter your password"
    {...props} 
  />
);

export const SearchInput = (props) => (
  <Input 
    placeholder="Search..."
    startIcon={<SearchIcon />}
    sx={{ 
      '& .MuiOutlinedInput-root': { 
        borderRadius: 4,
        backgroundColor: 'background.paper'
      }
    }}
    {...props}
  />
);

export const NumberInput = (props) => (
  <Input 
    type="number" 
    inputProps={{ min: 0 }}
    {...props} 
  />
);

export default Input;