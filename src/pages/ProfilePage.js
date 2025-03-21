import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Divider,
  TextField,
  IconButton,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  Chip,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera,
  LocationOn,
  Phone,
  Email,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductsContext';
import { doc, updateDoc, GeoPoint } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import GoogleMapComponent from '../components/maps/GoogleMapComponent';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage = () => {
  const { currentUser, userProfile, fetchUserProfile } = useAuth();
  const { getProductsByUserId, loading: productsLoading } = useProducts();
  const navigate = useNavigate();
  
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [userProducts, setUserProducts] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    bio: '',
    phone: '',
    email: '',
    location: null,
  });

  useEffect(() => {
    if (userProfile) {
      setEditedProfile({
        name: userProfile.name || '',
        bio: userProfile.bio || '',
        phone: userProfile.phone || '',
        email: userProfile.email || '',
        location: userProfile.location || null,
      });
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchUserProducts = async () => {
      if (!currentUser) return;
      
      try {
        const products = await getProductsByUserId(currentUser.uid);
        setUserProducts(products);
      } catch (error) {
        console.error('Error fetching user products:', error);
      }
    };

    fetchUserProducts();
  }, [currentUser, getProductsByUserId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Cancel edit - reset to original values
      setEditedProfile({
        name: userProfile.name || '',
        bio: userProfile.bio || '',
        phone: userProfile.phone || '',
        email: userProfile.email || '',
        location: userProfile.location || null,
      });
      setProfileImage(null);
      setImagePreview(null);
    }
    setEditMode(!editMode);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleLocationSelect = (location) => {
    setEditedProfile(prev => ({
      ...prev,
      location: new GeoPoint(location.lat, location.lng)
    }));
    setMapOpen(false);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (!currentUser) throw new Error('User not authenticated');
      
      const userRef = doc(db, "users", currentUser.uid);
      const updateData = { ...editedProfile };
      
      // Upload profile image if changed
      if (profileImage) {
        const storageRef = ref(storage, `profile/${currentUser.uid}/${Date.now()}_${profileImage.name}`);
        const uploadTask = await uploadBytes(storageRef, profileImage);
        const photoURL = await getDownloadURL(uploadTask.ref);
        updateData.photoURL = photoURL;
      }
      
      // Update user profile in Firestore
      await updateDoc(userRef, updateData);
      
      // Refresh user profile
      await fetchUserProfile(currentUser.uid);
      
      setSuccess('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || !userProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            {editMode ? (
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={imagePreview || userProfile.photoURL || "/assets/default-avatar.jpg"}
                  alt={userProfile.name}
                  sx={{ width: 150, height: 150, mx: 'auto' }}
                />
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-image-input"
                  type="file"
                  onChange={handleProfileImageChange}
                />
                <label htmlFor="profile-image-input">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </Box>
            ) : (
              <Avatar
                src={userProfile.photoURL || "/assets/default-avatar.jpg"}
                alt={userProfile.name}
                sx={{ width: 150, height: 150, mx: 'auto' }}
              />
            )}
            
            <Box sx={{ mt: 2 }}>
              <Chip
                label={userProfile.userType === 'farmer' ? 'Farmer' : 'Organization'}
                color="primary"
                sx={{ mt: 1 }}
              />
            </Box>
            
            <Box sx={{ mt: 3 }}>
              {editMode ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Save'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={handleEditToggle}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={handleEditToggle}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              {editMode ? (
                <TextField
                  fullWidth
                  name="name"
                  label="Name"
                  variant="outlined"
                  value={editedProfile.name}
                  onChange={handleInputChange}
                  sx={{ mb: 3 }}
                />
              ) : (
                <Typography variant="h4" component="h1" gutterBottom>
                  {userProfile.name}
                </Typography>
              )}
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ color: 'text.secondary', mr: 1 }} />
                  {editMode ? (
                    <TextField
                      fullWidth
                      name="email"
                      label="Email"
                      variant="outlined"
                      value={editedProfile.email}
                      onChange={handleInputChange}
                      disabled // Email cannot be changed
                    />
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      {userProfile.email}
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone sx={{ color: 'text.secondary', mr: 1 }} />
                  {editMode ? (
                    <TextField
                      fullWidth
                      name="phone"
                      label="Phone"
                      variant="outlined"
                      value={editedProfile.phone}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      {userProfile.phone || 'No phone number added'}
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <LocationOn sx={{ color: 'text.secondary', mr: 1, mt: editMode ? 2 : 0 }} />
                  {editMode ? (
                    <Box sx={{ width: '100%' }}>
                      {editedProfile.location ? (
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            Lat: {editedProfile.location.latitude.toFixed(6)}, 
                            Lng: {editedProfile.location.longitude.toFixed(6)}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          No location selected
                        </Typography>
                      )}
                      
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setMapOpen(true)}
                      >
                        {editedProfile.location ? 'Change Location' : 'Set Location'}
                      </Button>
                      
                      {mapOpen && (
                        <Box sx={{ mt: 2, height: 300 }}>
                          <GoogleMapComponent
                            onSelectLocation={handleLocationSelect}
                            height="300px"
                            markers={editedProfile.location ? [
                              {
                                lat: editedProfile.location.latitude,
                                lng: editedProfile.location.longitude,
                                title: 'Your Location'
                              }
                            ] : []}
                          />
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      {userProfile.location 
                        ? `Lat: ${userProfile.location.latitude.toFixed(6)}, Lng: ${userProfile.location.longitude.toFixed(6)}` 
                        : 'No location added'}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Bio
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {editMode ? (
                <TextField
                  fullWidth
                  name="bio"
                  label="Bio"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={editedProfile.bio}
                  onChange={handleInputChange}
                  placeholder="Tell others about yourself or your organization..."
                />
              ) : (
                <Typography variant="body1" paragraph>
                  {userProfile.bio || 'No bio yet. Click "Edit Profile" to add your bio.'}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
            <Tab label="My Products" id="profile-tab-0" aria-controls="profile-tabpanel-0" />
            <Tab label="Settings" id="profile-tab-1" aria-controls="profile-tabpanel-1" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          {productsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : userProducts.length > 0 ? (
            <>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Your Listed Products ({userProducts.length})
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/add-product')}
                >
                  Add New Product
                </Button>
              </Box>
              
              <Grid container spacing={3}>
                {userProducts.map(product => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={product.imageUrls?.[0] || '/assets/product-placeholder.jpg'}
                        alt={product.name}
                      />
                      
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h2">
                          {product.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body1" color="primary" fontWeight="bold">
                            ${product.price}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={product.status} 
                            color={product.status === 'available' ? 'success' : 'default'} 
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary">
                          {product.description?.substring(0, 100)}
                          {product.description?.length > 100 && '...'}
                        </Typography>
                      </CardContent>
                      
                      <CardActions>
                        <Button 
                          size="small" 
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          View
                        </Button>
                        <Button 
                          size="small" 
                          color="primary" 
                          onClick={() => navigate(`/products/${product.id}/edit`)}
                        >
                          Edit
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Person sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                You haven't listed any products yet
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Start listing your surplus farm products to connect with organizations
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/add-product')}
              >
                Add Your First Product
              </Button>
            </Box>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Account Settings
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Account Type
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {userProfile.userType === 'farmer' ? 'Farmer Account' : 'Organization Account'}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Email Notifications
              </Typography>
              <Button variant="outlined" size="small" sx={{ mb: 3 }}>
                Manage Notifications
              </Button>
              
              <Typography variant="subtitle1" gutterBottom color="error">
                Danger Zone
              </Typography>
              <Button variant="outlined" color="error" size="small">
                Delete Account
              </Button>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Password
              </Typography>
              <Button variant="outlined" size="small" sx={{ mb: 3 }}>
                Change Password
              </Button>
              
              <Typography variant="subtitle1" gutterBottom>
                Privacy Settings
              </Typography>
              <Button variant="outlined" size="small">
                Manage Privacy
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
