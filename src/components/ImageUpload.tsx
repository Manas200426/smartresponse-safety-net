
import { useState, useRef } from 'react';
import { Camera, Upload, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from "@/components/ui/use-toast";

interface ImageUploadProps {
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onChange, 
  maxImages = 3 
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiVerification, setAiVerification] = useState<{
    isValid: boolean;
    confidence: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Check if adding new files would exceed the maximum
    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload a maximum of ${maxImages} images`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    // Process each file
    const newImages: string[] = [];
    let processed = 0;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
        }
        
        processed++;
        
        // When all files are processed
        if (processed === files.length) {
          clearInterval(interval);
          setUploadProgress(100);
          
          setTimeout(() => {
            const updatedImages = [...images, ...newImages];
            setImages(updatedImages);
            onChange(updatedImages);
            setUploading(false);
            
            // Simulate AI verification
            simulateAiVerification();
          }, 500);
        }
      };
      
      reader.readAsDataURL(file);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const simulateAiVerification = () => {
    // Simulate AI analysis delay
    setTimeout(() => {
      // Random verification result for demo purposes
      const isValid = Math.random() > 0.2; // 80% chance of being valid
      const confidence = isValid 
        ? Math.floor(Math.random() * 20) + 80 // 80-99% confidence if valid
        : Math.floor(Math.random() * 40) + 40; // 40-79% confidence if invalid
      
      setAiVerification({ isValid, confidence });
      
      if (!isValid) {
        toast({
          title: "Low confidence in image verification",
          description: "Our AI system has low confidence in the accident images. Please ensure they clearly show the incident.",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    onChange(updatedImages);
    
    // Reset AI verification if all images are removed
    if (updatedImages.length === 0) {
      setAiVerification(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // In a real app, this would open a camera capture UI
      // For now, we'll just simulate capturing an image
      
      // Cleanup stream
      stream.getTracks().forEach(track => track.stop());
      
      // Trigger file input as fallback
      triggerFileInput();
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera access error",
        description: "Could not access your camera. Please use file upload instead.",
        variant: "destructive",
      });
      
      // Fallback to file input
      triggerFileInput();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        
        <div className="flex flex-wrap gap-2">
          {images.map((src, index) => (
            <Card key={index} className="relative w-24 h-24 overflow-hidden">
              <CardContent className="p-0">
                <img 
                  src={src} 
                  alt={`Uploaded ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-1 right-1 h-5 w-5 rounded-full"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
          
          {images.length < maxImages && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="h-24 w-24 border-dashed"
                onClick={triggerFileInput}
              >
                <Upload className="h-5 w-5 mr-1" />
                Upload
              </Button>
              
              <Button 
                variant="outline" 
                className="h-24 w-24 border-dashed"
                onClick={handleCapture}
              >
                <Camera className="h-5 w-5 mr-1" />
                Camera
              </Button>
            </div>
          )}
        </div>
        
        {uploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-gray-500">
              Uploading: {uploadProgress}%
            </p>
          </div>
        )}
        
        {aiVerification && (
          <div className={`flex items-center p-3 rounded-md text-sm ${
            aiVerification.isValid 
              ? "bg-green-50 text-green-800" 
              : "bg-yellow-50 text-yellow-800"
          }`}>
            {aiVerification.isValid ? (
              <>
                <div className="flex-shrink-0 text-green-500 mr-2">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                </div>
                <div>
                  Image verified as genuine accident ({aiVerification.confidence}% confidence)
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                <div>
                  Low confidence in image verification ({aiVerification.confidence}% confidence)
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
