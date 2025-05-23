import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { NavBar } from './components/NavBar';
import { Dashboard } from './components/Dashboard';
import { LoadingScreen } from './components/LoadingScreen';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import GoogleAuthCallback from './components/GoogleAuthCallback';
import './index.css';

// Layout for authenticated users
const AuthenticatedLayout: React.FC = () => {
  const { logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard'); // For NavBar, can be evolved
  const [leadsData, setLeadsData] = useState(null); // Dashboard data
  const [isDataLoading, setIsDataLoading] = useState(true); // Dashboard data loading
  const [dataError, setDataError] = useState<string | null>(null); // Dashboard data error

  useEffect(() => {
    // Fetch dashboard data
    const fetchData = async () => {
      setIsDataLoading(true);
      setDataError(null);
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const requestId = urlParams.get('request_id') || '';
        const response = await fetch('https://ai1ds.app.n8n.cloud/webhook/0af95f83-09a8-4bfc-87e9-bdf07b721074', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ request_id: requestId }),
        });
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        const data = await response.json();
        setLeadsData(data);
        if (data && data.length > 0 && data[0][Object.keys(data[0])[0]].length > 0) {
          const firstLead = data[0][Object.keys(data[0])[0]][0];
          if (firstLead.insta_post_code) {
            localStorage.setItem('instagramPostCode', firstLead.insta_post_code);
          }
        }
      } catch (err: any) {
        setDataError(err.message);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchData();
    return () => localStorage.removeItem('instagramPostCode');
  }, []);

  if (isDataLoading) return <LoadingScreen />;
  if (dataError) return <div className="min-h-screen bg-black text-white flex items-center justify-center"><p>Error loading data: {dataError}</p></div>;

  return (
    <div className="min-h-screen bg-black">
      <NavBar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="p-4 absolute top-0 right-0">
        <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
          Logout
        </button>
      </div>
      <main className="container mx-auto px-4 py-8">
        {/* Render Dashboard or other authenticated routes here */}
        <Dashboard leadsData={leadsData} currentView={currentView} />
        <Outlet /> {/* For nested routes if any */}
      </main>
    </div>
  );
};

// Layout for authentication pages
const AuthLayout: React.FC = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
    <Outlet /> {/* This will render LoginPage or RegistrationPage */}
  </div>
);

function App() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <LoadingScreen />; // Show loading screen while checking auth status
  }

  return (
    <Router>
      <Routes>
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
        
        {isAuthenticated ? (
          <Route path="/" element={<AuthenticatedLayout />}>
            {/* <Route index element={<Dashboard ... />} />  // Example of nested route */}
            {/* Add other authenticated routes here */}
          </Route>
        ) : (
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="login" element={
              <>
                <LoginPage />
                <Link to="/register" className="mt-4 text-blue-500 hover:underline">
                  Don't have an account? Register
                </Link>
              </>
            } />
            <Route path="register" element={
              <>
                <RegistrationPage />
                <Link to="/login" className="mt-4 text-blue-500 hover:underline">
                  Already have an account? Login
                </Link>
              </>
            } />
          </Route>
        )}
        {/* Redirect any unknown authenticated paths to dashboard, unauthenticated to login */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;