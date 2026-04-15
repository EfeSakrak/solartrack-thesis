import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line } from 'recharts';

function LiveDashboard({ viewMode, selectedDate, power, aiStatus, chartData }) {
  return (
    <div className="col-span-1 lg:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-gray-400 font-semibold uppercase tracking-widest text-[10px]">
            {viewMode === 'live' ? 'Live Performance' : `Analytics: ${selectedDate}`}
          </h2>
          <div className="text-3xl font-black text-gray-800">
            {viewMode === 'live' ? `${power} kW` : 'Daily Report'}
          </div>
        </div>
        {viewMode === 'live' && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase bg-purple-50 text-purple-600 border border-purple-100">
            <BrainCircuit size={14} className="animate-pulse" /> {aiStatus}
          </div>
        )}
      </div>
      
      <div className="h-87.5 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={viewMode === 'live' ? "#10B981" : "#3B82F6"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={viewMode === 'live' ? "#10B981" : "#3B82F6"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="time" fontSize={10} stroke="#9CA3AF" />
            <YAxis fontSize={10} stroke="#9CA3AF" domain={[0, 5]} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="Actual" stroke={viewMode === 'live' ? "#10B981" : "#3B82F6"} strokeWidth={3} fill="url(#colorActual)" connectNulls />
            {viewMode === 'live' && <Line type="monotone" dataKey="Forecast" stroke="#8B5CF6" strokeWidth={3} strokeDasharray="5 5" dot={false} connectNulls />}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default LiveDashboard;