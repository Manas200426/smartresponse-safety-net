
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Map,
  List,
  ListFilter,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  CalendarClock,
  X,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import PriorityBadge from '@/components/PriorityBadge';
import { AccidentReport, AccidentSeverity } from '@/types/accident';
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

// Mock data for demo
const mockReports: AccidentReport[] = [
  {
    id: 'ACC-2024-001',
    location: { lat: 37.7749, lng: -122.4194, address: '123 Market St, San Francisco, CA' },
    severity: 'Critical',
    images: ['https://picsum.photos/id/1/200/300'],
    description: 'Major collision involving multiple vehicles. Several injured.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    reporter: { id: '1', role: 'public' },
    status: 'reported',
    responders: {
      police: [],
      ambulance: []
    }
  },
  {
    id: 'ACC-2024-002',
    location: { lat: 37.7739, lng: -122.4312, address: '456 Hayes St, San Francisco, CA' },
    severity: 'High',
    images: ['https://picsum.photos/id/2/200/300'],
    description: 'Vehicle hit pedestrian in crosswalk. Pedestrian conscious but injured.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    reporter: { id: '2', role: 'public' },
    status: 'dispatched',
    responders: {
      police: ['P-123'],
      ambulance: ['A-456']
    }
  },
  {
    id: 'ACC-2024-003',
    location: { lat: 37.7833, lng: -122.4167, address: '789 Broadway St, San Francisco, CA' },
    severity: 'Medium',
    images: ['https://picsum.photos/id/3/200/300'],
    description: 'Two-car collision. Minor injuries reported. Road partially blocked.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    reporter: { id: '3', role: 'public' },
    status: 'in_progress',
    responders: {
      police: ['P-789'],
      ambulance: []
    }
  },
  {
    id: 'ACC-2024-004',
    location: { lat: 37.7913, lng: -122.4089, address: '101 Lombard St, San Francisco, CA' },
    severity: 'Low',
    images: ['https://picsum.photos/id/4/200/300'],
    description: 'Vehicle hit parked car. No injuries. Minor property damage.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    reporter: { id: '4', role: 'public' },
    status: 'resolved',
    responders: {
      police: ['P-012'],
      ambulance: []
    }
  },
];

const Dispatch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<AccidentReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<AccidentReport[]>([]);
  const [view, setView] = useState<'map' | 'list'>('list');
  const [filter, setFilter] = useState<AccidentSeverity | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'reported' | 'dispatched' | 'in_progress' | 'resolved'>('All');
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate API fetch
    const fetchReports = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setReports(mockReports);
        setFilteredReports(mockReports);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast({
          title: 'Error loading reports',
          description: 'Could not load accident reports. Please try again later.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };
    
    fetchReports();
    
    // Set up periodic refresh (every 30 seconds)
    const interval = setInterval(() => {
      fetchReports();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Apply filters
    let filtered = [...reports];
    
    if (filter !== 'All') {
      filtered = filtered.filter(report => report.severity === filter);
    }
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }
    
    setFilteredReports(filtered);
  }, [filter, statusFilter, reports]);
  
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  const handleDispatch = async (reportId: string) => {
    setDispatchingId(reportId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      const updatedReports = reports.map(report => {
        if (report.id === reportId) {
          return {
            ...report,
            status: 'dispatched' as const,
            responders: {
              ...report.responders,
              police: [...(report.responders?.police || []), 'P-' + Math.floor(Math.random() * 1000)]
            }
          };
        }
        return report;
      });
      
      setReports(updatedReports);
      
      toast({
        title: 'Unit Dispatched',
        description: `Police unit has been dispatched to incident ${reportId}.`,
      });
    } catch (error) {
      console.error('Error dispatching unit:', error);
      toast({
        title: 'Error',
        description: 'Could not dispatch unit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDispatchingId(null);
    }
  };
  
  const handleViewCase = (reportId: string) => {
    // In a real app, this would navigate to the case details page
    navigate(`/case-details/${reportId}`);
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-gray-600">Loading dispatch board...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dispatch Board</h1>
          <p className="text-gray-600">
            Monitor and manage accident reports
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as 'map' | 'list')} className="w-[250px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">
                <List className="h-4 w-4 mr-2" />
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
      
      <div className="flex flex-wrap gap-3 items-center">
        <div className="space-y-1">
          <p className="text-sm font-medium">Severity:</p>
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
        </div>
        
        <div className="ml-auto space-y-1">
          <p className="text-sm font-medium">Status:</p>
          <Select 
            value={statusFilter} 
            onValueChange={(value: 'All' | 'reported' | 'dispatched' | 'in_progress' | 'resolved') => 
              setStatusFilter(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="reported">Reported</SelectItem>
              <SelectItem value="dispatched">Dispatched</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {view === 'map' ? (
        <Card>
          <CardHeader>
            <CardTitle>Accident Map</CardTitle>
            <CardDescription>
              Visual representation of accident locations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[500px] bg-gray-100 relative">
              {/* In a real app, this would be a map component */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Map view would be displayed here</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {filteredReports.length} accidents on record
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <ListFilter className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-xl font-medium">No reports found</p>
                <p className="text-gray-500 mt-2">
                  There are no reports matching your filter criteria.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 h-40 md:h-auto bg-gray-100 relative">
                    {report.images.length > 0 ? (
                      <img
                        src={report.images[0]}
                        alt="Accident scene"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <p>No image</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <PriorityBadge severity={report.severity} />
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                      <div className="flex items-center gap-2 mb-2 md:mb-0">
                        <h3 className="font-semibold">{report.id}</h3>
                        <Badge variant="outline" className="capitalize">
                          {report.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTimeAgo(report.timestamp)}
                      </div>
                    </div>
                    
                    <p className="text-gray-800 mb-2">{report.description}</p>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <span>{report.location.address}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mt-2 text-sm">
                      {report.responders?.police && report.responders.police.length > 0 && (
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 mr-1 text-emergency-blue" />
                          <span>
                            Police units: {report.responders.police.join(', ')}
                          </span>
                        </div>
                      )}
                      
                      {report.responders?.ambulance && report.responders.ambulance.length > 0 && (
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 mr-1 text-emergency-red" />
                          <span>
                            Ambulance units: {report.responders.ambulance.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-end gap-2">
                      {report.status === 'reported' && (
                        <Button
                          onClick={() => handleDispatch(report.id)}
                          disabled={dispatchingId === report.id}
                        >
                          {dispatchingId === report.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Dispatching...
                            </>
                          ) : (
                            <>
                              Dispatch Unit
                            </>
                          )}
                        </Button>
                      )}
                      
                      {report.status === 'resolved' ? (
                        <Button variant="outline" onClick={() => handleViewCase(report.id)}>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          View Completed Case
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={() => handleViewCase(report.id)}>
                          <ChevronRight className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      )}
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

export default Dispatch;
