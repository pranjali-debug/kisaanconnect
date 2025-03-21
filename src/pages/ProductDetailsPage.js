import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  Divider,
  Card,
  CardMedia,
  Tabs,
  Tab,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Rating,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
  Alert,
  IconButton,
  ImageList,
  ImageListItem,
} from '@mui/material';
import {
  ShoppingCartOutlined,
  LocationOn,
  DateRange,
  LocalShipping,
  MessageOutlined,
  Edit,
  Delete,
  ArrowBack,
  Favorite,
  Share,
} from '@mui/icons-material';

import { useProducts } from '../contexts/ProductsContext';
import { useAuth } from '../contexts/AuthContext';
import { useMessages } from '../contexts/MessagesContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, deleteProduct } = useProducts();
  const { currentUser, userProfile } = useAuth();
  const { getOrCreateConversation } = useMessages();
  
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        const productData = await getProductById(id);
        setProduct(productData);
        
        // Fetch seller details
        if (productData.sellerId) {
          const sellerDoc = await getDoc(doc(db, "users", productData.sellerId));
          if (sellerDoc.exists()) {
            setSeller(sellerDoc.data());
          }
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [getProductById, id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= (product?.quantity || 1)) {
      setQuantity(value);
    }
  };
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(id);
      setDeleteDialogOpen(false);
      navigate('/products');
    } catch (error) {
      console.error("Error deleting product:", error);
      setError('Failed to delete product. Please try again.');
      setDeleteDialogOpen(false);
    }
  };
  
  const handleContactSeller = async () => {
    try {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      const conversation = await getOrCreateConversation(product.sellerId);
      navigate(`/messages?conversation=${conversation.id}`);
    } catch (error) {
      console.error("Error contacting seller:", error);
      setError('Failed to start conversation. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <Container>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
          <Skeleton variant="text" width={100} />
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={1}>
                {[1, 2, 3].map((item) => (
                  <Grid item xs={4} key={item}>
                    <Skeleton variant="rectangular" height={100} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rectangular" height={80} sx={{ my: 2 }} />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="60%" />
            <Box sx={{ mt: 3 }}>
              <Skeleton variant="rectangular" height={50} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ my: 4 }}>
          {error}
        </Alert>
        <Button 
          component={RouterLink} 
          to="/products" 
          startIcon={<ArrowBack />}
          variant="outlined"
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <Alert severity="info" sx={{ my: 4 }}>
          Product not found
        </Alert>
        <Button 
          component={RouterLink} 
          to="/products" 
          startIcon={<ArrowBack />}
          variant="outlined"
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  const isOwner = currentUser?.uid === product.sellerId;
  const isNGO = userProfile?.userType === 'ngo';

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Button 
          component={RouterLink} 
          to="/products" 
          startIcon={<ArrowBack />}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          Back to Products
        </Button>

        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              <Card>
                <CardMedia
                  component="img"
                  image={
                    product.imageUrls && product.imageUrls.length > 0
                      ? product.imageUrls[selectedImage]
                      : '/assets/product-placeholder.jpg'
                  }
                  alt={product.name}
                  sx={{ height: 400, objectFit: 'cover' }}
                />
              </Card>
              
              <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                <IconButton
                  sx={{ bgcolor: 'rgba(255,255,255,0.7)', mr: 1 }}
                  aria-label="add to favorites"
                >
                  <Favorite />
                </IconButton>
                <IconButton
                  sx={{ bgcolor: 'rgba(255,255,255,0.7)' }}
                  aria-label="share"
                >
                  <Share />
                </IconButton>
              </Box>
            </Box>

            {/* Thumbnail images */}
            {product.imageUrls && product.imageUrls.length > 1 && (
              <ImageList 
                cols={4} 
                sx={{ mt: 2, height: 100 }} 
                rowHeight={100}
                gap={8}
              >
                {product.imageUrls.map((img, index) => (
                  <ImageListItem 
                    key={index} 
                    onClick={() => setSelectedImage(index)}
                    sx={{ 
                      cursor: 'pointer',
                      border: index === selectedImage ? '2px solid' : 'none',
                      borderColor: 'primary.main',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${index}`}
                      loading="lazy"
                      style={{ height: '100%', objectFit: 'cover' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {product.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={4} readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    (4 reviews)
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label={product.status} 
                color={product.status === 'available' ? 'success' : 'default'}
                variant="outlined"
              />
            </Box>

            <Typography variant="h5" color="primary" sx={{ mt: 2, fontWeight: 'bold' }}>
              ${product.price} / {product.unit}
            </Typography>
            
            <Paper sx={{ p: 2, mt: 3, bgcolor: 'background.paper' }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {product.description}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '150px' }}>
                  <LocationOn color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {product.location ? `${product.location.latitude.toFixed(2)}, ${product.location.longitude.toFixed(2)}` : 'Location not specified'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '150px' }}>
                  <LocalShipping color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {product.delivery ? 'Delivery Available' : 'Pick up only'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '150px' }}>
                  <DateRange color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Available until: {new Date(product.availableUntil).toLocaleDateString() || 'Not specified'}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                {product.quantity && (
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Available Quantity: {product.quantity} {product.unit}
                    </Typography>
                    
                    {isNGO && product.status === 'available' && (
                      <TextField
                        type="number"
                        label="Quantity"
                        variant="outlined"
                        size="small"
                        value={quantity}
                        onChange={handleQuantityChange}
                        InputProps={{ 
                          inputProps: { min: 1, max: product.quantity },
                        }}
                        sx={{ width: '100px', mr: 2 }}
                      />
                    )}
                  </Box>
                )}
              </Box>
            </Paper>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              {isOwner ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Edit />}
                    component={RouterLink}
                    to={`/products/${id}/edit`}
                    fullWidth
                  >
                    Edit Product
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleDeleteClick}
                    fullWidth
                  >
                    Delete
                  </Button>
                </>
              ) : isNGO && product.status === 'available' ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCartOutlined />}
                    fullWidth
                  >
                    Request Purchase
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<MessageOutlined />}
                    onClick={handleContactSeller}
                    fullWidth
                  >
                    Contact Seller
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<MessageOutlined />}
                  onClick={handleContactSeller}
                  fullWidth
                >
                  Contact Seller
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Product Tabs */}
        <Paper sx={{ mt: 6, mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Details & Specifications" />
            <Tab label="Seller Information" />
            <Tab label="Reviews" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Product Information
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Category"
                        secondary={product.category || 'Not specified'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Harvest Date"
                        secondary={product.harvestDate ? new Date(product.harvestDate).toLocaleDateString() : 'Not specified'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Farming Method"
                        secondary={product.farmingMethod || 'Not specified'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Quality Grade"
                        secondary={product.qualityGrade || 'Not specified'}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Delivery & Storage
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Minimum Order"
                        secondary={product.minimumOrder ? `${product.minimumOrder} ${product.unit}` : 'No minimum'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Best Before"
                        secondary={product.bestBefore ? new Date(product.bestBefore).toLocaleDateString() : 'Not specified'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Storage Requirements"
                        secondary={product.storageRequirements || 'Not specified'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Delivery Options"
                        secondary={product.delivery ? 'Delivery available' : 'Pick up only'}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {seller ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      src={seller.photoURL || '/assets/default-avatar.jpg'}
                      sx={{ width: 64, height: 64, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6">{seller.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {seller.userType === 'farmer' ? 'Farmer' : 'Organization'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body1" paragraph>
                    {seller.bio || 'No seller description available.'}
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<MessageOutlined />}
                    onClick={handleContactSeller}
                    sx={{ mt: 2 }}
                  >
                    Contact Seller
                  </Button>
                </Box>
              ) : (
                <Typography variant="body1">
                  Seller information not available
                </Typography>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="body1" paragraph>
                No reviews yet. Be the first to review this product.
              </Typography>
            </TabPanel>
          </Box>
        </Paper>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductDetailsPage;
