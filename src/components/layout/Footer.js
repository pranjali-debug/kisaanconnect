import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  AgricultureOutlined,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AgricultureOutlined sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" color="text.primary" gutterBottom>
                FarmNGO
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Connecting farmers with surplus produce to NGOs that need it, reducing food waste and supporting communities.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton aria-label="facebook" color="inherit">
                <Facebook />
              </IconButton>
              <IconButton aria-label="twitter" color="inherit">
                <Twitter />
              </IconButton>
              <IconButton aria-label="instagram" color="inherit">
                <Instagram />
              </IconButton>
              <IconButton aria-label="linkedin" color="inherit">
                <LinkedIn />
              </IconButton>
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link component={RouterLink} to="/" color="inherit" underline="hover">
                  Home
                </Link>
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link component={RouterLink} to="/products" color="inherit" underline="hover">
                  Products
                </Link>
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link component={RouterLink} to="/map" color="inherit" underline="hover">
                  Map
                </Link>
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link component={RouterLink} to="/about" color="inherit" underline="hover">
                  About Us
                </Link>
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link component={RouterLink} to="/contact" color="inherit" underline="hover">
                  Contact
                </Link>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              123 Farm Road<br />
              Agricultural District<br />
              Farmington, FC 12345
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Email: info@farmngo.com<br />
              Phone: +1 (555) 123-4567
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ mt: 4, mb: 4 }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            © {currentYear} FarmNGO. All rights reserved.
          </Typography>
          <Box>
            <Link href="#" color="inherit" sx={{ mr: 2 }} underline="hover">
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" underline="hover">
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
