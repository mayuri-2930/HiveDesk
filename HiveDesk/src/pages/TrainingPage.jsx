import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  LinearProgress
} from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Navbar from '../components/common/Navbar';

const TrainingPage = () => {
  const trainings = [
    {
      id: 1,
      title: 'Company Culture & Values',
      description: 'Learn about our mission, vision, and core values',
      duration: '30 min',
      completed: true,
      progress: 100,
      category: 'Required',
      thumbnail: '/api/placeholder/400/225'
    },
    {
      id: 2,
      title: 'Security Awareness Training',
      description: 'Essential cybersecurity practices and protocols',
      duration: '45 min',
      completed: false,
      progress: 60,
      category: 'Required',
      thumbnail: '/api/placeholder/400/225'
    },
    {
      id: 3,
      title: 'Product Deep Dive',
      description: 'Understanding our products and services',
      duration: '60 min',
      completed: false,
      progress: 20,
      category: 'Role-specific',
      thumbnail: '/api/placeholder/400/225'
    },
    {
      id: 4,
      title: 'Communication Tools',
      description: 'How to use Slack, Zoom, and other tools',
      duration: '25 min',
      completed: true,
      progress: 100,
      category: 'Tools',
      thumbnail: '/api/placeholder/400/225'
    },
  ];

  const categories = ['All', 'Required', 'Role-specific', 'Tools', 'Optional'];

  return (
    <>
      <Navbar role="employee" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Training Programs
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Complete these trainings to get up to speed with company processes
            </Typography>
          </Grid>

          {/* Category Filters */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  variant="outlined"
                  clickable
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Box>
          </Grid>

          {/* Training Cards */}
          {trainings.map((training) => (
            <Grid item xs={12} md={6} lg={4} key={training.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={training.thumbnail}
                  alt={training.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h2">
                      {training.title}
                    </Typography>
                    {training.completed && (
                      <CheckCircleIcon color="success" />
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {training.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip 
                      label={training.category} 
                      size="small" 
                      variant="outlined"
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ScheduleIcon fontSize="small" />
                      <Typography variant="caption">{training.duration}</Typography>
                    </Box>
                  </Box>
                  
                  {/* Progress Bar */}
                  <Box sx={{ mt: 'auto' }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={training.progress} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {training.progress}% Complete
                    </Typography>
                  </Box>
                </CardContent>
                
                <CardActions>
                  <Button 
                    fullWidth 
                    variant="contained"
                    startIcon={<PlayCircleIcon />}
                    disabled={training.completed}
                  >
                    {training.completed ? 'Completed' : 'Continue'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default TrainingPage;