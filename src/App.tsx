import React, { useState, useEffect } from 'react';
import { NavBar } from './components/NavBar';
import { Dashboard } from './components/Dashboard';
import { LoadingScreen } from './components/LoadingScreen';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { auth } from './firebaseConfig'; // Firebase auth instance
import { onAuthStateChanged, signOut, User } from 'firebase/auth'; // Firebase auth methods
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('login'); // Default to login
  const [leadsData, setLeadsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Covers both auth and data loading initially
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Listener for Firebase authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setIsAuthenticated(true);
        setCurrentUser(user);
        if (currentView === 'login' || currentView === 'signup') {
          setCurrentView('dashboard');
        }
      } else {
        // User is signed out
        setIsAuthenticated(false);
        setCurrentUser(null);
        setLeadsData(null); // Clear user-specific data on logout
        if (currentView === 'dashboard' || currentView === 'leads') {
          setCurrentView('login');
        }
      }
      setIsLoading(false); // Auth check is complete, app is no longer in initial loading state
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [currentView]); // currentView added to dependencies to re-evaluate redirection if view changes before auth state resolves

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will handle the rest (setIsAuthenticated, setCurrentUser, setCurrentView)
      console.log('User logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      // Optionally set an error state here
    }
  };

  // Effect for fetching data when authenticated and request_id is present
  useEffect(() => {
    const fetchData = async () => {
      // Ensure isLoading is true when we start fetching
      // setIsLoading(true); // This might cause a flicker if auth loading already set it to false.
      // Instead, data loading is part of the overall loading state.
      setError(null); // Clear previous errors
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const requestId = urlParams.get('request_id') || '';

        if (!requestId) {
          // No request_id, no specific data to fetch for this context
          // setIsLoading(false); // Handled by onAuthStateChanged now
          return;
        }

        const response = await fetch('https://ai1ds.app.n8n.cloud/webhook/0af95f83-09a8-4bfc-87e9-bdf07b721074', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ request_id: requestId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setLeadsData(data);
        
        // Store the Instagram post code from the first lead
        if (data && data.length > 0 && data[0][Object.keys(data[0])[0]].length > 0) {
          const firstLead = data[0][Object.keys(data[0])[0]][0];
          if (firstLead.insta_post_code) {
            localStorage.setItem('instagramPostCode', firstLead.insta_post_code);
          }
        }
      } catch (err: any) {
        console.error("Fetch data error:", err);
        setError(err.message);
      } finally {
        // setIsLoading(false); // This setIsLoading is critical. 
                               // It should be called after initial auth check in onAuthStateChanged.
                               // If fetchData runs after auth, it might briefly set loading to true then false.
                               // For now, onAuthStateChanged handles the main isLoading for app readiness.
      }
    };

    if (isAuthenticated) { // Only fetch if authenticated
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('request_id')) {
        fetchData();
      }
      // If no request_id, we might not need to fetch or set loading.
      // This part depends on whether leadsData is essential for all authenticated views.
    }
    
    // Cleanup function to remove the stored Instagram post code
    return () => {
      localStorage.removeItem('instagramPostCode');
    };
  }, [isAuthenticated]); // Depends on isAuthenticated to run after login

  // Error display remains the same
  if (error && !leadsData) { // Show full page error only if leadsData isn't there (critical error)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <NavBar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser?.displayName || currentUser?.email} // Display name or email
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-8">
        {isLoading ? ( // Covers initial auth check loading
          <LoadingScreen />
        ) : !isAuthenticated ? (
          currentView === 'login' ? (
            <Login setCurrentView={setCurrentView} />
          ) : currentView === 'signup' ? (
            <Signup setCurrentView={setCurrentView} />
          ) : (
            // Should be redirected by onAuthStateChanged, but as a fallback:
            <Login setCurrentView={setCurrentView} />
          )
        ) : currentView === 'dashboard' || currentView === 'leads' ? (
          <Dashboard leadsData={leadsData} currentView={currentView} />
        ) : (
           // Authenticated but unknown view, default to dashboard
          <Dashboard leadsData={leadsData} currentView={'dashboard'} />
        )
        }
        {error && leadsData && ( /* Show non-critical errors alongside dashboard */
          <div className="text-center text-red-500 p-4">
            <p>Error fetching additional data: {error}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;