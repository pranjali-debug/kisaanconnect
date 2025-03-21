import React from 'react';
import { Link as RouterLink, useRouteError } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

const ErrorPage = () => {
  const error = useRouteError();
  
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          py: 8,
        }}
      >
        <Paper elevation={3} sx={{ p: 5, maxWidth: 600, textAlign: 'center' }}>
          <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
          <Typography variant="h4" gutterBottom>
            Something Went Wrong
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            An unexpected error has occurred. Our team has been notified and is working to fix the issue.
          </Typography>
          
          {error && (
            <Box 
              sx={{ 
                bgcolor: 'grey.100', 
                p: 2, 
                borderRadius: 1,
                mb: 3,
                maxHeight: 150,
                overflow: 'auto',
                textAlign: 'left'
              }}
            >
              <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
                {error.message || JSON.stringify(error, null, 2)}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
            <Button component={RouterLink} to="/" variant="contained">
              Return Home
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ErrorPage;
