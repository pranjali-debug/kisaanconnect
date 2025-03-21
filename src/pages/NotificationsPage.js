import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Paper,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  Badge,
  Tab,
  Tabs,
  Alert,
  ListItemSecondaryAction,
  ListItemIcon, // Added missing import
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Check as CheckIcon,
  ShoppingCart as ShoppingCartIcon,
  Message as MessageIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { useNotifications } from '../contexts/NotificationContext';
import { format } from 'date-fns';

const NotificationsPage = () => {
  const { 
    notifications, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event, notification) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = async () => {
    if (selectedNotification) {
      await markAsRead(selectedNotification.id);
    }
    handleMenuClose();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async () => {
    if (selectedNotification) {
      await deleteNotification(selectedNotification.id);
    }
    handleMenuClose();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingCartIcon />;
      case 'message':
        return <MessageIcon />;
      case 'delivery':
        return <LocalShippingIcon />;
      case 'product':
        return <InventoryIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order':
        return 'primary.main';
      case 'message':
        return 'secondary.main';
      case 'delivery':
        return 'success.main';
      case 'product':
        return 'warning.main';
      default:
        return 'info.main';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'MMM d, yyyy h:mm a');
  };

  const filteredNotifications = tabValue === 0 
    ? notifications 
    : tabValue === 1 
      ? notifications.filter(notification => !notification.read) 
      : notifications.filter(notification => notification.read);

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Notifications
        </Typography>
        
        <Button 
          variant="outlined" 
          startIcon={<CheckIcon />}
          onClick={handleMarkAllAsRead}
          disabled={loading || !notifications.some(n => !n.read)}
        >
          Mark All as Read
        </Button>
      </Box>
      
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All" />
          <Tab 
            label={
              <Badge 
                color="error" 
                badgeContent={notifications.filter(n => !n.read).length}
                showZero={false}
              >
                Unread
              </Badge>
            } 
          />
          <Tab label="Read" />
        </Tabs>
        
        <Divider />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredNotifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tabValue === 0 
                ? "You don't have any notifications yet" 
                : tabValue === 1 
                  ? "You don't have any unread notifications" 
                  : "You don't have any read notifications"}
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {filteredNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.selected' },
                  }}
                  component={notification.link ? RouterLink : 'div'}
                  to={notification.link || undefined}
                  onClick={!notification.read ? () => markAsRead(notification.id) : undefined}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getNotificationColor(notification.type) }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                          variant="subtitle1"
                          color="text.primary"
                          sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}
                        >
                          {notification.title}
                        </Typography>
                        
                        {!notification.read && (
                          <Chip 
                            label="New" 
                            color="primary" 
                            size="small" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'block' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatTimestamp(notification.createdAt)}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="more options"
                      onClick={(e) => handleMenuOpen(e, notification)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < filteredNotifications.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedNotification && !selectedNotification.read && (
          <MenuItem onClick={handleMarkAsRead}>
            <ListItemIcon>
              <CheckIcon fontSize="small" />
            </ListItemIcon>
            Mark as read
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete notification
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default NotificationsPage;
