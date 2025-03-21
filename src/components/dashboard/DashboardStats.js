import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  Inventory2Outlined,
  ShoppingCartOutlined,
  VerifiedOutlined,
  LocalShippingOutlined
} from '@mui/icons-material';

const DashboardStats = ({ stats, userType }) => {
  const isFarmer = userType === 'farmer';

  const statCards = [
    {
      title: isFarmer ? 'Total Products' : 'Available Products',
      value: isFarmer ? stats.totalProducts : stats.availableProducts,
      icon: <Inventory2Outlined sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#e3f2fd',
    },
    {
      title: isFarmer ? 'Available Products' : 'Orders Placed',
      value: isFarmer ? stats.availableProducts : stats.pendingOrders,
      icon: <ShoppingCartOutlined sx={{ fontSize: 40, color: 'secondary.main' }} />,
      color: '#fff8e1',
    },
    {
      title: isFarmer ? 'Sold Products' : 'Received Products',
      value: isFarmer ? stats.soldProducts : stats.soldProducts,
      icon: <VerifiedOutlined sx={{ fontSize: 40, color: 'success.main' }} />,
      color: '#e8f5e9',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: <LocalShippingOutlined sx={{ fontSize: 40, color: 'info.main' }} />,
      color: '#e0f7fa',
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statCards.map((stat, index) => (
        <Grid item xs={6} md={3} key={index}>
          <Paper 
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%',
              bgcolor: stat.color
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" component="h3" color="text.secondary">
                {stat.title}
              </Typography>
              {stat.icon}
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
              {stat.value || 0}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStats;
