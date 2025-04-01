
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertTriangle, 
  Map, 
  PhoneCall, 
  BarChart4, 
  ArrowRight, 
  ShieldCheck,
  BellRing
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emergency-darkGray to-emergency-red p-8 md:p-12">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              SmartResponse SOS: Emergency Response System
            </h1>
            <p className="text-white/90 text-lg mb-6">
              Report accidents, view real-time alerts, and access emergency services when you need them most.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button 
                size="lg" 
                className="bg-white text-emergency-red hover:bg-gray-100"
                onClick={() => navigate('/report')}
              >
                Report an Accident
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate('/sos')}
              >
                Emergency SOS
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Quick Action Cards */}
      <section className="grid md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <AlertTriangle className="h-6 w-6 text-emergency-red" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Report Accident</h2>
            <p className="text-gray-600 mb-4">
              Report an accident with details, location, and images.
            </p>
            <Button 
              variant="link" 
              className="mt-auto"
              onClick={() => navigate('/report')}
            >
              Report Now <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Map className="h-6 w-6 text-emergency-blue" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Live Alerts</h2>
            <p className="text-gray-600 mb-4">
              View real-time accident alerts in your area.
            </p>
            <Button 
              variant="link" 
              className="mt-auto"
              onClick={() => navigate('/live-alerts')}
            >
              View Alerts <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <PhoneCall className="h-6 w-6 text-emergency-red" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Emergency SOS</h2>
            <p className="text-gray-600 mb-4">
              Quick one-touch emergency response system.
            </p>
            <Button 
              variant="link" 
              className="mt-auto"
              onClick={() => navigate('/sos')}
            >
              Access SOS <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>
      
      {/* Feature Highlights */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">How It Works</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex space-x-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emergency-red flex items-center justify-center text-white">
              1
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Report Incidents Quickly</h3>
              <p className="text-gray-600">
                Upload photos, share your location, and provide details about the accident. Our AI system helps verify and categorize the incident.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emergency-red flex items-center justify-center text-white">
              2
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Get Real-time Alerts</h3>
              <p className="text-gray-600">
                Receive notifications about accidents in your area, alternate routes, and emergency responder ETAs.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emergency-red flex items-center justify-center text-white">
              3
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">One-Touch SOS</h3>
              <p className="text-gray-600">
                In an emergency, access the SOS button to immediately alert emergency services with your location and critical information.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emergency-red flex items-center justify-center text-white">
              4
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Coordinated Response</h3>
              <p className="text-gray-600">
                First responders receive detailed information and can coordinate efforts through the platform.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Professional Services */}
      {!isAuthenticated && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">For Professionals</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <ShieldCheck className="h-8 w-8 text-emergency-blue" />
                  <h3 className="text-xl font-semibold">Police Services</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Dispatch management, real-time accident mapping, and case management tools.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Login as Police
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <BellRing className="h-8 w-8 text-emergency-red" />
                  <h3 className="text-xl font-semibold">Hospital Services</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Ambulance tracking, patient intake management, and triage assistance.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Login as Hospital
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <BarChart4 className="h-8 w-8 text-gray-700" />
                  <h3 className="text-xl font-semibold">Administration</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  System analytics, user management, and response optimization tools.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Login as Admin
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
