import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import Navbar from '../components/common/Navbar';
import TaskList from '../components/employee/TaskList';

const TasksPage = () => {
  const handleTaskToggle = (taskId) => {
    console.log('Toggle task:', taskId);
    // TODO: Connect to backend
  };

  return (
    <>
      <Navbar role="employee" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              My Tasks
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Complete these tasks to finish your onboarding process
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <TaskList onTaskToggle={handleTaskToggle} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default TasksPage;