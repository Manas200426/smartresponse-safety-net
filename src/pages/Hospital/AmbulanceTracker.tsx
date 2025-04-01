
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Ambulance, 
  Clock, 
  MapPin, 
  Users, 
  Truck, 
  Radio, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Loader2 
} from 'lucide-react';
import PriorityBadge from '@/components/PriorityBadge';
import { AccidentSeverity } from '@/types/accident';
import { toast } from "@/components/ui/use-toast";

interface AmbulanceVehicle {
  id: string;
  status: 'available' | 'dispatched' | 'en_route' | 'at_scene' | 'transporting' | 'at_hospital' | 'maintenance';
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  crew: string[];
  destination?: {
    type: 'accident' | 'hospital';
    id: string;
    name: string;
    address: string;
    eta?: number;
  };
  emergency?: {
    id: string;
    severity: AccidentSeverity;
  };
  lastUpdated: string;
}

// Mock data for demo
const mockAmbulances: AmbulanceVehicle[] = [
  {
    id: 'AMB-001',
    status: 'available',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: '123 Market St, San Francisco, CA',
    },
    crew: ['John Doe', 'Jane Smith'],
    lastUpdated: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    id: 'AMB-002',
    status: 'dispatched',
    location: {
      lat: 37.7739,
      lng: -122.4312,
      address: '456 Hayes St, San Francisco, CA',
    },
    crew: ['Mike Johnson', 'Lisa Brown'],
    destination: {
      type: 'accident',
      id: 'ACC-2024-001',
      name: 'Major collision',
      address: '789 Market St, San Francisco, CA',
      eta: 8,
    },
    emergency: {
      id: 'ACC-2024-001',
      severity: 'Critical',
    },
    lastUpdated: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 minutes ago
  },
  {
    id: 'AMB-003',
    status: 'at_scene',
    location: {
      lat: 37.7833,
      lng: -122.4167,
      address: '789 Broadway St, San Francisco, CA',
    },
    crew: ['Robert Wilson', 'Emily Davis'],
    destination: {
      type: 'accident',
      id: 'ACC-2024-002',
      name: 'Pedestrian hit',
      address: '789 Broadway St, San Francisco, CA',
      eta: 0,
    },
    emergency: {
      id: 'ACC-2024-002',
      severity: 'High',
    },
    lastUpdated: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
  },
  {
    id: 'AMB-004',
    status: 'transporting',
    location: {
      lat: 37.7913,
      lng: -122.4089,
      address: 'En route to SF General Hospital',
    },
    crew: ['Sarah Thompson', 'David Garcia'],
    destination: {
      type: 'hospital',
      id: 'HOSP-001',
      name: 'SF General Hospital',
      address: '1001 Potrero Ave, San Francisco, CA',
      eta: 12,
    },
    emergency: {
      id: 'ACC-2024-003',
      severity: 'Medium',
    },
    lastUpdated: new Date(Date.now() - 1000 * 60 * 8).toISOString(), // 8 minutes ago
  },
  {
    id: 'AMB-005',
    status: 'maintenance',
    crew: [],
    lastUpdated: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
  },
];

const AmbulanceTracker = () => {
  const [loading, setLoading] = useState(true);
  const [ambulances, setAmbulances] = useState<AmbulanceVehicle[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate API fetch
    const fetchAmbulances = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAmbulances(mockAmbulances);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ambulance data:', error);
        toast({
          title: 'Error loading ambulance data',
          description: 'Could not load ambulance status information. Please try again later.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };
    
    fetchAmbulances();
    
    // Set up periodic refresh (every 30 seconds)
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  const getStatusBadge = (status: AmbulanceVehicle['status']) => {
    const statusConfig = {
      available: { label: 'Available', variant: 'outline' as const, className: 'bg-green-100 text-green-800 hover:bg-green-200' },
      dispatched: { label: 'Dispatched', variant: 'outline' as const, className: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
      en_route: { label: 'En Route', variant: 'outline' as const, className: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
      at_scene: { label: 'At Scene', variant: 'outline' as const, className: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
      transporting: { label: 'Transporting', variant: 'outline' as const, className: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
      at_hospital: { label: 'At Hospital', variant: 'outline' as const, className: 'bg-green-100 text-green-800 hover:bg-green-200' },
      maintenance: { label: 'Maintenance', variant: 'outline' as const, className: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
    };
    
    const config = statusConfig[status];
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    
    try {
      // Simulate API fetch
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update timestamps to simulate real-time updates
      const updatedAmbulances = ambulances.map(ambulance => {
        // Randomly update some ETAs to simulate movement
        if (ambulance.destination?.eta && ambulance.destination.eta > 0) {
          ambulance.destination.eta = Math.max(0, ambulance.destination.eta - Math.floor(Math.random() * 2));
        }
        
        // Randomly progress the status of some ambulances
        if (Math.random() > 0.7) {
          switch (ambulance.status) {
            case 'dispatched':
              ambulance.status = 'en_route';
              break;
            case 'en_route':
              ambulance.status = 'at_scene';
              break;
            case 'at_scene':
              if (Math.random() > 0.5) {
                ambulance.status = 'transporting';
                ambulance.destination = {
                  type: 'hospital',
                  id: 'HOSP-001',
                  name: 'SF General Hospital',
                  address: '1001 Potrero Ave, San Francisco, CA',
                  eta: 15,
                };
              }
              break;
            case 'transporting':
              if (ambulance.destination?.eta === 0) {
                ambulance.status = 'at_hospital';
              }
              break;
            case 'at_hospital':
              if (Math.random() > 0.7) {
                ambulance.status = 'available';
                ambulance.emergency = undefined;
                ambulance.destination = undefined;
              }
              break;
          }
        }
        
        return {
          ...ambulance,
          lastUpdated: new Date().toISOString()
        };
      });
      
      setAmbulances(updatedAmbulances);
      
      toast({
        title: 'Ambulance Data Updated',
        description: 'Latest ambulance status information has been loaded.',
      });
    } catch (error) {
      console.error('Error refreshing ambulance data:', error);
      toast({
        title: 'Refresh Failed',
        description: 'Could not refresh ambulance status information.',
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  };
  
  const handleDispatch = async (ambulanceId: string) => {
    setDispatchingId(ambulanceId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      const updatedAmbulances = ambulances.map(ambulance => {
        if (ambulance.id === ambulanceId) {
          return {
            ...ambulance,
            status: 'dispatched' as const,
            destination: {
              type: 'accident' as const,
              id: 'ACC-2024-' + Math.floor(Math.random() * 1000),
              name: 'New emergency',
              address: '123 Emergency St, San Francisco, CA',
              eta: 10 + Math.floor(Math.random() * 10),
            },
            emergency: {
              id: 'ACC-2024-' + Math.floor(Math.random() * 1000),
              severity: 'High' as AccidentSeverity,
            },
            lastUpdated: new Date().toISOString(),
          };
        }
        return ambulance;
      });
      
      setAmbulances(updatedAmbulances);
      
      toast({
        title: 'Ambulance Dispatched',
        description: `Ambulance ${ambulanceId} has been dispatched to the emergency.`,
      });
    } catch (error) {
      console.error('Error dispatching ambulance:', error);
      toast({
        title: 'Error',
        description: 'Could not dispatch ambulance. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDispatchingId(null);
    }
  };
  
  const handleCallAmbulance = async (ambulanceId: string) => {
    // In a real app, this would initiate communication with the ambulance crew
    toast({
      title: 'Calling Ambulance',
      description: `Establishing communication with ambulance ${ambulanceId}.`,
    });
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-gray-600">Loading ambulance data...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Ambulance Fleet Tracker</h1>
          <p className="text-gray-600">
            Monitor and manage ambulance status and assignments
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold">
                {ambulances.filter(a => a.status === 'available').length}
              </div>
              <p className="text-gray-600">Available Units</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">
                {ambulances.filter(a => ['dispatched', 'en_route', 'at_scene'].includes(a.status)).length}
              </div>
              <p className="text-gray-600">Responding Units</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <Ambulance className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">
                {ambulances.filter(a => a.status === 'transporting').length}
              </div>
              <p className="text-gray-600">Transporting</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <XCircle className="h-6 w-6 text-gray-600" />
              </div>
              <div className="text-2xl font-bold">
                {ambulances.filter(a => a.status === 'maintenance').length}
              </div>
              <p className="text-gray-600">Out of Service</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Ambulance Fleet Status</CardTitle>
          <CardDescription>
            Real-time status and location of all ambulance units
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Crew</TableHead>
                <TableHead>Location / Destination</TableHead>
                <TableHead>Emergency</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ambulances.map((ambulance) => (
                <TableRow key={ambulance.id}>
                  <TableCell className="font-medium">{ambulance.id}</TableCell>
                  <TableCell>{getStatusBadge(ambulance.status)}</TableCell>
                  <TableCell>
                    {ambulance.crew.length > 0 ? (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        <span>{ambulance.crew.join(', ')}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {ambulance.location ? (
                      <div className="flex items-start gap-1">
                        <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                        <div>
                          <div>{ambulance.location.address || `${ambulance.location.lat.toFixed(6)}, ${ambulance.location.lng.toFixed(6)}`}</div>
                          {ambulance.destination && (
                            <div className="text-xs text-gray-500 mt-1">
                              → {ambulance.destination.name}
                              {ambulance.destination.eta !== undefined && ambulance.destination.eta > 0 && (
                                <span className="ml-1">
                                  (ETA: {ambulance.destination.eta} min)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">Unknown</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {ambulance.emergency ? (
                      <div className="flex flex-col">
                        <div className="text-sm">{ambulance.emergency.id}</div>
                        <PriorityBadge severity={ambulance.emergency.severity} className="mt-1" />
                      </div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      {formatTimeAgo(ambulance.lastUpdated)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {ambulance.status === 'available' && (
                        <Button
                          size="sm"
                          onClick={() => handleDispatch(ambulance.id)}
                          disabled={dispatchingId === ambulance.id}
                        >
                          {dispatchingId === ambulance.id ? (
                            <>
                              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                              Dispatching
                            </>
                          ) : (
                            <>Dispatch</>
                          )}
                        </Button>
                      )}
                      
                      {ambulance.status !== 'maintenance' && ambulance.status !== 'available' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCallAmbulance(ambulance.id)}
                        >
                          <Radio className="mr-1 h-3 w-3" />
                          Call
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AmbulanceTracker;
