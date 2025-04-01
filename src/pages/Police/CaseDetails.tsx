
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  CalendarClock,
  MapPin,
  FileText,
  MessageSquare,
  Truck,
  CheckCircle,
  Clock,
  Loader2,
  ArrowLeft,
  RefreshCw,
  FileImage,
  Upload
} from 'lucide-react';
import PriorityBadge from '@/components/PriorityBadge';
import { AccidentReport } from '@/types/accident';
import { toast } from "@/components/ui/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
  content: string;
  timestamp: string;
}

// Mock data
const mockCaseDetails: { [key: string]: AccidentReport } = {
  'default': {
    id: 'ACC-2024-001',
    location: { lat: 37.7749, lng: -122.4194, address: '123 Market St, San Francisco, CA' },
    severity: 'Critical',
    images: ['https://picsum.photos/id/1/600/400', 'https://picsum.photos/id/20/600/400'],
    description: 'Major collision involving multiple vehicles. Several injured. One vehicle appears to have run a red light according to witnesses. Debris scattered across intersection.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    reporter: { id: '1', role: 'public', contact: 'reporter@example.com' },
    status: 'in_progress',
    responders: {
      police: ['P-123', 'P-456'],
      ambulance: ['A-789']
    }
  }
};

const mockMessages: Message[] = [
  {
    id: 'm1',
    sender: {
      id: '2',
      name: 'Officer Johnson',
      role: 'police'
    },
    content: 'On scene. Two vehicles involved. Ambulance requested for minor injuries.',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString() // 20 minutes ago
  },
  {
    id: 'm2',
    sender: {
      id: '3',
      name: 'Dispatch',
      role: 'admin'
    },
    content: 'Copy that. Ambulance unit A-789 dispatched to your location. ETA 5 minutes.',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString() // 18 minutes ago
  },
  {
    id: 'm3',
    sender: {
      id: '4',
      name: 'Paramedic Rivera',
      role: 'hospital'
    },
    content: 'Ambulance on scene. Two patients with minor injuries being assessed.',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString() // 12 minutes ago
  },
  {
    id: 'm4',
    sender: {
      id: '2',
      name: 'Officer Johnson',
      role: 'police'
    },
    content: 'Traffic management in place. Road partially reopened. Waiting for tow trucks.',
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString() // 8 minutes ago
  }
];

const CaseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [caseDetails, setCaseDetails] = useState<AccidentReport | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [resolvingCase, setResolvingCase] = useState(false);
  
  useEffect(() => {
    // Simulate API fetch
    const fetchCaseDetails = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Use the provided ID or default to the mock case
        const caseData = id && mockCaseDetails[id] ? mockCaseDetails[id] : mockCaseDetails.default;
        setCaseDetails(caseData);
        setMessages(mockMessages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching case details:', error);
        toast({
          title: 'Error loading case details',
          description: 'Could not load case information. Please try again later.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };
    
    fetchCaseDetails();
  }, [id]);
  
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  const handleBackClick = () => {
    navigate('/dispatch');
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setSendingMessage(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create new message
      const newMsg: Message = {
        id: `m${Date.now()}`,
        sender: {
          id: 'current-user',
          name: 'You',
          role: 'police'
        },
        content: newMessage.trim(),
        timestamp: new Date().toISOString()
      };
      
      // Update state
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      
      // Scroll to bottom of messages
      setTimeout(() => {
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Could not send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSendingMessage(false);
    }
  };
  
  const handleResolveCase = async () => {
    setResolvingCase(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update case status
      if (caseDetails) {
        setCaseDetails({
          ...caseDetails,
          status: 'resolved'
        });
      }
      
      toast({
        title: 'Case Resolved',
        description: 'This case has been marked as resolved.',
      });
    } catch (error) {
      console.error('Error resolving case:', error);
      toast({
        title: 'Error',
        description: 'Could not resolve case. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setResolvingCase(false);
    }
  };
  
  const handleUploadEvidence = () => {
    // In a real app, this would open a file selection dialog
    toast({
      title: 'Upload Evidence',
      description: 'Evidence upload functionality would be implemented here.',
    });
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-gray-600">Loading case details...</p>
      </div>
    );
  }
  
  if (!caseDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
        <p className="text-xl text-gray-600 mb-4">Case not found</p>
        <Button onClick={handleBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Dispatch
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              {caseDetails.id}
              <PriorityBadge severity={caseDetails.severity} className="ml-2" />
            </h1>
            <p className="text-gray-600">
              Reported {formatTimeAgo(caseDetails.timestamp)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge 
            variant="outline" 
            className={`capitalize ${
              caseDetails.status === 'resolved' 
                ? 'bg-green-100 text-green-800' 
                : caseDetails.status === 'in_progress'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {caseDetails.status.replace('_', ' ')}
          </Badge>
          
          {caseDetails.status !== 'resolved' && (
            <Button 
              variant="outline" 
              className="bg-green-100 text-green-800 hover:bg-green-200"
              onClick={handleResolveCase}
              disabled={resolvingCase}
            >
              {resolvingCase ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resolving...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Resolved
                </>
              )}
            </Button>
          )}
          
          <Button variant="outline">
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mt-0.5 mr-1 text-gray-500" />
                    <p>{caseDetails.location.address}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Time Reported</p>
                  <div className="flex items-center">
                    <CalendarClock className="h-4 w-4 mr-1 text-gray-500" />
                    <p>{formatDateTime(caseDetails.timestamp)}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Reported By</p>
                  <p>
                    {caseDetails.reporter.role === 'public' ? 'Public User' : caseDetails.reporter.role}
                    {caseDetails.reporter.contact && ` (${caseDetails.reporter.contact})`}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Assigned Units</p>
                  <div className="space-y-1">
                    {caseDetails.responders?.police && caseDetails.responders.police.length > 0 && (
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-1 text-emergency-blue" />
                        <span>Police: {caseDetails.responders.police.join(', ')}</span>
                      </div>
                    )}
                    
                    {caseDetails.responders?.ambulance && caseDetails.responders.ambulance.length > 0 && (
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-1 text-emergency-red" />
                        <span>Ambulance: {caseDetails.responders.ambulance.join(', ')}</span>
                      </div>
                    )}
                    
                    {(!caseDetails.responders?.police || caseDetails.responders.police.length === 0) && 
                     (!caseDetails.responders?.ambulance || caseDetails.responders.ambulance.length === 0) && (
                      <p className="text-gray-500">No units assigned</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-gray-800 whitespace-pre-wrap">{caseDetails.description}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Evidence & Photos</CardTitle>
            </CardHeader>
            <CardContent>
              {caseDetails.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {caseDetails.images.map((image, index) => (
                    <div key={index} className="aspect-video relative overflow-hidden rounded-md border">
                      <img 
                        src={image} 
                        alt={`Evidence ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 border border-dashed rounded-md">
                  <FileImage className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-gray-500">No evidence images uploaded</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="outline" onClick={handleUploadEvidence}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Evidence
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="h-[calc(100%-88px)]">
            <CardHeader>
              <CardTitle>Communication Log</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="messages">
                <div className="px-6">
                  <TabsList className="w-full">
                    <TabsTrigger value="messages" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Messages
                    </TabsTrigger>
                    <TabsTrigger value="case-notes" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Case Notes
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="messages" className="m-0">
                  <div 
                    id="messages-container"
                    className="h-[300px] overflow-y-auto px-6 pt-4 space-y-4 border-t"
                  >
                    {messages.map(message => (
                      <div key={message.id} className="flex flex-col">
                        <div className="flex justify-between items-baseline mb-1">
                          <p className="font-medium">
                            {message.sender.name}
                            <span className="text-xs text-gray-500 ml-2 capitalize">
                              {message.sender.role}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {formatTimeAgo(message.timestamp)}
                          </p>
                        </div>
                        <p className="text-gray-800">{message.content}</p>
                      </div>
                    ))}
                    
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <MessageSquare className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-gray-500">No messages yet</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <Textarea 
                        placeholder="Type your message here..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendingMessage}
                        className="flex-shrink-0"
                      >
                        {sendingMessage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Send'
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="case-notes" className="m-0">
                  <div className="h-[300px] overflow-y-auto px-6 pt-4 border-t">
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <FileText className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-gray-500">No case notes yet</p>
                      <Button variant="link" className="mt-2">
                        Add First Note
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
