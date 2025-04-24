import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Locate, MapPin } from 'lucide-react';
import { ProduceItem } from '../types';

// Define global Google Maps types
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface GoogleMapComponentProps {
  produceItems: ProduceItem[];
  onSelectProduct: (product: ProduceItem) => void;
  selectedProduct: ProduceItem | null;
  initialLocation?: {lat: number, lng: number};
  showUserLocationOnly?: boolean;
}

// Track if Google Maps API is loading
let isApiLoading = false;

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ 
  produceItems, 
  onSelectProduct, 
  selectedProduct,
  initialLocation,
  showUserLocationOnly = false
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<{[id: string]: google.maps.Marker}>({});
  const API_KEY = "AIzaSyCFVp4DtIqG27Mp1SgWxxiMxDjSUOvxlew";
  const [userPosition, setUserPosition] = useState<{lat: number, lng: number} | null>(initialLocation || null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const mapInitializedRef = useRef<boolean>(false);
  const initialZoomAppliedRef = useRef<boolean>(false);
  const isBoundsAdjustedRef = useRef<boolean>(false);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);

  // Get user's location only once on component mount
  useEffect(() => {
    // If initial location is provided, use it instead of getting user's location
    if (initialLocation) {
      setUserPosition(initialLocation);
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
  }, [initialLocation]);

  // Function to get approximate coordinates from location name using geocoding
  const getCoordinatesFromLocation = async (locationName: string): Promise<{lat: number, lng: number} | null> => {
    if (!window.google) return null;
    
    try {
      const geocoder = new window.google.maps.Geocoder();
      const result = await new Promise<any>((resolve, reject) => {
        geocoder.geocode({ address: locationName }, (results: any, status: any) => {
          if (status === "OK" && results[0]) {
            resolve(results[0]);
          } else {
            reject(new Error(`Geocoding failed for ${locationName}: ${status}`));
          }
        });
      });
      
      return {
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng()
      };
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  // Initialize map function that will be called when API is loaded
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !userPosition || mapInitializedRef.current) return;
    
    const newMap = new window.google.maps.Map(mapRef.current, {
      center: userPosition,
      zoom: 12, // Start with a closer zoom
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
    });
    
    // Add a marker for the user's position
    const userMarker = new window.google.maps.Marker({
      position: userPosition,
      map: newMap,
      title: showUserLocationOnly ? 'Delivery Location' : 'Your Location',
      icon: {
        url: showUserLocationOnly 
          ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });
    
    // Store the user marker reference
    userMarkerRef.current = userMarker;
    
    // Add a circle to show approximate area
    new window.google.maps.Circle({
      strokeColor: showUserLocationOnly ? "#FF5252" : "#4285F4",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: showUserLocationOnly ? "#FF5252" : "#4285F4",
      fillOpacity: 0.1,
      map: newMap,
      center: userPosition,
      radius: showUserLocationOnly ? 2000 : 10000  // 2 km for delivery location, 10 km for user browsing
    });
    
    // Add info window for delivery location
    if (showUserLocationOnly) {
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <p style="font-weight: bold; margin-bottom: 4px;">Delivery Location</p>
            <p style="margin: 0;">Your order will be delivered here</p>
          </div>
        `,
      });
      
      // Open info window by default for delivery location
      infoWindow.open(newMap, userMarker);
      
      userMarker.addListener('click', () => {
        infoWindow.open(newMap, userMarker);
      });
    }
    
    // Stop any automatic zooming or panning that might happen
    newMap.addListener('idle', () => {
      if (!initialZoomAppliedRef.current) {
        initialZoomAppliedRef.current = true;
        newMap.setZoom(showUserLocationOnly ? 15 : 12); // Closer zoom for delivery location
        newMap.setCenter(userPosition); // Ensure the center is maintained
      }
    });
    
    setMap(newMap);
    mapInitializedRef.current = true;
  }, [userPosition, showUserLocationOnly]);

  // Load Google Maps API only once
  useEffect(() => {
    if (!userPosition || window.google || isApiLoading) return;
    
    // Set loading flag
    isApiLoading = true;
    
    // Define callback that will be called when API is loaded
    window.initMap = () => {
      isApiLoading = false;
      initializeMap();
    };

    // Create script with correct API key if it doesn't exist already
    if (!document.getElementById('google-maps-api')) {
      const script = document.createElement('script');
      script.id = 'google-maps-api';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        isApiLoading = false;
      };
      
      document.head.appendChild(script);
    }
    
    return () => {
      // Don't remove the window.initMap function to avoid issues with other components
    };
  }, [userPosition, initializeMap]);

  // Initialize map if API is already loaded
  useEffect(() => {
    if (window.google && userPosition && !mapInitializedRef.current) {
      initializeMap();
    }
  }, [userPosition, initializeMap]);

  // Add markers for produce items when map and items are available
  const updateMarkers = useCallback(async () => {
    if (!map || !window.google || produceItems.length === 0) return;
    
    const bounds = new window.google.maps.LatLngBounds();
    let anyMarkersAdded = false;
    
    // Keep track of existing marker IDs so we can remove stale ones
    const currentMarkerIds = new Set<string>();
    
    for (const item of produceItems) {
      // If we already have a marker for this item, just update it
      if (markersRef.current[item.id]) {
        // Update marker icon if selection changed
        markersRef.current[item.id].setIcon({
          url: selectedProduct?.id === item.id
            ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new window.google.maps.Size(30, 30)
        });
        
        currentMarkerIds.add(item.id);
        
        // Add to bounds for fitting the map
        bounds.extend(markersRef.current[item.id].getPosition()!);
        anyMarkersAdded = true;
        continue;
      }
      
      // If the item has coordinates, use them directly
      if (item.coordinates) {
        const marker = new window.google.maps.Marker({
          position: item.coordinates,
          map: map,
          title: item.name,
          animation: window.google.maps.Animation.DROP,
          icon: {
            url: selectedProduct?.id === item.id
              ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
              : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(30, 30)
          }
        });
        
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <p style="font-weight: bold; margin-bottom: 4px;">${item.name}</p>
              <p style="margin: 0;">₹${item.price}/${item.unit}</p>
              <p style="margin: 4px 0 0;">Farmer: ${item.farmer}</p>
            </div>
          `,
        });
        
        marker.addListener('click', () => {
          onSelectProduct(item);
        });
        
        marker.addListener('mouseover', () => {
          infoWindow.open(map, marker);
        });
        
        marker.addListener('mouseout', () => {
          infoWindow.close();
        });
        
        markersRef.current[item.id] = marker;
        currentMarkerIds.add(item.id);
        bounds.extend(item.coordinates);
        anyMarkersAdded = true;
      } 
      // Otherwise try to geocode the location name
      else {
        try {
          const coords = await getCoordinatesFromLocation(item.location);
          if (coords) {
            const marker = new window.google.maps.Marker({
              position: coords,
              map: map,
              title: item.name,
              animation: window.google.maps.Animation.DROP,
              icon: {
                url: selectedProduct?.id === item.id
                  ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                  : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new window.google.maps.Size(30, 30)
              }
            });
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px; max-width: 200px;">
                  <p style="font-weight: bold; margin-bottom: 4px;">${item.name}</p>
                  <p style="margin: 0;">₹${item.price}/${item.unit}</p>
                  <p style="margin: 4px 0 0;">Farmer: ${item.farmer}</p>
                </div>
              `,
            });
            
            marker.addListener('click', () => {
              onSelectProduct(item);
            });
            
            marker.addListener('mouseover', () => {
              infoWindow.open(map, marker);
            });
            
            marker.addListener('mouseout', () => {
              infoWindow.close();
            });
            
            markersRef.current[item.id] = marker;
            currentMarkerIds.add(item.id);
            bounds.extend(coords);
            anyMarkersAdded = true;
          }
        } catch (error) {
          console.error(`Error adding marker for ${item.name}:`, error);
        }
      }
    }
    
    // Remove stale markers that aren't in the current list
    Object.keys(markersRef.current).forEach(id => {
      if (!currentMarkerIds.has(id)) {
        markersRef.current[id].setMap(null);
        delete markersRef.current[id];
      }
    });
    
    // Adjust map bounds to include all markers if any were added
    // Only do this once when we have multiple markers, and not if we're looking at a selected product
    if (!isBoundsAdjustedRef.current && anyMarkersAdded && Object.keys(markersRef.current).length > 1 && !selectedProduct) {
      // Also include user position in bounds
      if (userPosition) {
        bounds.extend(userPosition);
      }

      // Don't adjust bounds if there's just the user marker
      if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
        return;
      }

      // Set a timeout to ensure this happens after any other zoom operations
      setTimeout(() => {
        // Only fit bounds if we have actual products to display
        map.fitBounds(bounds);
        
        // Don't zoom in too far or too close
        const zoom = map.getZoom();
        if (zoom && zoom > 13) {
          map.setZoom(13);
        }
        
        isBoundsAdjustedRef.current = true;
      }, 100);
    }
  }, [map, produceItems, onSelectProduct, selectedProduct, userPosition]);

  // Reset bounds adjustment flag when product selection changes
  useEffect(() => {
    if (selectedProduct) {
      isBoundsAdjustedRef.current = true; // Don't auto-fit bounds when viewing a selected product
    } else {
      isBoundsAdjustedRef.current = false; // Allow bounds to be fit again when deselecting
    }
  }, [selectedProduct]);

  // Update markers when relevant data changes
  useEffect(() => {
    if (map) {
      // Don't add produce markers if we're only showing user location
      if (showUserLocationOnly) return;
      
      // Use a short timeout to ensure the map is fully rendered first
      const timerId = setTimeout(() => {
        updateMarkers();
      }, 100);
      
      return () => clearTimeout(timerId);
    }
  }, [map, produceItems, selectedProduct, updateMarkers, showUserLocationOnly]);

  // Only center on selected product if user explicitly selects one
  useEffect(() => {
    if (!map || !selectedProduct || !markersRef.current[selectedProduct.id]) return;
    
    // If this is the selected product, center the map on it
    map.panTo(markersRef.current[selectedProduct.id].getPosition()!);
    map.setZoom(14);
  }, [map, selectedProduct]);

  // Function to reload user's current location
  const handleLocateMe = () => {
    if (!window.google || !map || !navigator.geolocation) return;
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        // Update map center
        map.panTo(userCoords);
        map.setZoom(13);
        
        // Update the stored user position
        setUserPosition(userCoords);
        
        // Reset zoom parameters so the user's manually requested location takes precedence
        initialZoomAppliedRef.current = true;
        isBoundsAdjustedRef.current = true;
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
      <div className="flex items-center justify-center w-full h-full bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-kisaan-green mb-2"></div>
          <p className="text-kisaan-brown">{showUserLocationOnly ? 'Loading delivery location...' : 'Finding your location...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden" />
      
      {showUserLocationOnly ? (
        <div className="absolute top-4 left-4 bg-white shadow-md rounded-lg p-2 z-10">
          <div className="flex items-center text-sm text-kisaan-darkbrown">
            <MapPin className="h-4 w-4 mr-1 text-red-500" />
            <span>Delivery Location</span>
          </div>
        </div>
      ) : (
        <button 
          onClick={handleLocateMe}
          className="absolute bottom-4 right-4 bg-white shadow-md rounded-full p-3 z-10 hover:bg-gray-100 transition-colors"
          title="Find produce near me"
        >
          <Locate className="h-6 w-6 text-kisaan-green" />
        </button>
      )}
    </div>
  );
};

export default GoogleMapComponent;