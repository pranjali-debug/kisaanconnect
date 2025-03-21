import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  LocationOn,
  FilterAltOff,
  Clear,
} from '@mui/icons-material';
import GoogleMapComponent from '../components/maps/GoogleMapComponent';
import { useProducts } from '../contexts/ProductsContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const MapPage = () => {
  const navigate = useNavigate();
  const { products, loading: productsLoading } = useProducts();
  const [mapMarkers, setMapMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDistance, setFilterDistance] = useState('');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Get current location for distance calculation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        console.log('Error: The Geolocation service failed.');
      }
    );
  }, []);

  // Fetch all users with locations
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const usersQuery = query(collection(db, 'users'));
        const userSnapshot = await getDocs(usersQuery);
        
        const usersWithLocation = userSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(user => user.location)
          .map(user => ({
            id: user.id,
            lat: user.location.latitude,
            lng: user.location.longitude,
            title: user.name,
            description: user.userType === 'farmer' ? 'Farmer' : 'Organization',
            type: user.userType,
            buttonText: 'View Profile',
            buttonAction: () => navigate(`/profile/${user.id}`),
          }));

        setMapMarkers(usersWithLocation);
        setFilteredMarkers(usersWithLocation);
      } catch (error) {
        console.error('Error fetching users with locations:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Convert products to markers
  useEffect(() => {
    if (products.length > 0) {
      const productMarkers = products
        .filter(product => product.location && product.status === 'available')
        .map(product => ({
          id: product.id,
          lat: product.location.latitude,
          lng: product.location.longitude,
          title: product.name,
          description: `$${product.price}/${product.unit} by ${product.sellerName}`,
          type: 'product',
          buttonText: 'View Product',
          buttonAction: () => navigate(`/products/${product.id}`),
        }));

      setMapMarkers(prevMarkers => {
        const userMarkers = prevMarkers.filter(marker => marker.type !== 'product');
        return [...userMarkers, ...productMarkers];
      });
      
      // Apply current filters to updated markers
      applyFilters([...mapMarkers.filter(marker => marker.type !== 'product'), ...productMarkers]);
    }
  }, [products, navigate]);

  // Calculate distance between two coordinates (using Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const applyFilters = (markers = mapMarkers) => {
    let filtered = [...markers];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        marker =>
          marker.title?.toLowerCase().includes(term) ||
          marker.description?.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(marker => marker.type === filterType);
    }

    // Apply distance filter if current location is available
    if (filterDistance && currentLocation) {
      const maxDistance = parseInt(filterDistance);
      filtered = filtered.filter(marker => {
        const distance = calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          marker.lat,
          marker.lng
        );
        return distance <= maxDistance;
      });
    }

    setFilteredMarkers(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleFilterDistanceChange = (e) => {
    setFilterDistance(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterDistance('');
    setFilteredMarkers(mapMarkers);
  };

  const handleApplyFilters = () => {
    applyFilters();
  };

  const handleSelectMarker = (marker) => {
    setSelectedMarker(marker);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Farm Products Map
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Find farmers, organizations, and available products on the map.
      </Typography>

      <Grid container spacing={3}>
        {/* Map Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ height: 600, overflow: 'hidden', borderRadius: 2 }}>
            {productsLoading || loadingUsers ? (
              <Box sx={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <GoogleMapComponent
                markers={filteredMarkers}
                height="600px"
                showCurrentLocation={true}
                initialCenter={currentLocation}
              />
            )}
          </Paper>
        </Grid>

        {/* Filter and Results Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filter Map
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TextField
              fullWidth
              margin="normal"
              id="search"
              label="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="filter-type-label">Show</InputLabel>
              <Select
                labelId="filter-type-label"
                id="filter-type"
                value={filterType}
                onChange={handleFilterTypeChange}
                label="Show"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="farmer">Farmers</MenuItem>
                <MenuItem value="ngo">Organizations</MenuItem>
                <MenuItem value="product">Products</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="filter-distance-label">Distance (km)</InputLabel>
              <Select
                labelId="filter-distance-label"
                id="filter-distance"
                value={filterDistance}
                onChange={handleFilterDistanceChange}
                label="Distance (km)"
                disabled={!currentLocation}
              >
                <MenuItem value="">Any distance</MenuItem>
                <MenuItem value="5">Within 5 km</MenuItem>
                <MenuItem value="10">Within 10 km</MenuItem>
                <MenuItem value="25">Within 25 km</MenuItem>
                <MenuItem value="50">Within 50 km</MenuItem>
                <MenuItem value="100">Within 100 km</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<FilterAltOff />}
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
              <Button variant="contained" startIcon={<FilterListIcon />} onClick={handleApplyFilters}>
                Apply Filters
              </Button>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Results ({filteredMarkers.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {filteredMarkers.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                No results found with current filters.
              </Typography>
            ) : (
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {filteredMarkers.slice(0, 10).map((marker, index) => (
                  <React.Fragment key={marker.id || index}>
                    <ListItem
                      button
                      onClick={() => handleSelectMarker(marker)}
                      selected={selectedMarker?.id === marker.id}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor:
                              marker.type === 'farmer'
                                ? 'primary.main'
                                : marker.type === 'ngo'
                                ? 'secondary.main'
                                : 'success.main',
                          }}
                        >
                          <LocationOn />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={marker.title}
                        secondary={
                          <>
                            {marker.description}
                            {currentLocation && (
                              <Typography variant="caption" display="block">
                                {calculateDistance(
                                  currentLocation.lat,
                                  currentLocation.lng,
                                  marker.lat,
                                  marker.lng
                                ).toFixed(1)}{' '}
                                km away
                              </Typography>
                            )}
                          </>
                        }
                      />
                      <Chip
                        size="small"
                        label={marker.type}
                        color={
                          marker.type === 'farmer'
                            ? 'primary'
                            : marker.type === 'ngo'
                            ? 'secondary'
                            : 'success'
                        }
                      />
                    </ListItem>
                    {index < filteredMarkers.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
                {filteredMarkers.length > 10 && (
                  <ListItem>
                    <ListItemText
                      primary={`+ ${filteredMarkers.length - 10} more results`}
                      primaryTypographyProps={{ align: 'center', color: 'text.secondary' }}
                    />
                  </ListItem>
                )}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MapPage;
