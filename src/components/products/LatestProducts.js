import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Typography, 
  Button,
  Box,
  Chip,
  Skeleton,
  Rating
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { useProducts } from '../../contexts/ProductsContext';

const LatestProducts = () => {
  const { products, loading } = useProducts();
  
  // Display only the 6 most recent available products
  const latestProducts = products
    .filter(product => product.status === 'available')
    .slice(0, 6);

  if (loading) {
    return (
      <Grid container spacing={4}>
        {[...Array(3)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </CardContent>
              <CardActions>
                <Skeleton variant="rectangular" width={120} height={36} />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (latestProducts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          No products available at the moment.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Check back later or sign up to list your products!
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={4}>
      {latestProducts.map(product => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              className="product-card-image"
              image={product.imageUrls?.[0] || '/assets/product-placeholder.jpg'}
              alt={product.name}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography gutterBottom variant="h6" component="h3">
                  {product.name}
                </Typography>
                <Chip 
                  label={`$${product.price}`} 
                  color="primary" 
                  size="small" 
                />
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1 }}>
                {product.description?.substring(0, 100)}
                {product.description?.length > 100 ? '...' : ''}
              </Typography>
              
              {product.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {product.location.latitude?.toFixed(2)}, {product.location.longitude?.toFixed(2)}
                  </Typography>
                </Box>
              )}
              
              <Rating value={4} readOnly size="small" />
            </CardContent>
            <CardActions>
              <Button 
                component={RouterLink} 
                to={`/products/${product.id}`} 
                size="small" 
                color="primary"
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default LatestProducts;
