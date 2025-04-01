
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, CheckCircle2, Phone, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const EmergencySOS = () => {
  const [activated, setActivated] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [emergency, setEmergency] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: 'Location Error',
            description: 'Unable to retrieve your current location. Please enable location services.',
            variant: 'destructive',
          });
        }
      );
    } else {
      toast({
        title: 'Location Not Supported',
        description: 'Geolocation is not supported by your browser.',
        variant: 'destructive',
      });
    }
  }, []);
  
  // Handle countdown
  useEffect(() => {
    let timer: number;
    
    if (activated && countdown > 0) {
      timer = window.setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (activated && countdown === 0) {
      // Trigger emergency
      setEmergency(true);
      setActivated(false); // Reset activation
      
      // Simulate emergency services notification
      toast({
        title: 'Emergency Services Notified',
        description: 'Your location has been shared with emergency services. Stay put if possible.',
      });
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [activated, countdown]);
  
  const handleActivate = () => {
    setActivated(true);
    setCountdown(5);
    
    toast({
      title: 'SOS Activated',
      description: 'Emergency will be reported in 5 seconds. Tap Cancel to abort.',
      variant: 'destructive',
    });
  };
  
  const handleCancel = () => {
    setActivated(false);
    setCountdown(5);
    
    toast({
      title: 'SOS Cancelled',
      description: 'Emergency notification has been cancelled.',
    });
  };
  
  const handleReset = () => {
    setEmergency(false);
    setActivated(false);
    setCountdown(5);
  };
  
  const handleCall = () => {
    // In a real app, this would initiate a phone call
    window.location.href = 'tel:911';
  };
  
  return (
    <div className="max-w-md mx-auto">
      <Card className={emergency ? 'border-priority-critical' : ''}>
        <CardHeader className={emergency ? 'bg-priority-critical/10' : ''}>
          <CardTitle className="text-center text-2xl">Emergency SOS</CardTitle>
          <CardDescription className="text-center">
            Use this feature only in case of a genuine emergency
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {emergency ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-center mb-2">
                  Emergency Services Notified
                </h2>
                <p className="text-gray-600 text-center">
                  Your location has been shared with emergency services.
                </p>
              </div>
              
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Next Steps
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc space-y-1 pl-5">
                        <li>Stay in place if it's safe to do so</li>
                        <li>Keep your phone accessible</li>
                        <li>Emergency services are on their way</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleCall}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Emergency Services
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleReset}
                >
                  Reset Emergency
                </Button>
              </div>
            </div>
          ) : activated ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-center mb-2">
                  Emergency SOS Activated
                </h2>
                <p className="text-gray-600 text-center">
                  Notifying emergency services in:
                </p>
                <div className="text-5xl font-bold text-red-600 mt-2">
                  {countdown}
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-500 h-full animate-countdown" 
                    style={{ 
                      transformOrigin: 'left',
                      animation: `countdown ${countdown}s linear forwards` 
                    }}
                  />
                </div>
              </div>
              
              <Button 
                variant="destructive" 
                size="lg" 
                className="w-full"
                onClick={handleCancel}
              >
                <X className="mr-2 h-5 w-5" />
                Cancel
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      How SOS Works
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc space-y-1 pl-5">
                        <li>Press the SOS button to activate emergency mode</li>
                        <li>A 5-second countdown will start</li>
                        <li>Your location will be shared with emergency services</li>
                        <li>You'll be connected with a responder</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  size="lg"
                  className="w-40 h-40 rounded-full bg-priority-critical hover:bg-priority-critical/90 text-white text-2xl font-bold"
                  onClick={handleActivate}
                  disabled={!location}
                >
                  SOS
                </Button>
              </div>
              
              {!location && (
                <div className="rounded-md bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Location Required
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Please enable location services to use the Emergency SOS feature.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 text-center">
                Press the SOS button only in case of a genuine emergency.
                False alarms may be subject to penalties.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="justify-center pt-0">
          <p className="text-xs text-gray-500">
            Your current coordinates: {location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 'Unavailable'}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmergencySOS;
