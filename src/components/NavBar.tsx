import React from 'react';
import { BarChart3, Users, Instagram } from 'lucide-react';

interface NavBarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'leads', label: 'Leads', icon: <Users size={20} /> },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-teal-600 font-bold text-xl">LeadTracker</div>
          </div>
          
          <nav className="flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === item.id
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-100'
                } transition-colors duration-200`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
            <a
              href="https://instagram.com/p/DIHLRuXNu8l"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-purple-600 hover:bg-purple-100 transition-colors duration-200"
            >
              <span className="mr-2"><Instagram size={20} /></span>
              View Post
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
