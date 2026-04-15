import React from 'react';
import { Zap, CircleDollarSign, Leaf } from 'lucide-react';

function StatCards({ dailyStats }) {
  return (
    <div className="col-span-1 lg:col-span-4 flex flex-col gap-4">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Total Energy</p>
        <p className="text-3xl font-black">{dailyStats.total_kwh} <span className="text-sm font-normal text-gray-400">kWh</span></p>
        <div className="w-full bg-gray-100 h-1.5 mt-4 rounded-full overflow-hidden">
          <div className="bg-blue-500 h-full w-[65%]"></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Revenue Saved</p>
        <p className="text-3xl font-black text-emerald-600">₺{dailyStats.savings_try.toFixed(2)}</p>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">CO2 Avoided</p>
        <p className="text-3xl font-black text-green-600">{dailyStats.co2_kg.toFixed(2)} <span className="text-sm font-normal">kg</span></p>
      </div>
    </div>
  );
}

export default StatCards;