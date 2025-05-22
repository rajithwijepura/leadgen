import React from 'react';
import { BarChart3, Users, Instagram, Zap } from 'lucide-react';

interface NavBarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  requestId: string | null;
}

export const NavBar: React.FC<NavBarProps> = ({ currentView, setCurrentView, requestId }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'leads', label: 'Leads', icon: <Users size={20} /> },
  ];

  return (
    <header className="bg-black border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Zap size={24} className="text-[#833ab4]" />
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] font-bold text-xl">
              LeadReel {requestId && <span className="text-sm">#{requestId}</span>}
            </div>
          </div>
          
          <nav className="flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
            <a
              href={`https://instagram.com/p/DIHLRuXNu8l${requestId ? `?request_id=${requestId}` : ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-pink-400 hover:bg-pink-500/20 transition-all duration-200"
            >
              <span className="mr-2"><Instagram size={20} /></span>
              View Post
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}