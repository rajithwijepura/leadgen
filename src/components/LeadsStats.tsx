import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, MessageCircle } from 'lucide-react';

interface LeadsStatsProps {
  leadCounts: Record<string, number>;
}

export const LeadsStats: React.FC<LeadsStatsProps> = ({ leadCounts }) => {
  // Prepare data for pie chart
  const chartData = Object.entries(leadCounts).map(([category, count]) => ({
    name: category.replace('_', ' '),
    value: count,
  }));

  // Colors for pie chart
  const pieColors = {
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
            <h3 className="text-2xl font-bold text-gray-900">{Math.round((leadCounts.high_leads / Object.values(leadCounts).reduce((sum, count) => sum + count, 0)) * 100)}%</h3>
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
            <h3 className="text-2xl font-bold text-gray-900">{Object.values(leadCounts).reduce((sum, count) => sum + count, 0)}</h3>
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
            <h3 className="text-2xl font-bold text-gray-900">{leadCounts.high_leads}</h3>
            <p className="ml-2 text-sm text-gray-500">leads to follow up</p>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-lg shadow p-6 md:col-span-3">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[entry.name as keyof typeof pieColors]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
