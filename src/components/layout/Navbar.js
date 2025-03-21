import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  NotificationsOutlined,
  AgricultureOutlined,
  Dashboard,
  Inventory,
  AddCircleOutline,
  Person,
  Message,
  Map,
  Logout,
  Info,
  ContactSupport,
} from '@mui/icons-material';

import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
    handleCloseUserMenu();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        FarmNGO
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/">
            <ListItemIcon>
              <AgricultureOutlined />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/about">
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/contact">
            <ListItemIcon>
              <ContactSupport />
            </ListItemIcon>
            <ListItemText primary="Contact" />
          </ListItemButton>
        </ListItem>

        {currentUser ? (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/dashboard">
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/products">
                <ListItemIcon>
                  <Inventory />
                </ListItemIcon>
                <ListItemText primary="Products" />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/add-product">
                <ListItemIcon>
                  <AddCircleOutline />
                </ListItemIcon>
                <ListItemText primary="Add Product" />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/messages">
                <ListItemIcon>
                  <Message />
                </ListItemIcon>
                <ListItemText primary="Messages" />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/map">
                <ListItemIcon>
                  <Map />
                </ListItemIcon>
                <ListItemText primary="Map" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/login">
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/register">
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <AgricultureOutlined sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            FarmNGO
          </Typography>

          {/* Mobile menu button */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Logo for mobile */}
          <AgricultureOutlined sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            FarmNGO
          </Typography>

          {/* Desktop navigation links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button component={RouterLink} to="/about" sx={{ color: 'text.primary', mx: 1 }}>
              About
            </Button>
            <Button component={RouterLink} to="/contact" sx={{ color: 'text.primary', mx: 1 }}>
              Contact
            </Button>
            
            {currentUser && (
              <>
                <Button component={RouterLink} to="/dashboard" sx={{ color: 'text.primary', mx: 1 }}>
                  Dashboard
                </Button>
                <Button component={RouterLink} to="/products" sx={{ color: 'text.primary', mx: 1 }}>
                  Products
                </Button>
                <Button component={RouterLink} to="/map" sx={{ color: 'text.primary', mx: 1 }}>
                  Map
                </Button>
              </>
            )}
          </Box>

          {/* Right side - user menu or login/register */}
          <Box sx={{ flexGrow: 0 }}>
            {currentUser ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    component={RouterLink} 
                    to="/notifications" 
                    size="large" 
                    color="inherit"
                    sx={{ mr: 2 }}
                  >
                    <Badge badgeContent={4} color="error">
                      <NotificationsOutlined />
                    </Badge>
                  </IconButton>
                  
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar 
                        alt={currentUser.displayName || "User"} 
                        src={userProfile?.photoURL || "/assets/default-avatar.jpg"} 
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  
                  <MenuItem component={RouterLink} to="/messages" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <Message fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Messages</Typography>
                  </MenuItem>
                  
                  <MenuItem component={RouterLink} to="/add-product" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <AddCircleOutline fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Add Product</Typography>
                  </MenuItem>
                  
                  <Divider />
                  
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button component={RouterLink} to="/login" variant="outlined" sx={{ mx: 1 }}>
                  Login
                </Button>
                <Button component={RouterLink} to="/register" variant="contained" color="primary">
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
