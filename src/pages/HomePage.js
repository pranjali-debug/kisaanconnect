import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Stack,
  Paper,
  Divider
} from '@mui/material';
import { 
  AgricultureOutlined, 
  Diversity3Outlined, 
  VolunteerActivismOutlined, 
  LocationOnOutlined,
  MessageOutlined,
  VerifiedOutlined
} from '@mui/icons-material';

import { useAuth } from '../contexts/AuthContext';
import LatestProducts from '../components/products/LatestProducts';

function HomePage() {
  const { currentUser } = useAuth();

  return (
    <>
      <Box className="hero-section">
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Connect Farmers with NGOs
          </Typography>
          <Typography variant="h5" paragraph>
            Reduce food waste by selling surplus farm products to organizations that need them
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" mt={4}>
            {!currentUser ? (
              <>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="large"
                  color="primary"
                >
                  Join as Farmer
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="large"
                  color="secondary"
                >
                  Join as NGO
                </Button>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/products"
                variant="contained"
                size="large"
                color="primary"
              >
                Browse Products
              </Button>
            )}
          </Stack>
        </Container>
      </Box>

      <Container sx={{ mt: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} mt={2}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <AgricultureOutlined sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Farmers List Surplus
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Farmers can easily list their surplus produce, specifying quantity, quality, and location.
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Diversity3Outlined sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  NGOs Find Products
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Organizations can search for available produce by location, type, and quantity needed.
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <VolunteerActivismOutlined sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Connect & Transact
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Direct messaging and transaction handling makes the exchange simple and efficient.
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'background.paper', py: 8, mt: 8 }}>
        <Container>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Key Features
          </Typography>
          
          <Grid container spacing={4} mt={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <LocationOnOutlined sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Real-time Maps
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Find nearby farmers and track deliveries with real-time mapping
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <MessageOutlined sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Direct Messaging
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Communicate directly between farmers and organizations
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <VerifiedOutlined sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Verified Profiles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trust built through verification and reviews
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <AgricultureOutlined sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Diverse Products
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All types of farm produce from vegetables to dairy products
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container sx={{ my: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Latest Available Products
        </Typography>
        <LatestProducts />
        
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            component={RouterLink} 
            to="/products" 
            variant="outlined" 
            color="primary" 
            size="large"
          >
            View All Products
          </Button>
        </Box>
      </Container>

      <Box sx={{ bgcolor: 'primary.light', py: 8, mt: 8 }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom>
                Join Our Community Today
              </Typography>
              <Typography variant="body1" paragraph>
                Whether you're a farmer with surplus produce or an organization looking for fresh, local products, 
                our platform helps you connect and make a difference in reducing food waste.
              </Typography>
              <Button 
                component={RouterLink} 
                to="/register" 
                variant="contained" 
                color="secondary" 
                size="large"
              >
                Sign Up Now
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/assets/community.jpg"
                alt="Community"
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default HomePage;
