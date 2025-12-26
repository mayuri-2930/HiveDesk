import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip
} from '@mui/material';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AddEmployeeForm = ({ open, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    startDate: null,
    manager: '',
    location: '',
  });

  const departments = [
    'Engineering',
    'Design',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations',
    'Product'
  ];

  const roles = [
    'Software Engineer',
    'Senior Software Engineer',
    'Product Manager',
    'Designer',
    'Marketing Specialist',
    'Sales Executive',
    'HR Manager',
    'Finance Analyst'
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: Connect to backend API
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error adding employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const actions = (
    <>
      <Button onClick={onClose} variant="outlined">
        Cancel
      </Button>
      <Button 
        type="submit" 
        form="add-employee-form"
        loading={loading}
      >
        Add Employee
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add New Employee"
      actions={actions}
      maxWidth="md"
    >
      <form id="add-employee-form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                label="Role"
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                label="Department"
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(date) => handleChange('startDate', date)}
                renderInput={(params) => <Input {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g., Remote, New York Office"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Onboarding Checklist (Auto-generated based on role)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="Email Setup" size="small" />
              <Chip label="Equipment Request" size="small" />
              <Chip label="Document Collection" size="small" />
              <Chip label="Security Training" size="small" />
              <Chip label="Team Introduction" size="small" />
            </Box>
          </Grid>
        </Grid>
      </form>
    </Modal>
  );
};

export default AddEmployeeForm;