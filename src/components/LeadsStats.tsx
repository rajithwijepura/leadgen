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
  const chartData = Object.entries(leadCounts).map(([category, count]) => ({
    name: category.replace('_', ' '),
    count
  }));

  const totalLeads = Object.values(leadCounts).reduce((sum, count) => sum + count, 0);
  const highLeadsCount = leadCounts.high_leads || 0;
  const highLeadsPercentage = totalLeads > 0 ? Math.round((highLeadsCount / totalLeads) * 100) : 0;

  const barColors = {
    'high leads': '#a855f7',    // Purple
    'medium leads': '#ec4899',  // Pink
    'low leads': '#f43f5e',     // Rose
    'no leads': '#6b7280'       // Gray
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-black rounded-xl border border-gray-700 p-6 flex items-center">
        <div className="rounded-xl bg-purple-500/20 p-3 mr-4">
          <TrendingUp size={24} className="text-purple-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">Conversion Rate</p>
          <div className="flex items-end">
            <h3 className="text-2xl font-bold text-gray-200">{highLeadsPercentage}%</h3>
            <p className="ml-2 text-sm text-gray-400">high potential</p>
          </div>
        </div>
      </div>

      <div className="bg-black rounded-xl border border-gray-700 p-6 flex items-center">
        <div className="rounded-xl bg-pink-500/20 p-3 mr-4">
          <Users size={24} className="text-pink-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">Total Leads</p>
          <div className="flex items-end">
            <h3 className="text-2xl font-bold text-gray-200">{totalLeads}</h3>
            <p className="ml-2 text-sm text-gray-400">all categories</p>
          </div>
        </div>
      </div>

      <div className="bg-black rounded-xl border border-gray-700 p-6 flex items-center">
        <div className="rounded-xl bg-rose-500/20 p-3 mr-4">
          <MessageCircle size={24} className="text-rose-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">High Potential</p>
          <div className="flex items-end">
            <h3 className="text-2xl font-bold text-gray-200">{highLeadsCount}</h3>
            <p className="ml-2 text-sm text-gray-400">to follow up</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 md:col-span-3">
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
                tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                stroke="#9ca3af"
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                formatter={(value) => [`${value} leads`, 'Count']}
                labelFormatter={(label) => label.charAt(0).toUpperCase() + label.slice(1)}
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                itemStyle={{ color: '#e5e7eb' }}
                labelStyle={{ color: '#e5e7eb' }}
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