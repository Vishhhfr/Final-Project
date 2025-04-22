
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

interface MapboxMapProps {
  address: string;
  driverLocation?: { lat: number; lng: number } | null;
}

// Surat, Gujarat, India coordinates (default)
const SURAT_COORDINATES = { lng: 72.8311, lat: 21.1702 };

// Areas in Surat with their approximate coordinates
const SURAT_AREAS: Record<string, { lat: number; lng: number }> = {
  'citylight': { lat: 21.1545, lng: 72.7876 },
  'adajan': { lat: 21.1924, lng: 72.7963 },
  'vesu': { lat: 21.1393, lng: 72.7780 },
  'katargam': { lat: 21.2266, lng: 72.8312 },
  'varachha': { lat: 21.2177, lng: 72.8704 },
  'athwa': { lat: 21.1813, lng: 72.8098 },
  'althan': { lat: 21.1229, lng: 72.7413 },
  'olpad': { lat: 21.3353, lng: 72.7536 },
  'pandesara': { lat: 21.1294, lng: 72.8398 },
  'udhna': { lat: 21.1701, lng: 72.8465 }
};

// Temporary Mapbox access token input component
const MapboxTokenInput = ({ onTokenSubmit }: { onTokenSubmit: (token: string) => void }) => {
  const [token, setToken] = useState('');
  
  return (
    <div className="p-4 bg-slate-100 rounded-md flex flex-col gap-2">
      <p className="text-sm text-slate-700">Enter your Mapbox public token to enable the map:</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
          placeholder="pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4..."
        />
        <button 
          onClick={() => onTokenSubmit(token)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm"
        >
          Apply
        </button>
      </div>
      <p className="text-xs text-slate-500">
        Get your token from <a href="https://www.mapbox.com/account/access-tokens" target="_blank" rel="noreferrer" className="text-blue-600 underline">mapbox.com</a>
      </p>
    </div>
  );
};

const MapboxMap = ({ address, driverLocation }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(localStorage.getItem('mapbox_token'));
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // Function to get coordinates from address
  const getCoordinatesFromAddress = (address: string): { lng: number; lat: number } => {
    // Check for area names in the address
    for (const [areaName, coordinates] of Object.entries(SURAT_AREAS)) {
      if (address.toLowerCase().includes(areaName.toLowerCase())) {
        return coordinates;
      }
    }
    
    // Default to Surat coordinates if no specific area is found
    return SURAT_COORDINATES;
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || mapInitialized) return;
    
    try {
      mapboxgl.accessToken = mapboxToken;
      
      const coordinates = getCoordinatesFromAddress(address);
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [coordinates.lng, coordinates.lat],
        zoom: 13,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add destination marker
      const markerElement = document.createElement('div');
      markerElement.className = 'destination-marker';
      markerElement.innerHTML = `<div class="flex items-center justify-center">
        <div class="absolute w-4 h-4 bg-orange-500 rounded-full opacity-75 animate-ping"></div>
        <div class="absolute w-3 h-3 bg-orange-600 rounded-full"></div>
      </div>`;
      
      new mapboxgl.Marker(markerElement)
        .setLngLat([coordinates.lng, coordinates.lat])
        .addTo(map.current);
      
      // Add popup with address
      new mapboxgl.Popup({ closeButton: false, offset: 25 })
        .setLngLat([coordinates.lng, coordinates.lat])
        .setHTML(`<p class="text-xs font-medium">${address}</p>`)
        .addTo(map.current);

      setMapInitialized(true);
    } catch (error) {
      console.error("Error initializing Mapbox:", error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [address, mapboxToken, mapInitialized]);

  // Update driver marker position if available
  useEffect(() => {
    if (!map.current || !driverLocation || !mapInitialized) return;
    
    const driverId = 'driver-marker';
    
    // Remove existing marker if it exists
    const existingMarker = document.getElementById(driverId);
    if (existingMarker) {
      existingMarker.remove();
    }
    
    // Create driver marker element
    const driverMarkerEl = document.createElement('div');
    driverMarkerEl.id = driverId;
    driverMarkerEl.className = 'driver-marker';
    driverMarkerEl.innerHTML = `<div class="flex items-center justify-center">
      <div class="absolute w-4 h-4 bg-blue-500 rounded-full opacity-75 animate-pulse"></div>
      <div class="absolute w-3 h-3 bg-blue-600 rounded-full"></div>
    </div>`;
    
    // Add driver marker to map
    new mapboxgl.Marker(driverMarkerEl)
      .setLngLat([driverLocation.lng, driverLocation.lat])
      .addTo(map.current);
      
  }, [driverLocation, mapInitialized]);
  
  // Save token to localStorage
  const handleTokenSubmit = (token: string) => {
    localStorage.setItem('mapbox_token', token);
    setMapboxToken(token);
    setMapInitialized(false); // Reset to re-initialize map
  };

  // Try to get user's current location
  const handleGetCurrentLocation = () => {
    if (!map.current) return;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 15,
              essential: true
            });
            
            // Add user location marker
            const userLocMarker = document.createElement('div');
            userLocMarker.className = 'user-location-marker';
            userLocMarker.innerHTML = `<div class="flex items-center justify-center">
              <div class="absolute w-4 h-4 bg-green-500 rounded-full opacity-75 animate-ping"></div>
              <div class="absolute w-3 h-3 bg-green-600 rounded-full"></div>
            </div>`;
            
            new mapboxgl.Marker(userLocMarker)
              .setLngLat([longitude, latitude])
              .addTo(map.current);
              
            new mapboxgl.Popup({ closeButton: false, offset: 25 })
              .setLngLat([longitude, latitude])
              .setHTML(`<p class="text-xs font-medium">Your current location</p>`)
              .addTo(map.current);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  };

  if (!mapboxToken) {
    return <MapboxTokenInput onTokenSubmit={handleTokenSubmit} />;
  }

  return (
    <div className="relative w-full h-full rounded-md overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      <button 
        onClick={handleGetCurrentLocation} 
        className="absolute bottom-2 left-2 bg-white p-2 rounded-full shadow-md z-10"
        title="Use current location"
      >
        <MapPin size={18} className="text-blue-600" />
      </button>
    </div>
  );
};

export default MapboxMap;
