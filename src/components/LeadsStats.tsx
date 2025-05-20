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
  // Prepare data for chart
  const chartData = Object.entries(leadCounts).map(([category, count]) => ({
    name: category.replace('_', ' '),
    count
  }));

  // Calculate total leads
  const totalLeads = Object.values(leadCounts).reduce((sum, count) => sum + count, 0);
  const highLeadsCount = leadCounts.high_leads || 0;
  const highLeadsPercentage = totalLeads > 0 ? Math.round((highLeadsCount / totalLeads) * 100) : 0;

  // Colors for chart bars
  const barColors = {
    'high leads': '#22c55e',    // Green
    'medium leads': '#eab308',  // Yellow
    'low leads': '#f97316',     // Orange
    'no leads': '#94a3b8'       // Gray
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Stats cards */}
      <div className="bg-white rounded-lg shadow p-6 flex items-center">
        <div className="rounded-full bg-blue-100 p-3 mr-4">
          <TrendingUp size={24} className="text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
          <div className="flex items-end">
            <h3 className="text-2xl font-bold text-gray-900">{highLeadsPercentage}%</h3>
            <p className="ml-2 text-sm text-gray-500">high potential leads</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 flex items-center">
        <div className="rounded-full bg-green-100 p-3 mr-4">
          <Users size={24} className="text-green-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total Leads</p>
          <div className="flex items-end">
            <h3 className="text-2xl font-bold text-gray-900">{totalLeads}</h3>
            <p className="ml-2 text-sm text-gray-500">from all categories</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 flex items-center">
        <div className="rounded-full bg-purple-100 p-3 mr-4">
          <MessageCircle size={24} className="text-purple-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">High Potential</p>
          <div className="flex items-end">
            <h3 className="text-2xl font-bold text-gray-900">{highLeadsCount}</h3>
            <p className="ml-2 text-sm text-gray-500">leads to follow up</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-6 md:col-span-3">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} leads`, 'Count']}
                labelFormatter={(label) => label.charAt(0).toUpperCase() + label.slice(1)}
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
