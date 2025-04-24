import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Locate, MapPin } from 'lucide-react';

// Define global Google Maps types
declare global {
  interface Window {
    google: any;
    initLocationPicker: () => void;
  }
}

interface LocationPickerMapProps {
  onLocationSelect: (location: { address: string; coordinates: { lat: number; lng: number } }) => void;
  initialAddress?: string;
  initialCoordinates?: { lat: number; lng: number };
}

// Track if API is already loading
let isApiLoading = false;

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({ 
  onLocationSelect, 
  initialAddress = '',
  initialCoordinates
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [userPosition, setUserPosition] = useState<{lat: number, lng: number} | null>(
    initialCoordinates || null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [address, setAddress] = useState<string>(initialAddress);
  const mapInitializedRef = useRef<boolean>(false);
  
  const API_KEY = "AIzaSyCFVp4DtIqG27Mp1SgWxxiMxDjSUOvxlew";

  // Get user's location on component mount if no initial coordinates
  useEffect(() => {
    if (initialCoordinates) {
      setUserPosition(initialCoordinates);
      setIsLoading(false);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserPosition(userCoords);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to center of India if user location cannot be determined
          setUserPosition({ lat: 20.5937, lng: 78.9629 });
          setIsLoading(false);
        }
      );
    } else {
      // Fallback to center of India if geolocation is not supported
      setUserPosition({ lat: 20.5937, lng: 78.9629 });
      setIsLoading(false);
    }
  }, [initialCoordinates]);
  
  // Initialize map function that will be called when API is loaded
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !userPosition || mapInitializedRef.current) return;
    
    const newMap = new window.google.maps.Map(mapRef.current, {
      center: userPosition,
      zoom: 12,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
    });
    
    // Add a marker for the selected position
    const newMarker = new window.google.maps.Marker({
      position: userPosition,
      map: newMap,
      draggable: true,
      title: 'Product Location',
      animation: window.google.maps.Animation.DROP
    });

    // Create geocoder for reverse geocoding
    const geocoder = new window.google.maps.Geocoder();

    // Get address from coordinates when marker is first placed
    geocoder.geocode({ location: userPosition }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address);
        onLocationSelect({ 
          address: results[0].formatted_address, 
          coordinates: userPosition 
        });
      }
    });
    
    // Handle marker drag events to update coordinates and address
    newMarker.addListener('dragend', () => {
      const position = newMarker.getPosition();
      const newCoords = {
        lat: position.lat(),
        lng: position.lng()
      };
      
      // Get address from coordinates
      geocoder.geocode({ location: newCoords }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          setAddress(results[0].formatted_address);
          onLocationSelect({ 
            address: results[0].formatted_address, 
            coordinates: newCoords 
          });
        }
      });
    });

    // Allow clicking on map to move marker
    newMap.addListener('click', (e: any) => {
      const clickedPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      
      // Move the marker
      newMarker.setPosition(clickedPosition);
      
      // Get address from coordinates
      geocoder.geocode({ location: clickedPosition }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          setAddress(results[0].formatted_address);
          onLocationSelect({
            address: results[0].formatted_address, 
            coordinates: clickedPosition 
          });
        }
      });
    });
    
    setMap(newMap);
    setMarker(newMarker);
    mapInitializedRef.current = true;
  }, [userPosition, onLocationSelect]);

  // Load Google Maps API only once
  useEffect(() => {
    if (!userPosition || window.google || isApiLoading) return;

    // Set loading flag
    isApiLoading = true;
    
    // Define callback that will be called when API is loaded
    window.initLocationPicker = () => {
      isApiLoading = false;
      initializeMap();
    };

    // Check if the Google Maps script is already loaded
    if (document.getElementById('google-maps-api')) {
      // If script exists but Google isn't defined yet, wait for it
      if (!window.google) {
        const checkGoogleExists = setInterval(() => {
          if (window.google) {
            clearInterval(checkGoogleExists);
            initializeMap();
          }
        }, 100);
        
        // Clear interval after 10 seconds to prevent infinite checking
        setTimeout(() => clearInterval(checkGoogleExists), 10000);
      } else {
        // Google is already available
        initializeMap();
      }
    } else {
      // Create script with correct API key
      const script = document.createElement('script');
      script.id = 'google-maps-api';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initLocationPicker`;
      script.async = true;
      script.defer = true;
      
      // Handle error in loading script
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        isApiLoading = false;
      };
      
      document.head.appendChild(script);
    }

    return () => {
      // Clean up but don't reset window.initLocationPicker
    };
  }, [userPosition, initializeMap]);

  // Initialize map if API is already loaded
  useEffect(() => {
    if (window.google && userPosition && !mapInitializedRef.current) {
      initializeMap();
    }
  }, [userPosition, initializeMap]);

  // Function to reload user's current location
  const handleLocateMe = () => {
    if (!window.google || !map || !navigator.geolocation || !marker) return;
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        // Update map center
        map.panTo(userCoords);
        map.setZoom(13);
        
        // Update marker position
        marker.setPosition(userCoords);
        
        // Get address from coordinates
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: userCoords }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            setAddress(results[0].formatted_address);
            onLocationSelect({
              address: results[0].formatted_address, 
              coordinates: userCoords 
            });
          }
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please make sure location services are enabled.");
      }
    );
  };

  // Return loading state if map hasn't initialized
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg" style={{height: '300px'}}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-kisaan-green mb-2"></div>
          <p className="text-kisaan-brown">Finding your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="relative w-full h-[300px] rounded-lg overflow-hidden border border-gray-300">
        <div ref={mapRef} className="w-full h-full" />
        
        <button 
          onClick={handleLocateMe}
          type="button"
          className="absolute bottom-4 right-4 bg-white shadow-md rounded-full p-2.5 z-10 hover:bg-gray-100 transition-colors"
          title="Use my current location"
        >
          <Locate className="h-5 w-5 text-kisaan-green" />
        </button>
      </div>
      
      <div className="flex items-start gap-2">
        <MapPin className="h-5 w-5 text-kisaan-green mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-700 max-w-full">
          {address || 'Drag the marker or click on the map to set your location'}
        </p>
      </div>
    </div>
  );
};

export default LocationPickerMap;