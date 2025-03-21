import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import { SentimentDissatisfied } from '@mui/icons-material';

const NotFoundPage = () => {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          py: 8,
        }}
      >
        <SentimentDissatisfied sx={{ fontSize: 100, color: 'text.secondary', mb: 3 }} />
        <Typography variant="h2" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500, mb: 4 }}>
          Sorry, we couldn't find the page you're looking for. The page may have been moved, deleted,
          or possibly never existed.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained" size="large">
          Return to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
