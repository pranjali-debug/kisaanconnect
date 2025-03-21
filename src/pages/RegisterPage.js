import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonAddOutlined,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = yup.object({
  name: yup
    .string('Enter your name')
    .required('Name is required'),
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
  confirmPassword: yup
    .string('Confirm your password')
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  userType: yup
    .string('Select user type')
    .oneOf(['farmer', 'ngo'], 'Please select a valid user type')
    .required('User type is required'),
});

const steps = ['Account Type', 'Personal Information', 'Create Password'];

const RegisterPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: 'farmer',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (values.password !== values.confirmPassword) {
        setError('Passwords do not match');
        setSubmitting(false);
        return;
      }

      try {
        setError('');
        await signup(values.email, values.password, values.name, values.userType);
        navigate('/dashboard');
      } catch (error) {
        console.error('Registration error:', error);
        setError('Failed to create an account. ' + (error.message || ''));
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleNext = () => {
    // Validate current step before proceeding
    const currentStepFields = {
      0: ['userType'],
      1: ['name', 'email'],
      2: ['password', 'confirmPassword'],
    };

    const hasErrors = currentStepFields[activeStep].some(field => {
      try {
        yup.reach(validationSchema, field).validateSync(formik.values[field]);
        return false;
      } catch (err) {
        formik.setFieldTouched(field, true);
        formik.setFieldError(field, err.message);
        return true;
      }
    });

    if (!hasErrors) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <PersonAddOutlined sx={{ color: 'primary.main', fontSize: 40, mb: 2 }} />
          <Typography component="h1" variant="h4" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Join our community to reduce food waste
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%', mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ mt: 1, width: '100%' }}
          >
            {activeStep === 0 && (
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <FormLabel component="legend" sx={{ mb: 2 }}>
                  Select your account type:
                </FormLabel>
                <RadioGroup
                  name="userType"
                  value={formik.values.userType}
                  onChange={formik.handleChange}
                  sx={{ width: '100%' }}
                >
                  <Paper
                    elevation={formik.values.userType === 'farmer' ? 3 : 1}
                    sx={{
                      p: 3,
                      mb: 2,
                      borderColor: formik.values.userType === 'farmer' ? 'primary.main' : 'divider',
                      borderWidth: 1,
                      borderStyle: 'solid',
                      borderRadius: 2,
                    }}
                  >
                    <FormControlLabel 
                      value="farmer" 
                      control={<Radio color="primary" />} 
                      label={
                        <Box>
                          <Typography variant="h6">Farmer</Typography>
                          <Typography variant="body2" color="text.secondary">
                            I want to sell surplus farm produce
                          </Typography>
                        </Box>
                      } 
                    />
                  </Paper>

                  <Paper
                    elevation={formik.values.userType === 'ngo' ? 3 : 1}
                    sx={{
                      p: 3,
                      borderColor: formik.values.userType === 'ngo' ? 'primary.main' : 'divider',
                      borderWidth: 1,
                      borderStyle: 'solid',
                      borderRadius: 2,
                    }}
                  >
                    <FormControlLabel 
                      value="ngo" 
                      control={<Radio color="primary" />} 
                      label={
                        <Box>
                          <Typography variant="h6">NGO / Organization</Typography>
                          <Typography variant="body2" color="text.secondary">
                            I want to buy and distribute farm produce
                          </Typography>
                        </Box>
                      } 
                    />
                  </Paper>
                </RadioGroup>
                {formik.touched.userType && formik.errors.userType && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {formik.errors.userType}
                  </Typography>
                )}
              </FormControl>
            )}

            {activeStep === 1 && (
              <>
                <TextField
                  margin="normal"
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </>
            )}

            {activeStep === 2 && (
              <>
                <TextField
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={formik.isSubmitting}
                  >
                    Create Account
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>

            <Grid container justifyContent="center" sx={{ mt: 3 }}>
              <Grid item>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/login" variant="body2">
                    Sign In
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
