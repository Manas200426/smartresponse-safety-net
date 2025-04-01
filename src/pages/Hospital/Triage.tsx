
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Loader2, 
  Search, 
  ClipboardList, 
  CheckCircle2,
  Users,
  Pill,
  Stethoscope
} from 'lucide-react';
import PriorityBadge from '@/components/PriorityBadge';
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PatientData {
  name: string;
  age: string;
  gender: string;
  condition: string;
  priority: string;
  notes: string;
  accidentId?: string;
  arrivalTime: string;
}

const Triage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [patientData, setPatientData] = useState<PatientData>({
    name: '',
    age: '',
    gender: '',
    condition: '',
    priority: 'Medium',
    notes: '',
    accidentId: '',
    arrivalTime: new Date().toISOString(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [availableBeds, setAvailableBeds] = useState(12);
  
  const handleSearch = async () => {
    if (!searchTerm) return;
    
    setIsSearching(true);
    
    try {
      // Simulate API search
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // If search term looks like an accident ID, pre-fill with accident data
      if (searchTerm.toUpperCase().startsWith('ACC-')) {
        setPatientData({
          name: '',
          age: '',
          gender: '',
          condition: 'Multiple injuries from vehicle collision',
          priority: 'High',
          notes: 'Patient was involved in a vehicle collision. Pre-filled from accident report.',
          accidentId: searchTerm.toUpperCase(),
          arrivalTime: new Date().toISOString(),
        });
        
        toast({
          title: 'Accident Report Found',
          description: `Patient information pre-filled from accident ID ${searchTerm.toUpperCase()}`,
        });
      } else {
        // Simulate patient lookup by name or ID
        setPatientData({
          name: searchTerm,
          age: '',
          gender: '',
          condition: '',
          priority: 'Medium',
          notes: '',
          arrivalTime: new Date().toISOString(),
        });
        
        toast({
          title: 'Patient Name Set',
          description: 'Please complete the remaining patient information.',
        });
      }
    } catch (error) {
      console.error('Error searching:', error);
      toast({
        title: 'Search Error',
        description: 'Could not find accident or patient record.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleInputChange = (field: keyof PatientData, value: string) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!patientData.name || !patientData.condition || !patientData.priority) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Submitting patient data:', patientData);
      
      // Update UI
      setIsSuccess(true);
      
      // Decrease available beds
      setAvailableBeds(prev => Math.max(0, prev - 1));
      
      toast({
        title: 'Patient Admitted',
        description: 'Patient has been successfully admitted and assigned to a bed.',
      });
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setPatientData({
          name: '',
          age: '',
          gender: '',
          condition: '',
          priority: 'Medium',
          notes: '',
          accidentId: '',
          arrivalTime: new Date().toISOString(),
        });
        setSearchTerm('');
      }, 3000);
    } catch (error) {
      console.error('Error submitting patient data:', error);
      toast({
        title: 'Submission Error',
        description: 'Could not complete patient admission. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patient Triage & Intake</h1>
          <p className="text-gray-600">
            Process new patients and assign treatment priority
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Available beds</p>
            <p className="text-2xl font-bold">{availableBeds}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Patient Intake Form</CardTitle>
            <CardDescription>
              Enter patient information for triage and admission
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="search">Search Accident ID or Patient Name</Label>
                      <Input 
                        id="search" 
                        placeholder="e.g., ACC-2024-001 or John Doe" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button 
                      type="button"
                      onClick={handleSearch}
                      disabled={!searchTerm || isSearching}
                    >
                      {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Search className="h-4 w-4 mr-2" />
                      )}
                      Search
                    </Button>
                  </div>
                  
                  {patientData.accidentId && (
                    <div className="bg-blue-50 p-3 rounded-md flex items-center">
                      <div className="flex-shrink-0 text-blue-500 mr-2">
                        <ClipboardList className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-blue-800 text-sm font-medium">
                          Linked to accident report: {patientData.accidentId}
                        </p>
                        <p className="text-blue-600 text-xs">
                          Patient information pre-filled from accident report
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Patient Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="name"
                      value={patientData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age"
                      type="number"
                      value={patientData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={patientData.gender} 
                      onValueChange={(value) => handleInputChange('gender', value)}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition/Injuries <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="condition"
                    value={patientData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    placeholder="Describe the patient's injuries or condition"
                    required
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Triage Priority <span className="text-red-500">*</span></Label>
                    <Select 
                      value={patientData.priority} 
                      onValueChange={(value) => handleInputChange('priority', value)}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical">
                          <div className="flex items-center">
                            <PriorityBadge severity="Critical" />
                            <span className="ml-2">Critical - Immediate attention required</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="High">
                          <div className="flex items-center">
                            <PriorityBadge severity="High" />
                            <span className="ml-2">High - Urgent care needed</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Medium">
                          <div className="flex items-center">
                            <PriorityBadge severity="Medium" />
                            <span className="ml-2">Medium - Prompt attention</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Low">
                          <div className="flex items-center">
                            <PriorityBadge severity="Low" />
                            <span className="ml-2">Low - Can wait for treatment</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="arrivalTime">Arrival Time</Label>
                    <Input 
                      id="arrivalTime"
                      type="datetime-local"
                      value={new Date(patientData.arrivalTime).toISOString().slice(0, 16)}
                      onChange={(e) => handleInputChange('arrivalTime', new Date(e.target.value).toISOString())}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea 
                    id="notes"
                    value={patientData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional information about the patient"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setPatientData({
                        name: '',
                        age: '',
                        gender: '',
                        condition: '',
                        priority: 'Medium',
                        notes: '',
                        accidentId: '',
                        arrivalTime: new Date().toISOString(),
                      });
                      setSearchTerm('');
                    }}
                  >
                    Clear Form
                  </Button>
                  
                  <Button 
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Patient Admitted
                      </>
                    ) : (
                      'Admit Patient'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                    <Users className="h-4 w-4 text-red-600" />
                  </div>
                  <span>Emergency Room</span>
                </div>
                <span className="font-bold">94%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-2">
                    <Users className="h-4 w-4 text-orange-600" />
                  </div>
                  <span>Trauma Center</span>
                </div>
                <span className="font-bold">78%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <Pill className="h-4 w-4 text-green-600" />
                  </div>
                  <span>ICU Capacity</span>
                </div>
                <span className="font-bold">65%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <Stethoscope className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>Operating Rooms</span>
                </div>
                <span className="font-bold">2 Available</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <p className="text-sm font-semibold mb-2">Currently Triaging</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                  <div className="flex items-center">
                    <PriorityBadge severity="Critical" className="mr-2" />
                    <span className="text-sm">Jane Doe</span>
                  </div>
                  <span className="text-xs text-gray-500">Bay 3</span>
                </div>
                
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                  <div className="flex items-center">
                    <PriorityBadge severity="High" className="mr-2" />
                    <span className="text-sm">John Smith</span>
                  </div>
                  <span className="text-xs text-gray-500">Bay 5</span>
                </div>
              </div>
              
              <Button 
                variant="link" 
                className="mt-2 p-0 h-auto text-sm"
                onClick={() => navigate('/triage-queue')}
              >
                View all triage queue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Triage;
