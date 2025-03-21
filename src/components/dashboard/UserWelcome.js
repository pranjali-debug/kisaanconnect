import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AddCircleOutline } from '@mui/icons-material';

const UserWelcome = ({ userProfile }) => {
  const isFarmer = userProfile?.userType === 'farmer';
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';
  
  return (
    <Paper 
      sx={{ 
        p: { xs: 3, md: 4 }, 
        mb: 4, 
        backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%)',
        borderRadius: 2
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {greeting}, {userProfile?.name || 'User'}!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {isFarmer 
              ? "Track your product listings, communicate with organizations, and manage your farm business all in one place." 
              : "Find fresh farm produce, communicate with farmers, and manage your orders all in one place."}
          </Typography>
        </Box>
        
        {isFarmer && (
          <Button
            component={RouterLink}
            to="/add-product"
            variant="contained"
            startIcon={<AddCircleOutline />}
            sx={{ mt: { xs: 2, sm: 0 } }}
          >
            Add New Product
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default UserWelcome;
