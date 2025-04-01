
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { getRoleBasedHome } from './ProtectedRoute';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from "@/components/ui/use-toast";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const NavLinks = () => {
    if (!isAuthenticated || !user) return null;

    switch (user.role) {
      case 'public':
        return (
          <>
            <Link to="/" className="text-white hover:text-gray-200">Home</Link>
            <Link to="/report" className="text-white hover:text-gray-200">Report Accident</Link>
            <Link to="/live-alerts" className="text-white hover:text-gray-200">Live Alerts</Link>
            <Link to="/sos" className="text-white hover:text-gray-200">Emergency SOS</Link>
          </>
        );
      case 'police':
        return (
          <>
            <Link to="/dispatch" className="text-white hover:text-gray-200">Dispatch</Link>
            <Link to="/case-details" className="text-white hover:text-gray-200">Case Details</Link>
          </>
        );
      case 'hospital':
        return (
          <>
            <Link to="/ambulance-tracker" className="text-white hover:text-gray-200">Ambulance Tracker</Link>
            <Link to="/triage" className="text-white hover:text-gray-200">Triage</Link>
          </>
        );
      case 'admin':
        return (
          <>
            <Link to="/analytics" className="text-white hover:text-gray-200">Analytics</Link>
            <Link to="/user-mgmt" className="text-white hover:text-gray-200">User Management</Link>
          </>
        );
    }
  };

  return (
    <nav className="bg-emergency-darkGray shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={user ? getRoleBasedHome(user.role) : '/'} className="flex-shrink-0 flex items-center">
              <span className="text-white font-bold text-xl">SmartResponse</span>
              <span className="text-emergency-red ml-1 font-bold text-xl">SOS</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => toast({
                    title: "Notifications",
                    description: "You have no new notifications",
                  })}
                >
                  <Bell className="h-5 w-5 text-white" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-primary text-white">
                          {user?.name ? getInitials(user.name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground capitalize">
                          {user?.role} User
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-emergency-darkGray"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-emergency-darkGray border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLinks />
            
            {isAuthenticated ? (
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-primary text-white">
                        {user?.name ? getInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">
                      {user?.name}
                    </div>
                    <div className="text-sm font-medium leading-none text-gray-400 mt-1">
                      {user?.email}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-auto"
                    onClick={() => toast({
                      title: "Notifications",
                      description: "You have no new notifications",
                    })}
                  >
                    <Bell className="h-5 w-5 text-white" />
                  </Button>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 px-5">
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
