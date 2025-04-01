
import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-emergency-darkGray text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">
                &copy; {new Date().getFullYear()} SmartResponse SOS. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-sm hover:text-gray-300">Privacy Policy</a>
              <a href="#" className="text-sm hover:text-gray-300">Terms of Service</a>
              <a href="#" className="text-sm hover:text-gray-300">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
