import React, { useState } from 'react';
import { NavBar } from './components/NavBar';
import { Dashboard } from './components/Dashboard';
import { leadsData } from './data/leadsData';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="container mx-auto px-4 py-6">
        <Dashboard leadsData={leadsData} currentView={currentView} />
      </main>
    </div>
  );
}

export default App;
