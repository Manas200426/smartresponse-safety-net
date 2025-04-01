
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Authentication context
import { AuthProvider } from "@/contexts/AuthContext";

// Layout
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Public pages
import Home from "@/pages/Public/Home";
import ReportAccident from "@/pages/Public/ReportAccident";
import LiveAlerts from "@/pages/Public/LiveAlerts";
import EmergencySOS from "@/pages/Public/EmergencySOS";

// Auth pages
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";

// Police pages
import Dispatch from "@/pages/Police/Dispatch";
import CaseDetails from "@/pages/Police/CaseDetails";

// Hospital pages
import AmbulanceTracker from "@/pages/Hospital/AmbulanceTracker";
import Triage from "@/pages/Hospital/Triage";

// Admin pages
import Analytics from "@/pages/Admin/Analytics";
import UserManagement from "@/pages/Admin/UserManagement";

// Error page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Public Routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            
            {/* Public User Routes (accessible to all authenticated users) */}
            <Route
              path="/report"
              element={
                <Layout>
                  <ProtectedRoute>
                    <ReportAccident />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/live-alerts"
              element={
                <Layout>
                  <ProtectedRoute>
                    <LiveAlerts />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/sos"
              element={
                <Layout>
                  <ProtectedRoute>
                    <EmergencySOS />
                  </ProtectedRoute>
                </Layout>
              }
            />
            
            {/* Police Routes */}
            <Route
              path="/dispatch"
              element={
                <Layout>
                  <ProtectedRoute allowedRoles={['police', 'admin']}>
                    <Dispatch />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/case-details/:id"
              element={
                <Layout>
                  <ProtectedRoute allowedRoles={['police', 'admin']}>
                    <CaseDetails />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/case-details"
              element={
                <Layout>
                  <ProtectedRoute allowedRoles={['police', 'admin']}>
                    <CaseDetails />
                  </ProtectedRoute>
                </Layout>
              }
            />
            
            {/* Hospital Routes */}
            <Route
              path="/ambulance-tracker"
              element={
                <Layout>
                  <ProtectedRoute allowedRoles={['hospital', 'admin']}>
                    <AmbulanceTracker />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/triage"
              element={
                <Layout>
                  <ProtectedRoute allowedRoles={['hospital', 'admin']}>
                    <Triage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/analytics"
              element={
                <Layout>
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Analytics />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/user-mgmt"
              element={
                <Layout>
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                </Layout>
              }
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
