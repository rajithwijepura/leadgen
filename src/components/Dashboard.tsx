import React, { useState } from 'react';
import { LeadsList } from './LeadsList';
import { LeadsStats } from './LeadsStats';
import { Search } from 'lucide-react';

interface DashboardProps {
  leadsData: any;
  currentView: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ leadsData, currentView }) => {
  const [activeCategory, setActiveCategory] = useState('high_leads');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract lead categories from data
  const categories = leadsData.map((category: any) => 
    Object.keys(category)[0]
  );

  // Get active leads based on selected category
  const getActiveLeads = () => {
    const categoryData = leadsData.find((category: any) => 
      Object.keys(category)[0] === activeCategory
    );
    if (categoryData) {
      const leads = categoryData[activeCategory];
      // Sort leads by comment_post_date in descending order
      return leads.sort((a: any, b: any) => 
        new Date(b.comment_post_date).getTime() - new Date(a.comment_post_date).getTime()
      );
    }
    return [];
  };

  // Filter leads based on search query
  const filterLeads = (leads: any[]) => {
    if (!searchQuery) return leads;
    
    return leads.filter(lead => 
      lead.comment_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.user.full_name && lead.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const activeLeads = filterLeads(getActiveLeads());

  // Get total counts for each category
  const getCounts = () => {
    const counts: Record<string, number> = {};
    leadsData.forEach((category: any) => {
      const key = Object.keys(category)[0];
      counts[key] = category[key].length;
    });
    return counts;
  };

  const leadCounts = getCounts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
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
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {currentView === 'dashboard' && (
        <LeadsStats leadCounts={leadCounts} />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {categories.map((category) => {
              const prettyName = category.replace('_', ' ');
              const count = leadCounts[category] || 0;
              
              return (
                <button
                  key={category}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                    activeCategory === category
                      ? 'border-b-2 border-teal-500 text-teal-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {prettyName.charAt(0).toUpperCase() + prettyName.slice(1)}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeCategory === category
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-gray-100 text-gray-600'
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
    </div>
  );
};
