import React, { useState, useEffect } from 'react';
import { NavBar } from './components/NavBar';
import { Dashboard } from './components/Dashboard';
import { LoadingScreen } from './components/LoadingScreen';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [leadsData, setLeadsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const requestId = urlParams.get('request_id') || '';

        const response = await fetch('https://n8n.bww.one/webhook/0af95f83-09a8-4bfc-87e9-bdf07b721074', {
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
        
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup function to remove the stored Instagram post code
    return () => {
      localStorage.removeItem('instagramPostCode');
    };
  }, []);

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
      <NavBar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <Dashboard leadsData={leadsData} currentView={currentView} />
        )}
      </main>
    </div>
  );
}

export default App;