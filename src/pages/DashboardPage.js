import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Box, 
  CircularProgress 
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductsContext';
import { useMessages } from '../contexts/MessagesContext';

const DashboardPage = () => {
  const { currentUser, userProfile } = useAuth();
  const { products, loading: productsLoading } = useProducts();
  const { conversations, loading: messagesLoading } = useMessages();
  const [isFarmer, setIsFarmer] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setIsFarmer(userProfile.userType === 'farmer');
    }
  }, [userProfile]);

  if (!currentUser || !userProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {userProfile.name}!
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Products
            </Typography>
            {productsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '20vh' }}>
                <CircularProgress />
              </Box>
            ) : products.length > 0 ? (
              <Box>
                {products.slice(0, 3).map((product) => (
                  <Box key={product.id} sx={{ mb: 2 }}>
                    <Typography variant="body1">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                  </Box>
                ))}
                <Button component={RouterLink} to="/products" variant="outlined" sx={{ mt: 2 }}>
                  View All Products
                </Button>
              </Box>
            ) : (
              <Box sx={{ py: 2, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No products listed yet. Start adding your farm produce!
                </Typography>
                <Button component={RouterLink} to="/add-product" variant="outlined" sx={{ mt: 2 }}>
                  Add Product
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Messages
            </Typography>
            {messagesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '20vh' }}>
                <CircularProgress />
              </Box>
            ) : conversations.length > 0 ? (
              <Box>
                {conversations.slice(0, 3).map((conversation) => (
                  <Box key={conversation.id} sx={{ mb: 2 }}>
                    <Typography variant="body1">{conversation.lastMessage}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {conversation.participants.join(', ')}
                    </Typography>
                  </Box>
                ))}
                <Button component={RouterLink} to="/messages" variant="outlined" sx={{ mt: 2 }}>
                  View All Messages
                </Button>
              </Box>
            ) : (
              <Box sx={{ py: 2, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No recent messages yet. Start connecting with farmers and organizations!
                </Typography>
                <Button 
                  component={RouterLink} 
                  to={isFarmer ? "/products" : "/map"} 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                >
                  {isFarmer ? "View Products" : "Explore Map"}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;