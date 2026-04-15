import React, { useState, useEffect } from 'react';

// Oluşturduğumuz bileşenleri (Components) içeri aktarıyoruz
import Header from './components/Header';
import StatCards from './components/StatCards';
import LiveDashboard from './components/LiveDashboard';
import PanelGrid from './components/PanelGrid';

function App() {
  const [viewMode, setViewMode] = useState('live');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [power, setPower] = useState(0.00);
  const [historyData, setHistoryData] = useState([]); 
  const [forecast, setForecast] = useState([]);
  const [panels, setPanels] = useState([]); 
  const [isConnected, setIsConnected] = useState(false);
  const [aiStatus, setAiStatus] = useState("Gathering Data...");
  
  const [dailyStats, setDailyStats] = useState({ total_kwh: 0, savings_try: 0, co2_kg: 0 });

  const handleDownloadReport = () => window.open('http://localhost:8000/api/v1/export/daily', '_blank');

  useEffect(() => {
    if (viewMode !== 'live') return;

    const fetchLiveData = async () => {
      try {
        const [pRes, panRes, sRes, fRes] = await Promise.all([
          fetch('http://localhost:8000/api/v1/power/current'),
          fetch('http://localhost:8000/api/v1/panels'),
          fetch('http://localhost:8000/api/v1/stats/daily'),
          fetch('http://localhost:8000/api/v1/power/forecast')
        ]);

        if (pRes.ok && panRes.ok && sRes.ok) {
          const pData = await pRes.json();
          const panData = await panRes.json();
          const sData = await sRes.json();
          const newVal = pData.data.current_power_kw;

          setPower(newVal);
          setPanels(panData.data);
          setDailyStats(sData.data);
          setIsConnected(true);

          setHistoryData(prev => {
            const newHist = [...prev, { time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), actual: newVal }];
            return newHist.slice(-20);
          });
        }

        if (fRes.ok) {
          const fData = await fRes.json();
          if (fData.status === "success") { setForecast(fData.data); setAiStatus("AI Active"); }
          else { setAiStatus(fData.message); }
        }
      } catch (e) { setIsConnected(false); }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 3000);
    return () => clearInterval(interval);
  }, [viewMode]);

  useEffect(() => {
    if (viewMode !== 'history') return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/history/${selectedDate}`);
        if (res.ok) {
          const result = await res.json();
          const mapped = result.data.map(item => ({ time: item.time, actual: item.val }));
          setHistoryData(mapped);
          setDailyStats({ total_kwh: result.total_kwh, savings_try: result.total_kwh * 2.95, co2_kg: result.total_kwh * 0.45 });
          setIsConnected(true);
        }
      } catch (e) { setIsConnected(false); }
    };
    fetchHistory();
  }, [viewMode, selectedDate]);

  const chartData = viewMode === 'live' 
    ? [ ...historyData.map(d => ({ time: d.time, Actual: d.actual, Forecast: null })), ...forecast.map(f => ({ time: f.time, Actual: null, Forecast: f.predicted_kw })) ]
    : historyData.map(d => ({ time: d.time, Actual: d.actual, Forecast: null }));

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-gray-800 pb-12">
      
      {/* 1. Modüler Header Bileşeni */}
      <Header 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        isConnected={isConnected} 
        onDownload={handleDownloadReport} 
      />

      <main className="max-w-310 mx-auto mt-8 px-6 lg:px-0">
        
        {/* Takvim (Sadece History modunda açılır) */}
        {viewMode === 'history' && (
          <div className="bg-white mb-6 p-4 rounded-2xl shadow-sm border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-500 uppercase">Select Target Date:</span>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-xs font-medium text-blue-500 italic">Showing historical records from SQLite database</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* 2. Modüler Grafik Bileşeni */}
          <LiveDashboard 
            viewMode={viewMode} 
            selectedDate={selectedDate} 
            power={power} 
            aiStatus={aiStatus} 
            chartData={chartData} 
          />

          {/* 3. Modüler İstatistik Bileşeni */}
          <StatCards dailyStats={dailyStats} />
        </div>

        {/* 4. Modüler Panel Izgarası Bileşeni */}
        <PanelGrid panels={panels} viewMode={viewMode} />

      </main>
    </div>
  );
}

export default App;