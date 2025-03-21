import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Typography, CircularProgress, Paper, Button } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

const GoogleMapComponent = ({ 
  markers = [], 
  onSelectLocation = null,
  height = '500px',
  initialCenter = null,
  showCurrentLocation = true
}) => {
  const [selected, setSelected] = useState(null);
  const [center, setCenter] = useState(initialCenter || defaultCenter);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // Get current location
  useEffect(() => {
    if (showCurrentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          setCurrentPosition(currentPosition);
          
          // If no initial center was provided, use current location
          if (!initialCenter) {
            setCenter(currentPosition);
          }
        },
        () => {
          console.log('Error: The Geolocation service failed.');
        }
      );
    }
  }, [initialCenter, showCurrentLocation]);

  const onLoad = useCallback((map) => {
    setMapInstance(map);
  }, []);

  const onUnmount = useCallback((map) => {
    setMapInstance(null);
  }, []);

  const handleMapClick = useCallback((event) => {
    if (onSelectLocation) {
      const clickedLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      onSelectLocation(clickedLocation);
    }
  }, [onSelectLocation]);

  if (loadError) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', height }}>
        <Typography color="error">
          Error loading maps. Please check your internet connection or try again later.
        </Typography>
      </Paper>
    );
  }

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height, position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={handleMapClick}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {/* Show pins for all markers */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => setSelected(marker)}
            icon={{
              url: marker.type === 'farmer' ? '/assets/farmer-pin.png' : '/assets/ngo-pin.png',
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        ))}

        {/* Show current location marker */}
        {currentPosition && (
          <Marker
            position={currentPosition}
            icon={{
              url: '/assets/current-location.png',
              scaledSize: new window.google.maps.Size(25, 25),
            }}
          />
        )}

        {/* Show InfoWindow for selected marker */}
        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
          >
            <Box sx={{ p: 1, maxWidth: 200 }}>
              <Typography variant="subtitle1" gutterBottom>
                {selected.title || 'Selected Location'}
              </Typography>
              {selected.description && (
                <Typography variant="body2">{selected.description}</Typography>
              )}
              {selected.buttonText && selected.buttonAction && (
                <Button 
                  size="small" 
                  variant="outlined" 
                  sx={{ mt: 1 }} 
                  onClick={selected.buttonAction}
                >
                  {selected.buttonText}
                </Button>
              )}
            </Box>
          </InfoWindow>
        )}
      </GoogleMap>

      {showCurrentLocation && mapInstance && (
        <Button
          variant="contained"
          size="small"
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            zIndex: 1,
            bgcolor: 'background.paper',
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'grey.200',
            },
          }}
          onClick={() => {
            if (currentPosition) {
              mapInstance.panTo(currentPosition);
              mapInstance.setZoom(15);
            }
          }}
        >
          Center My Location
        </Button>
      )}
    </Box>
  );
};

export default GoogleMapComponent;
