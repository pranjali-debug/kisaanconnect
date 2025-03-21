import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Send,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup
    .string('Enter your name')
    .required('Name is required'),
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  subject: yup
    .string('Enter a subject')
    .required('Subject is required'),
  message: yup
    .string('Enter your message')
    .min(10, 'Message should be of minimum 10 characters length')
    .required('Message is required'),
});

const ContactPage = () => {
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitStatus(null);
      
      // Simulate API call
      try {
        // In a real app, you would send this data to your backend
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitStatus({ type: 'success', message: 'Your message has been sent successfully. We will get back to you shortly.' });
        resetForm();
      } catch (error) {
        setSubmitStatus({ type: 'error', message: 'Failed to send your message. Please try again later.' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const contactInfo = [
    {
      icon: <Email sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Email',
      details: ['info@farmngo.com', 'support@farmngo.com'],
    },
    {
      icon: <Phone sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
    },
    {
      icon: <LocationOn sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Address',
      details: ['123 Farm Road', 'Agricultural District', 'Farmington, FC 12345'],
    },
  ];

  return (
    <Container>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Have questions or need assistance? We're here to help.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Typography variant="h5" gutterBottom>
            Get In Touch
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Our team is ready to answer your questions about FarmNGO and help you get started with our platform.
          </Typography>
          
          {contactInfo.map((info, index) => (
            <Card key={index} sx={{ mb: 3 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 2 }}>{info.icon}</Box>
                <Box>
                  <Typography variant="h6">{info.title}</Typography>
                  {info.details.map((detail, i) => (
                    <Typography key={i} variant="body1" color="text.secondary">
                      {detail}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Office Hours
          </Typography>
          <Typography variant="body1">
            Monday - Friday: 9:00 AM - 5:00 PM<br />
            Saturday: 10:00 AM - 2:00 PM<br />
            Sunday: Closed
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Send Us a Message
            </Typography>
            
            {submitStatus && (
              <Alert 
                severity={submitStatus.type} 
                sx={{ mb: 3 }}
                onClose={() => setSubmitStatus(null)}
              >
                {submitStatus.message}
              </Alert>
            )}
            
            <Box component="form" onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Your Name"
                    variant="outlined"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    variant="outlined"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="subject"
                    name="subject"
                    label="Subject"
                    variant="outlined"
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.subject && Boolean(formik.errors.subject)}
                    helperText={formik.touched.subject && formik.errors.subject}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="message"
                    name="message"
                    label="Message"
                    multiline
                    rows={6}
                    variant="outlined"
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.message && Boolean(formik.errors.message)}
                    helperText={formik.touched.message && formik.errors.message}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={formik.isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                    disabled={formik.isSubmitting}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactPage;
