
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Map, 
  ListFilter, 
  AlertTriangle, 
  Loader2, 
  Clock, 
  Navigation 
} from 'lucide-react';
import PriorityBadge from '@/components/PriorityBadge';
import { AccidentSeverity, LiveAlert } from '@/types/accident';
import { toast } from "@/components/ui/use-toast";

// Mock data for demo
const mockAlerts: LiveAlert[] = [
  {
    id: 'ACC-2024-001',
    location: { lat: 37.7749, lng: -122.4194, address: '123 Market St, San Francisco, CA' },
    severity: 'Critical',
    images: ['https://picsum.photos/id/1/200/300'],
    description: 'Major collision involving multiple vehicles. Several injured.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    reporter: { id: '1', role: 'public' },
    status: 'dispatched',
    distance: 0.8,
    eta: 3,
  },
  {
    id: 'ACC-2024-002',
    location: { lat: 37.7739, lng: -122.4312, address: '456 Hayes St, San Francisco, CA' },
    severity: 'High',
    images: ['https://picsum.photos/id/2/200/300'],
    description: 'Vehicle hit pedestrian in crosswalk. Pedestrian conscious but injured.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    reporter: { id: '2', role: 'public' },
    status: 'in_progress',
    distance: 1.2,
    eta: 8,
  },
  {
    id: 'ACC-2024-003',
    location: { lat: 37.7833, lng: -122.4167, address: '789 Broadway St, San Francisco, CA' },
    severity: 'Medium',
    images: ['https://picsum.photos/id/3/200/300'],
    description: 'Two-car collision. Minor injuries reported. Road partially blocked.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    reporter: { id: '3', role: 'public' },
    status: 'reported',
    distance: 2.5,
    eta: 12,
  },
  {
    id: 'ACC-2024-004',
    location: { lat: 37.7913, lng: -122.4089, address: '101 Lombard St, San Francisco, CA' },
    severity: 'Low',
    images: ['https://picsum.photos/id/4/200/300'],
    description: 'Vehicle hit parked car. No injuries. Minor property damage.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    reporter: { id: '4', role: 'public' },
    status: 'reported',
    distance: 3.1,
    eta: 15,
  },
];

const LiveAlerts = () => {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<LiveAlert[]>([]);
  const [view, setView] = useState<'map' | 'list'>('list');
  const [filter, setFilter] = useState<AccidentSeverity | 'All'>('All');
  
  useEffect(() => {
    // Simulate API fetch
    const fetchAlerts = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAlerts(mockAlerts);
        setFilteredAlerts(mockAlerts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        toast({
          title: 'Error loading alerts',
          description: 'Could not load live alerts. Please try again later.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };
    
    fetchAlerts();
    
    // Set up periodic refresh (every 30 seconds)
    const interval = setInterval(() => {
      fetchAlerts();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (filter === 'All') {
      setFilteredAlerts(alerts);
    } else {
      setFilteredAlerts(alerts.filter(alert => alert.severity === filter));
    }
  }, [filter, alerts]);
  
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-gray-600">Loading live alerts...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Live Accident Alerts</h1>
          <p className="text-gray-600">
            View real-time accident alerts in your area
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as 'map' | 'list')} className="w-[250px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">
                <ListFilter className="h-4 w-4 mr-2" />
                List View
              </TabsTrigger>
              <TabsTrigger value="map">
                <Map className="h-4 w-4 mr-2" />
                Map View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'All' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('All')}
        >
          All
        </Button>
        <Button
          variant={filter === 'Critical' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('Critical')}
          className="bg-priority-critical hover:bg-priority-critical/90 text-white"
        >
          Critical
        </Button>
        <Button
          variant={filter === 'High' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('High')}
          className="bg-priority-high hover:bg-priority-high/90 text-white"
        >
          High
        </Button>
        <Button
          variant={filter === 'Medium' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('Medium')}
          className="bg-priority-medium hover:bg-priority-medium/90 text-emergency-darkGray"
        >
          Medium
        </Button>
        <Button
          variant={filter === 'Low' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('Low')}
          className="bg-priority-low hover:bg-priority-low/90 text-white"
        >
          Low
        </Button>
      </div>
      
      {view === 'map' ? (
        <Card>
          <CardContent className="p-0">
            <div className="h-[500px] bg-gray-100 relative">
              {/* In a real app, this would be a map component */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Map view would be displayed here</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {filteredAlerts.length} accidents in your area
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-xl font-medium text-center">No alerts found</p>
                <p className="text-gray-500 text-center mt-2">
                  There are no active alerts matching your filter criteria.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <Card key={alert.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div 
                    className="md:w-1/4 h-40 md:h-auto bg-gray-200 relative"
                    style={{
                      backgroundImage: alert.images.length > 0 ? `url(${alert.images[0]})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {alert.images.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <p>No image</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <PriorityBadge severity={alert.severity} />
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                      <div className="flex items-center gap-2 mb-2 md:mb-0">
                        <h3 className="font-semibold">{alert.id}</h3>
                        <Badge variant="outline" className="capitalize">
                          {alert.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTimeAgo(alert.timestamp)}
                      </div>
                    </div>
                    
                    <p className="text-gray-800 mb-2">{alert.description}</p>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <div className="flex items-start gap-2">
                        <Map className="h-4 w-4 mt-0.5" />
                        <span>{alert.location.address}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center">
                        <Navigation className="h-4 w-4 mr-1 text-primary" />
                        <span>{alert.distance} miles away</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-primary" />
                        <span>ETA: {alert.eta} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LiveAlerts;
