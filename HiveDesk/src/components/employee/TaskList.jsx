import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Checkbox,
  IconButton,
  Chip,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TodayIcon from '@mui/icons-material/Today';
import AlarmIcon from '@mui/icons-material/Alarm';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import FilterListIcon from '@mui/icons-material/FilterList';

const TaskList = ({ tasks = [], onTaskToggle, onTaskDelete }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Mock data if none provided
  const mockTasks = tasks.length > 0 ? tasks : [
    { id: 1, title: 'Complete tax forms', description: 'Fill and submit W-4 and I-9 forms', completed: true, priority: 'high', dueDate: '2024-02-20', category: 'Documents' },
    { id: 2, title: 'Setup work email', description: 'Configure Outlook and company email', completed: true, priority: 'medium', dueDate: '2024-02-18', category: 'IT' },
    { id: 3, title: 'Complete security training', description: 'Mandatory cybersecurity training', completed: false, priority: 'high', dueDate: '2024-02-25', category: 'Training' },
    { id: 4, title: 'Meet with manager', description: 'Initial 1:1 meeting', completed: false, priority: 'medium', dueDate: '2024-02-22', category: 'Meetings' },
    { id: 5, title: 'Submit equipment request', description: 'Request laptop and accessories', completed: false, priority: 'low', dueDate: '2024-02-28', category: 'IT' },
  ];

  const filteredTasks = mockTasks.filter(task => {
    // Filter by status
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'pending' && task.completed) return false;
    
    // Filter by search
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
    
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const completedCount = mockTasks.filter(t => t.completed).length;
  const totalCount = mockTasks.length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6">Onboarding Tasks</Typography>
          <Typography variant="body2" color="text.secondary">
            {completedCount} of {totalCount} tasks completed
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search tasks..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 200 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Filter"
            >
              <MenuItem value="all">All Tasks</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Task List */}
      <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
        {filteredTasks.map((task) => (
          <ListItem
            key={task.id}
            sx={{
              borderLeft: task.priority === 'high' ? '4px solid' : 'none',
              borderColor: 'error.main',
              mb: 1,
              borderRadius: 1,
              '&:hover': { bgcolor: 'action.hover' }
            }}
            secondaryAction={
              <IconButton edge="end">
                <MoreVertIcon />
              </IconButton>
            }
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={task.completed}
                onChange={() => onTaskToggle?.(task.id)}
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<CheckCircleIcon color="success" />}
              />
            </ListItemIcon>
            
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      textDecoration: task.completed ? 'line-through' : 'none',
                      opacity: task.completed ? 0.7 : 1
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Chip 
                    label={task.priority} 
                    size="small" 
                    color={getPriorityColor(task.priority)}
                    variant="outlined"
                  />
                  <Chip 
                    label={task.category} 
                    size="small" 
                    variant="outlined"
                  />
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {task.description}
                  </Typography>
                  {task.dueDate && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TodayIcon fontSize="small" />
                      <Typography variant="caption" color="text.secondary">
                        Due: {task.dueDate}
                      </Typography>
                    </Box>
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>

      {filteredTasks.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            No tasks found. Enjoy your day! 🎉
          </Typography>
        </Box>
      )}

      {/* Progress Summary */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mt: 3, 
        p: 2, 
        bgcolor: 'primary.light', 
        borderRadius: 1,
        color: 'white'
      }}>
        <Box>
          <Typography variant="subtitle2">Today's Progress</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Keep going! You're doing great.
          </Typography>
        </Box>
        <Typography variant="h6">
          {Math.round((completedCount / totalCount) * 100)}%
        </Typography>
      </Box>
    </Box>
  );
};

export default TaskList;