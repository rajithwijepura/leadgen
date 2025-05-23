import React, { useState } from 'react';
import { LeadsList } from './LeadsList';
import { LeadsStats } from './LeadsStats';
import { Search } from 'lucide-react';

interface DashboardProps {
  leadsData: any;
  currentView: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ leadsData, currentView }) => {
  const [searchQuery, setSearchQuery] = useState('');
  // Initialize activeCategory later, after validating leadsData

  // Check if leadsData is null, not an array, or empty
  if (!leadsData || !Array.isArray(leadsData) || leadsData.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]">
            {currentView === 'dashboard' ? 'Dashboard Overview' : 
             currentView === 'leads' ? 'Lead Management' : 
             currentView === 'comments' ? 'Comment Analysis' : 'Settings'}
          </h1>
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search leads..."
              className="pl-10 pr-4 py-2 w-full bg-black border border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="text-center text-gray-400 py-8">
          <p>No leads data available or still loading.</p>
        </div>
      </div>
    );
  }

  // leadsData is valid and non-empty here
  const categories = leadsData.map((category: any) => 
    Object.keys(category)[0]
  );
  
  const [activeCategory, setActiveCategory] = useState(categories[0] || ''); // Default to first category or empty string

  const getActiveLeads = () => {
    if (!activeCategory) return []; // No active category means no leads to show
    const categoryData = leadsData.find((category: any) => 
      Object.keys(category)[0] === activeCategory
    );
    if (categoryData) {
      const leads = categoryData[activeCategory];
      return leads.sort((a: any, b: any) => 
        new Date(b.comment_post_date).getTime() - new Date(a.comment_post_date).getTime()
      );
    }
    return [];
  };

  const filterLeads = (leads: any[]) => {
    if (!searchQuery) return leads;
    
    return leads.filter(lead => 
      lead.comment_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.user.full_name && lead.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const activeLeads = filterLeads(getActiveLeads());
  const getCounts = () => {
    const counts: Record<string, number> = {};
    leadsData.forEach((category: any) => {
      const key = Object.keys(category)[0];
      counts[key] = category[key].length;
    });
    return counts;
  };

  const leadCounts = getCounts();

  // Main content structure remains similar but assumes leadsData is valid
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]">
          {currentView === 'dashboard' ? 'Dashboard Overview' : 
           currentView === 'leads' ? 'Lead Management' : 
           currentView === 'comments' ? 'Comment Analysis' : 'Settings'}
        </h1>
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search leads..."
            className="pl-10 pr-4 py-2 w-full bg-black border border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {currentView === 'dashboard' && (
        <LeadsStats leadCounts={leadCounts} />
      )}

      {categories.length > 0 && activeCategory && ( // Ensure categories and activeCategory exist before rendering tabs
        <div className="bg-black rounded-xl border border-gray-700 overflow-hidden">
          <div className="border-b border-gray-700">
            <nav className="flex overflow-x-auto">
              {categories.map((category) => {
                const prettyName = category.replace('_', ' potential ');
                const count = leadCounts[category] || 0;
                
                return (
                  <button
                    key={category}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      activeCategory === category
                        ? 'border-b-2 border-purple-500 text-purple-400 bg-gray-700/50'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {prettyName.charAt(0).toUpperCase() + prettyName.slice(1)}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeCategory === category
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
          <LeadsList leads={activeLeads} />
        </div>
      )}
      {(!categories.length || !activeCategory) && leadsData && leadsData.length > 0 && (
         <div className="text-center text-gray-400 py-8">
            <p>No categories found in leads data.</p>
         </div>
      )}
    </div>
  );
};