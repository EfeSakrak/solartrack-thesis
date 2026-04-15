import React from 'react';
import { Sun, Radio, History, Download, Wifi, WifiOff, User } from 'lucide-react';

function Header({ viewMode, setViewMode, isConnected, onDownload }) {
  return (
    <header className="bg-white shadow-sm h-20 flex items-center justify-between px-10 sticky top-0 z-10">
      <div className="text-2xl font-bold text-emerald-500 flex items-center gap-2">
        <Sun size={28} />
        SolarTrack
      </div>
      
      <div className="flex items-center gap-4">
        {/* VIEW MODE TOGGLE */}
        <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
          <button 
            onClick={() => setViewMode('live')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'live' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
          >
            <Radio size={16} /> LIVE
          </button>
          <button 
            onClick={() => setViewMode('history')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
          >
            <History size={16} /> ANALYTICS
          </button>
        </div>

        <button onClick={onDownload} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
          <Download size={20} />
        </button>

        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${isConnected ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'animate-pulse bg-emerald-500' : 'bg-red-500'}`}></div>
          <span className="font-bold text-xs uppercase">{isConnected ? 'Online' : 'Offline'}</span>
        </div>

        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
          <User size={20} />
        </div>
      </div>
    </header>
  );
}

export default Header;