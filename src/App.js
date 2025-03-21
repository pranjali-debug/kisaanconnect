import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

// Theme
import theme from './styles/theme';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth components
import PrivateRoute from './components/auth/PrivateRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AddProductPage from './pages/AddProductPage';
import MapPage from './pages/MapPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Toolbar /> {/* Empty toolbar for spacing */}
        <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/add-product" element={<PrivateRoute><AddProductPage /></PrivateRoute>} />
            <Route path="/products/:id/edit" element={<PrivateRoute><AddProductPage /></PrivateRoute>} />
            <Route path="/map" element={<PrivateRoute><MapPage /></PrivateRoute>} />
            <Route path="/messages" element={<PrivateRoute><MessagesPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
            
            {/* Error Routes */}
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
