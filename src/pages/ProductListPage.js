import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Divider,
  Chip,
  Rating,
  Pagination,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  InputAdornment,
  CircularProgress,
  Paper
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterListIcon, 
  LocationOn,
  Sort as SortIcon
} from '@mui/icons-material';
import { useProducts } from '../contexts/ProductsContext';
import { useAuth } from '../contexts/AuthContext';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'priceAsc', label: 'Price: Low to High' },
  { value: 'priceDesc', label: 'Price: High to Low' },
];

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'grains', label: 'Grains & Cereals' },
  { value: 'dairy', label: 'Dairy & Eggs' },
  { value: 'meat', label: 'Meat & Poultry' },
  { value: 'seafood', label: 'Seafood' },
  { value: 'herbs', label: 'Herbs & Spices' },
  { value: 'honey', label: 'Honey & Preserves' },
  { value: 'other', label: 'Other Products' },
];

const ITEMS_PER_PAGE = 9;

const ProductListPage = () => {
  const { products, loading, searchProducts } = useProducts();
  const { userProfile } = useAuth();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const filterAndSortProducts = async () => {
      setIsSearching(true);
      
      try {
        // Apply search and category filters
        let results = await searchProducts(searchTerm, category === 'all' ? null : category, priceRange[1]);
        
        // Apply price range filter
        results = results.filter(product => 
          product.price >= priceRange[0] && product.price <= priceRange[1]
        );
        
        // Apply availability filter
        if (showOnlyAvailable) {
          results = results.filter(product => product.status === 'available');
        }
        
        // Apply sorting
        results.sort((a, b) => {
          switch (sortBy) {
            case 'newest':
              return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
              return new Date(a.createdAt) - new Date(b.createdAt);
            case 'priceAsc':
              return a.price - b.price;
            case 'priceDesc':
              return b.price - a.price;
            default:
              return 0;
          }
        });
        
        setFilteredProducts(results);
      } catch (error) {
        console.error("Error filtering products:", error);
      } finally {
        setIsSearching(false);
      }
    };
    
    filterAndSortProducts();
  }, [searchProducts, searchTerm, category, sortBy, priceRange, showOnlyAvailable]);

  // Calculate maximum price from all products for slider
  const maxPrice = Math.max(...products.map(product => product.price || 0), 100);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Farm Products Marketplace
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse available surplus farm products or find specific items using filters.
        </Typography>
      </Box>
      
      {/* Search and filter section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Products"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                onChange={handleCategoryChange}
                label="Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon />
                  </InputAdornment>
                }
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <Box sx={{ width: { xs: '100%', sm: '45%' }, mt: { xs: 2, sm: 0 } }}>
                <Typography id="price-range-slider" gutterBottom>
                  Price Range (${priceRange[0]} - ${priceRange[1]})
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={maxPrice}
                  step={5}
                  aria-labelledby="price-range-slider"
                />
              </Box>
              
              <FormGroup sx={{ ml: { sm: 2 } }}>
                <FormControlLabel 
                  control={
                    <Checkbox 
                      checked={showOnlyAvailable} 
                      onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                      color="primary"
                    />
                  } 
                  label="Show only available products" 
                />
              </FormGroup>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Products grid */}
      <Box sx={{ position: 'relative', minHeight: '200px' }}>
        {(loading || isSearching) ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress />
          </Box>
        ) : paginatedProducts.length > 0 ? (
          <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </Typography>
              
              <Button
                component={RouterLink}
                to="/map"
                variant="outlined"
                startIcon={<LocationOn />}
              >
                View on Map
              </Button>
            </Box>
            
            <Grid container spacing={4}>
              {paginatedProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      className="product-card-image"
                      image={product.imageUrls?.[0] || '/assets/product-placeholder.jpg'}
                      alt={product.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography gutterBottom variant="h6" component="h2" sx={{ mb: 0 }}>
                          {product.name}
                        </Typography>
                        <Chip 
                          label={product.status} 
                          color={product.status === 'available' ? 'success' : 'default'} 
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                        ${product.price}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {product.description?.substring(0, 100)}
                        {product.description?.length > 100 ? '...' : ''}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Rating value={4} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                          {product.quantity} {product.unit}
                        </Typography>
                      </Box>
                    </CardContent>
                    
                    <Divider />
                    
                    <CardActions>
                      <Button 
                        component={RouterLink} 
                        to={`/products/${product.id}`} 
                        size="small" 
                        color="primary"
                      >
                        View Details
                      </Button>
                      {userProfile?.userType === 'ngo' && product.status === 'available' && (
                        <Button 
                          component={RouterLink} 
                          to={`/products/${product.id}`} 
                          size="small" 
                          color="secondary" 
                          sx={{ ml: 'auto' }}
                        >
                          Contact Seller
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                <Pagination 
                  count={totalPages} 
                  page={currentPage} 
                  onChange={handlePageChange} 
                  color="primary" 
                  size="large"
                />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ py: 5, textAlign: 'center' }}>
            <Typography variant="h6" paragraph>
              No products found matching your criteria.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search or filters to find what you're looking for.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ProductListPage;
