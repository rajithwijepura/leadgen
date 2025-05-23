import React, { useState, useEffect } from 'react';
import { NavBar } from './components/NavBar';
import { Dashboard } from './components/Dashboard';
import { LoadingScreen } from './components/LoadingScreen';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('login'); // Default to login
  const [leadsData, setLeadsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Define a simple in-memory store for users for the signup->login flow
  const [users, setUsers] = useState([
    { email: "user@example.com", password: "password", username: "testuser" }
  ]);

  const handleLogin = (email: string, pass: string) => {
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user.username);
      setCurrentView('dashboard');
    } else {
      alert('Login failed: Invalid email or password.');
    }
  };

  const handleSignup = (username: string, email: string, pass: string) => {
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      alert('Signup failed: Email already in use.');
      return;
    }
    const newUser = { username, email, password: pass };
    setUsers([...users, newUser]); // Add new user to our in-memory store
    console.log('Signup successful:', newUser);
    setIsAuthenticated(true);
    setCurrentUser(username);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('login');
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) { // Only fetch data if authenticated, or adjust as needed
        // If your app always needs leadsData, remove this isAuthenticated check.
        // For now, let's assume leadsData is only for authenticated users.
        // If not, we might want to set isLoading to false earlier or under different conditions.
        // setIsLoading(false); // Moved to after authentication check
        // return; 
      }
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const requestId = urlParams.get('request_id') || '';

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
        // setIsLoading(false); // Data fetching done
      } catch (err) {
        setError(err.message);
        // setIsLoading(false); // Error in fetching
      } finally {
        setIsLoading(false); // Ensure loading is always set to false after attempt
      }
    };

    // Only fetch data if we have a request_id, otherwise, it might be a non-data-driven view
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('request_id')) {
        fetchData();
    } else {
        setIsLoading(false); // No request_id, no data to fetch, stop loading
    }
    
    // Cleanup function to remove the stored Instagram post code
    return () => {
      localStorage.removeItem('instagramPostCode');
    };
  }, []); // Removed isAuthenticated from dependency array to avoid re-fetching on login/logout if not desired

  // View redirection logic
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && currentView !== 'login' && currentView !== 'signup') {
        setCurrentView('login');
      } else if (isAuthenticated && (currentView === 'login' || currentView === 'signup')) {
        setCurrentView('dashboard');
      }
    }
  }, [currentView, isAuthenticated, isLoading]);


  if (error) {
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
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <LoadingScreen />
        ) : !isAuthenticated ? (
          currentView === 'login' ? (
            <Login onLogin={handleLogin} setCurrentView={setCurrentView} />
          ) : currentView === 'signup' ? (
            <Signup onSignup={handleSignup} setCurrentView={setCurrentView} />
          ) : null // Fallback or redirect handled by useEffect
        ) : currentView === 'dashboard' || currentView === 'leads' ? (
          <Dashboard leadsData={leadsData} currentView={currentView} />
        ) : null // Fallback or redirect handled by useEffect
        }
      </main>
    </div>
  );
}

export default App;