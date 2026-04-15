import React from 'react';
import { LayoutGrid } from 'lucide-react';

function PanelGrid({ panels, viewMode }) {
  // Eğer Analytics (Geçmiş) modundaysak, anlık panelleri göstermeye gerek yok
  if (viewMode !== 'live' || !panels || panels.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
       <h2 className="text-gray-800 font-bold mb-6 flex items-center gap-2 text-lg">
         <LayoutGrid className="text-blue-500" size={22} />
         Panel Status (Roof View)
       </h2>
       
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
         {panels.map((panel) => (
           <div key={panel.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:border-emerald-200 transition-colors">
             <div className="flex justify-between items-start mb-2">
               <span className="text-[10px] font-bold text-gray-400 uppercase">{panel.id}</span>
               <div className={`w-2 h-2 rounded-full ${
                 panel.status === 'active' ? 'bg-emerald-500' : 'bg-yellow-500'
               }`}></div>
             </div>
             <div className="text-2xl font-bold text-gray-700">{panel.power_w} <span className="text-xs font-normal">W</span></div>
             <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between text-[10px] font-medium text-gray-500">
                <span>{panel.voltage_v} V</span>
                <span>{panel.current_a} A</span>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
}

export default PanelGrid;