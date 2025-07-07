import React, { useState } from 'react';
import { BarChart3, Users, Instagram, Zap, Menu, X } from 'lucide-react';

interface NavBarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ currentView, setCurrentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get the insta_post_code from the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const requestId = urlParams.get('request_id') || '';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'leads', label: 'Leads', icon: <Users size={20} /> },
  ];

  // Get the Instagram post URL from localStorage (set in App.tsx)
  const instagramPostCode = localStorage.getItem('instagramPostCode');
  const instagramUrl = instagramPostCode 
    ? `https://instagram.com/p/${instagramPostCode}`
    : '#'; // Fallback URL if code is not available yet

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    setIsMobileMenuOpen(false); // Close mobile menu when item is selected
  };

  return (
    <header className="bg-black border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Zap size={24} className="text-[#833ab4]" />
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] font-bold text-xl">
              LeadReel
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
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
            {instagramPostCode && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-pink-400 hover:bg-pink-500/20 transition-all duration-200"
              >
                <span className="mr-2"><Instagram size={20} /></span>
                View Post
              </a>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-all duration-200"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              {instagramPostCode && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-pink-400 hover:bg-pink-500/20 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3"><Instagram size={20} /></span>
                  View Post
                </a>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}