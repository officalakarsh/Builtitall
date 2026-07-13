import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import SitesManager from './pages/SitesManager';
import SiteEditorPage from './pages/SiteEditorPage';
import BookingsManager from './pages/BookingsManager';
import PublicSitePage from './pages/PublicSitePage';
import PricingPage from './pages/PricingPage';
import ProfilePage from './pages/ProfilePage';
import DashboardLayout from './dashboard/DashboardLayout';

// Simple Route Guard to protect administrative areas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  useEffect(() => {
    const handleLogoutEvent = () => {
      window.location.href = '/login';
    };
    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Landing & Authentication */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage defaultRegister={false} />} />
        <Route path="/register" element={<AuthPage defaultRegister={true} />} />
        <Route path="/pricing" element={<PricingPage />} />

        {/* Public Tenant Site URL */}
        <Route path="/site/:slug" element={<PublicSitePage />} />

        {/* Protected Dashboard Area */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/sites" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SitesManager />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/sites/:id" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SiteEditorPage />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/bookings" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <BookingsManager />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/analytics" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/profile" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
