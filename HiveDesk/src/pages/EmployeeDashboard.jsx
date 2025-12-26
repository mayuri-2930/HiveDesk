import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Button
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
// import { getEmployeeTasks } from '../services/api';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fetch employee tasks
    const fetchTasks = async () => {
      const employeeId = 'current-user-id'; // Get from auth
      const tasksData = await getEmployeeTasks(employeeId);
      setTasks(tasksData);
      
      // Calculate progress
      const completed = tasksData.filter(t => t.completed).length;
      const total = tasksData.length;
      setProgress(total > 0 ? (completed / total) * 100 : 0);
    };
    
    fetchTasks();
  }, []);

  const mockTasks = [
    { id: 1, title: 'Complete tax forms', completed: true },
    { id: 2, title: 'Setup work email', completed: true },
    { id: 3, title: 'Complete security training', completed: false },
    { id: 4, title: 'Meet with manager', completed: false },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Card */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Welcome, John Doe! 👋
              </Typography>
              <Typography variant="body1">
                Your onboarding journey starts here. Complete the tasks below to get started.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Bar */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Onboarding Progress
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="body2" align="right" sx={{ mt: 1 }}>
                {Math.round(progress)}% Complete
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tasks Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Tasks
              </Typography>
              <List>
                {mockTasks.map((task) => (
                  <ListItem key={task.id}>
                    <ListItemIcon>
                      {task.completed ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <PendingIcon color="action" />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={task.title}
                      secondary={`Due: ${task.dueDate || 'No due date'}`}
                    />
                    <Checkbox checked={task.completed} />
                  </ListItem>
                ))}
              </List>
              <Button variant="outlined" sx={{ mt: 2 }}>
                View All Tasks
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Training Recommendations */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recommended Training
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Company Policies"
                    secondary="30 min • Required"
                  />
                  <Button size="small">Start</Button>
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Security Awareness"
                    secondary="45 min • Required"
                  />
                  <Button size="small">Start</Button>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmployeeDashboard;