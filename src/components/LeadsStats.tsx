import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TrendingUp, Users, MessageCircle } from 'lucide-react';

interface LeadsStatsProps {
  leadCounts: Record<string, number>;
}

export const LeadsStats: React.FC<LeadsStatsProps> = ({ leadCounts }) => {
  // Function to get display name for categories
  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'high_leads':
        return 'Hot Leads';
      case 'medium_leads':
        return 'Warm Buzz';
      case 'low_leads':
        return 'Noise';
      case 'no_leads':
        return 'Cold Drift';
      default:
        return category.replace('_', ' ').charAt(0).toUpperCase() + category.replace('_', ' ').slice(1);
    }
  };

  const chartData = Object.entries(leadCounts).map(([category, count]) => ({
    name: getCategoryDisplayName(category),
    count
  }));

  const totalLeads = Object.values(leadCounts).reduce((sum, count) => sum + count, 0);
  const highLeadsCount = leadCounts.high_leads || 0;
  const highLeadsPercentage = totalLeads > 0 ? Math.round((highLeadsCount / totalLeads) * 100) : 0;

  const barColors = {
    'Hot Leads': '#a855f7',      // Purple
    'Warm Buzz': '#ec4899',      // Pink
    'Noise': '#f43f5e',          // Rose
    'Cold Drift': '#6b7280'      // Gray
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-black rounded-xl border border-gray-700 p-6 flex items-center">
        <div className="rounded-full bg-purple-800 p-3 mr-4">
          <TrendingUp size={24} className="text-purple-200" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">Conversion Rate</p>
          <div className="flex items-end">
            <h3 className="text-2xl font-bold text-gray-200">{highLeadsPercentage}%</h3>
            <p className="ml-2 text-sm text-gray-400">HOT LEADS</p>
          </div>
        </div>
      </div>

      <div className="bg-black rounded-xl border border-gray-700 p-6 flex items-center">
        <div className="rounded-full bg-green-800 p-3 mr-4">
          <Users size={24} className="text-green-200" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">Total Leads</p>
          <div className="flex items-end">
            <h3 className="text-2xl font-bold text-gray-200">{totalLeads}</h3>
            <p className="ml-2 text-sm text-gray-400">ALL CATEGORIES</p>
          </div>
        </div>
      </div>

      <div className="bg-black rounded-xl border border-gray-700 p-6 flex items-center">
        <div className="rounded-full bg-rose-800 p-3 mr-4">
          <MessageCircle size={24} className="text-rose-200" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">Hot Leads</p>
          <div className="flex items-end">
            <h3 className="text-2xl font-bold text-gray-200">{highLeadsCount}</h3>
            <p className="ml-2 text-sm text-gray-400">TO FOLLOW UP</p>
          </div>
        </div>
      </div>

      <div className="bg-black rounded-xl border border-gray-700 p-6 md:col-span-3">
        <h3 className="text-lg font-medium text-gray-200 mb-6">Lead Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af"
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                formatter={(value) => [`${value} leads`, 'Count']}
                labelFormatter={(label) => label}
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                itemStyle={{ color: '#e5e7eb' }}
                labelStyle={{ color: '#e5e7eb' }}
                cursor={{fill: 'transparent'}}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[entry.name as keyof typeof barColors]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};