
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  AlertCircle, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { AccidentSeverity, Location } from '@/types/accident';
import LocationPicker from '@/components/LocationPicker';
import ImageUpload from '@/components/ImageUpload';
import { toast } from "@/components/ui/use-toast";

const ReportAccident = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form state
  const [location, setLocation] = useState<Location>({ lat: 0, lng: 0 });
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<AccidentSeverity>('Medium');
  const [images, setImages] = useState<string[]>([]);
  const [contactInfo, setContactInfo] = useState('');
  
  const handleLocationChange = (newLocation: Location) => {
    setLocation(newLocation);
  };
  
  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
  };
  
  const goToNextStep = () => {
    // Validate current step
    if (step === 1 && (location.lat === 0 && location.lng === 0)) {
      toast({
        title: "Missing location",
        description: "Please select a location for the accident",
        variant: "destructive",
      });
      return;
    }
    
    if (step === 2 && description.trim().length < 10) {
      toast({
        title: "Description too short",
        description: "Please provide a more detailed description",
        variant: "destructive",
      });
      return;
    }
    
    if (step === 3 && images.length === 0) {
      toast({
        title: "No images",
        description: "Please upload at least one image of the accident",
        variant: "destructive",
      });
      return;
    }
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };
  
  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Submitting accident report:', {
        location,
        description,
        severity,
        images,
        contactInfo,
      });
      
      setIsSuccess(true);
      
      toast({
        title: "Report submitted successfully",
        description: "Your accident report has been received. Emergency services have been notified.",
      });
      
      // Reset the form after 3 seconds and redirect
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting report:', error);
      setIsSubmitting(false);
      
      toast({
        title: "Error submitting report",
        description: "Please try again later or contact emergency services directly.",
        variant: "destructive",
      });
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Where did the accident occur?</h3>
              <p className="text-gray-500 text-sm">
                Please provide the exact location of the accident. You can use your current location or select a specific point on the map.
              </p>
            </div>
            
            <LocationPicker onChange={handleLocationChange} />
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">What happened?</h3>
              <p className="text-gray-500 text-sm">
                Please provide details about the accident. Include information about vehicles involved, injuries, and any other relevant details.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select 
                value={severity} 
                onValueChange={(value: AccidentSeverity) => setSeverity(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical - Life-threatening</SelectItem>
                  <SelectItem value="High">High - Serious injuries</SelectItem>
                  <SelectItem value="Medium">Medium - Minor injuries</SelectItem>
                  <SelectItem value="Low">Low - No injuries</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what happened..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
              <p className="text-xs text-gray-500">
                Minimum 10 characters. Be as specific as possible.
              </p>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Upload photos of the accident</h3>
              <p className="text-gray-500 text-sm">
                Please upload photos that clearly show the accident scene. This will help emergency services assess the situation.
              </p>
            </div>
            
            <ImageUpload 
              onChange={handleImagesChange}
              maxImages={3}
            />
            
            <p className="text-xs text-gray-500">
              Our AI system will analyze the images to help prioritize the emergency response.
            </p>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Review and submit</h3>
              <p className="text-gray-500 text-sm">
                Please review the information below and provide your contact details.
              </p>
            </div>
            
            <div className="space-y-4 border rounded-md p-4 bg-gray-50">
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-gray-500">
                  Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Severity</p>
                <p className="text-sm text-gray-500">{severity}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Images</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {images.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`Accident ${index + 1}`} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactInfo">Your contact information (optional)</Label>
              <Input
                id="contactInfo"
                placeholder="Phone number or email"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                This information will only be used by emergency services if they need to contact you.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  if (isSuccess) {
    return (
      <Card className="w-full max-w-xl mx-auto">
        <CardContent className="pt-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Report Submitted</h2>
          <p className="text-gray-600 text-center mb-4">
            Your accident report has been received. Emergency services have been notified.
          </p>
          <p className="text-gray-600 text-center mb-6">
            Redirecting you back to the home page...
          </p>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Report an Accident</CardTitle>
        <CardDescription>
          Please provide details about the accident to help emergency services respond quickly.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stepNumber === step
                      ? 'bg-primary text-white'
                      : stepNumber < step
                      ? 'bg-primary/20 text-primary'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div
                    className={`w-12 h-1 ${
                      stepNumber < step ? 'bg-primary/20' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>Location</span>
            <span>Details</span>
            <span>Photos</span>
            <span>Review</span>
          </div>
        </div>
        
        {renderStepContent()}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={step === 1 || isSubmitting}
        >
          Back
        </Button>
        
        <Button
          onClick={goToNextStep}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : step < 4 ? (
            'Next'
          ) : (
            'Submit Report'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportAccident;
