
import { useState, useEffect, useRef } from 'react';
import { Map, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Location } from '@/types/accident';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface LocationPickerProps {
  onChange: (location: Location) => void;
  initialLocation?: Location;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onChange, initialLocation }) => {
  const [location, setLocation] = useState<Location>(
    initialLocation || { lat: 37.7749, lng: -122.4194 }
  );
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // In a real app, this would use a mapping API to render an actual map
  useEffect(() => {
    // This would initialize the map when isMapOpen becomes true
    if (isMapOpen && mapRef.current) {
      // Map initialization would go here
      console.log('Map would initialize here with coordinates:', location);
    }
  }, [isMapOpen, location]);

  const handleGetCurrentLocation = () => {
    setIsGettingCurrentLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          onChange(newLocation);
          
          // In a real app, you would reverse geocode here to get the address
          setAddress('Current location detected');
          setIsGettingCurrentLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingCurrentLocation(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setIsGettingCurrentLocation(false);
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // In a real app, this would get coordinates from the map click
    // For now, we'll just generate pseudo-random coordinates near the current location
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Convert to lat/lng (this is just a simple representation)
      const newLat = location.lat + (y - rect.height / 2) / 1000;
      const newLng = location.lng + (x - rect.width / 2) / 1000;
      
      const newLocation = { lat: newLat, lng: newLng };
      setLocation(newLocation);
      onChange(newLocation);
      
      // Update address (would be reverse geocoding in a real app)
      setAddress(`Selected location: ${newLat.toFixed(6)}, ${newLng.toFixed(6)}`);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Enter address or select on map"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsMapOpen(!isMapOpen)}
          className="flex-shrink-0"
        >
          <Map className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleGetCurrentLocation}
          disabled={isGettingCurrentLocation}
          className="flex-shrink-0"
        >
          {isGettingCurrentLocation ? 'Getting...' : 'Current Location'}
        </Button>
      </div>
      
      {isMapOpen && (
        <Card className="border border-gray-200">
          <CardContent className="p-0">
            <div 
              ref={mapRef}
              className="h-[300px] w-full bg-gray-100 relative cursor-crosshair"
              onClick={handleMapClick}
            >
              {/* This would be an actual map in a real app */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <p>Map would be displayed here</p>
                  <p className="text-xs mt-1">Click anywhere to select location</p>
                </div>
              </div>
              
              {/* Center marker */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-emergency-red">
                <MapPin className="h-8 w-8" />
              </div>
            </div>
            
            <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
              Selected coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationPicker;
