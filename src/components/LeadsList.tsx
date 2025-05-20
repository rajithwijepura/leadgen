import React, { useState } from 'react';
import { LeadCard } from './LeadCard';

interface LeadsListProps {
  leads: any[];
}

export const LeadsList: React.FC<LeadsListProps> = ({ leads }) => {
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedLeadId(expandedLeadId === id ? null : id);
  };

  if (leads.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No leads found in this category.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {leads.map((lead) => (
        <LeadCard 
          key={lead.id} 
          lead={lead} 
          isExpanded={expandedLeadId === lead.id} 
          onToggle={() => toggleExpand(lead.id)} 
        />
      ))}
    </div>
  );
};
