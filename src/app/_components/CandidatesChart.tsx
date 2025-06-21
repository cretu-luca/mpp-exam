"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCandidates } from '~/contexts/CandidatesContext';

export const CandidatesChart = () => {
  const { candidates } = useCandidates();

  // Group candidates by party and count them
  const partyData = candidates.reduce((acc, candidate) => {
    const party = candidate.party;
    acc[party] ??= 0;
    acc[party]++;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array format for recharts
  const chartData = Object.entries(partyData).map(([party, count]) => ({
    party: party.length > 20 ? party.substring(0, 20) + '...' : party,
    fullParty: party,
    count: count,
  }));

  // Sort by count descending
  chartData.sort((a, b) => b.count - a.count);

  // Calculate a nice scale limit based on max value
  const maxCount = Math.max(...chartData.map(d => d.count), 0);
  const yAxisMax = Math.max(10, Math.ceil(maxCount * 1.2)); // At least 10, or 20% above max value

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
        Candidates by Political Party
      </h2>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 80,
            }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="party" 
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={11}
              tick={{ fill: '#374151' }}
              axisLine={{ stroke: '#9CA3AF' }}
              tickLine={{ stroke: '#9CA3AF' }}
            />
            <YAxis 
              domain={[0, yAxisMax]}
              tick={{ fill: '#374151' }}
              axisLine={{ stroke: '#9CA3AF' }}
              tickLine={{ stroke: '#9CA3AF' }}
              label={{ 
                value: 'Number of Candidates', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#374151' }
              }}
            />
            <Tooltip 
              formatter={(value) => [value, 'Candidates']}
              labelFormatter={(label: string) => {
                const item = chartData.find(d => d.party === label);
                return item?.fullParty ?? label;
              }}
              contentStyle={{
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar 
              dataKey="count" 
              fill="#3B82F6" 
              name="Number of Candidates"
              radius={[4, 4, 0, 0]}
              maxBarSize={80}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 