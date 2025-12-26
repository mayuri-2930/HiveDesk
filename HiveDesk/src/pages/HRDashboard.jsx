import React, { useState, useEffect } from 'react';

import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import { addEmployee, getEmployeeTasks } from '../services/api';
import AddEmployeeForm from '../components/hr/AddEmployeeForm';
import DocumentVerification from '../components/hr/DocumentVerification';

const HRDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock data - replace with API call
  const mockEmployees = [
    { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Developer', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'Designer', status: 'Onboarding' },
  ];

  const handleAddEmployee = async (employeeData) => {
    try {
      const newEmployee = await addEmployee(employeeData);
      setEmployees([...employees, newEmployee]);
      setShowAddForm(false);
      toast.success('Employee added successfully!');
    } catch (error) {
      toast.error('Failed to add employee');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            HR Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAddForm(true)}
          >
            Add New Employee
          </Button>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Employees
              </Typography>
              <Typography variant="h4">24</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Onboarding
              </Typography>
              <Typography variant="h4">8</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Documents Pending
              </Typography>
              <Typography variant="h4">12</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tasks Completed
              </Typography>
              <Typography variant="h4">156</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Employee Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>
                      <Chip 
                        label={employee.status} 
                        color={employee.status === 'Active' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small">View Details</Button>
                      <DocumentVerification employeeId={employee.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Add Employee Modal */}
      {showAddForm && (
        <AddEmployeeForm
          open={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddEmployee}
        />
      )}
    </Container>
  );
};

export default HRDashboard;