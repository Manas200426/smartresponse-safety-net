
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Log access attempts for auditing
    if (!isAuthenticated && !isLoading) {
      console.log(`Unauthorized access attempt to ${location.pathname}`);
    }
  }, [isAuthenticated, isLoading, location.pathname]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role restrictions are specified and user doesn't have an allowed role
  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate home based on role
    const roleBasedHome = getRoleBasedHome(user.role);
    return <Navigate to={roleBasedHome} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

// Helper function to determine home route based on role
export const getRoleBasedHome = (role: UserRole): string => {
  switch (role) {
    case 'police':
      return '/dispatch';
    case 'hospital':
      return '/ambulance-tracker';
    case 'admin':
      return '/analytics';
    case 'public':
    default:
      return '/';
  }
};
