import React, { useState, useEffect } from 'react';
import { NavBar } from './components/NavBar';
import { Dashboard } from './components/Dashboard';
import { leadsData } from './data/leadsData';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [requestId, setRequestId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reqId = params.get('request_id');
    if (reqId) {
      setRequestId(reqId);
      setCurrentView('leads'); // Automatically switch to leads view when request_id is present
    }
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <NavBar currentView={currentView} setCurrentView={setCurrentView} requestId={requestId} />
      <main className="container mx-auto px-4 py-8">
        <Dashboard leadsData={leadsData} currentView={currentView} requestId={requestId} />
      </main>
    </div>
  );
}

export default App;