import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Avatar,
  Button
} from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const WelcomeCard = ({ 
  employeeName = 'John Doe', 
  position = 'Software Engineer',
  startDate = 'February 15, 2024',
  progress = 35,
  onStartTour 
}) => {
  return (
    <Card sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: 2,
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CelebrationIcon />
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                WELCOME TO THE TEAM!
              </Typography>
            </Box>
            
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Hello, {employeeName}!
            </Typography>
            
            <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 2 }}>
              {position} • Started {startDate}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                Your onboarding progress
              </Typography>
              <Box sx={{ 
                width: '100%', 
                height: 8, 
                bgcolor: 'rgba(255,255,255,0.2)', 
                borderRadius: 4,
                overflow: 'hidden'
              }}>
                <Box 
                  sx={{ 
                    width: `${progress}%`, 
                    height: '100%', 
                    bgcolor: 'white',
                    borderRadius: 4,
                    transition: 'width 0.5s ease'
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.9 }}>
                {progress}% Complete • {Math.round((100 - progress) / 10)} days remaining
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                }}
                endIcon={<ArrowForwardIcon />}
                onClick={onStartTour}
              >
                Start Tour
              </Button>
              <Button 
                variant="outlined" 
                sx={{ 
                  borderColor: 'white', 
                  color: 'white',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.8)' }
                }}
              >
                View Schedule
              </Button>
            </Box>
          </Box>
          
          <Avatar
            sx={{ 
              width: 100, 
              height: 100, 
              border: '3px solid white',
              boxShadow: 2
            }}
            src="/api/placeholder/100/100"
          >
            {employeeName.charAt(0)}
          </Avatar>
        </Box>
        
        {/* Quick Stats */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 3, 
          pt: 2, 
          borderTop: '1px solid rgba(255,255,255,0.1)' 
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>12</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>Tasks</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>4</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>Trainings</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>3</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>Meetings</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>2</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>Documents</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;