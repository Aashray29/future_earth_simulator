import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { MapSection } from './components/MapSection';
import { PolicyControls } from './components/PolicyControls';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ChartsSection } from './components/ChartsSection';
import { CitySelector } from './components/CitySelector';
import { City, Policies, SimulationResult } from './types';
import { CITIES, DEFAULT_POLICIES } from './data';
import { Play, Loader2, Database } from 'lucide-react';

export default function App() {
  const [futureMode, setFutureMode] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [activeCities, setActiveCities] = useState<City[]>(CITIES);
  const [policies, setPolicies] = useState<Policies>(DEFAULT_POLICIES);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SimulationResult | null>(null);

  const handleCitySearch = (newCity: City) => {
    setSelectedCity(newCity);
    // If the city doesn't exist in our active mapped array, add it to show on the globe
    setActiveCities(prev => {
      if (!prev.find(c => c.id === newCity.id)) {
        return [...prev, newCity];
      }
      return prev;
    });
  };
  
  // This simulates the FastAPI backend call and Supabase DB insert
  const runSimulation = async () => {
    if (!selectedCity) return;
    
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Backend logic (FastAPI mock)
    const { ev, renewable, publicTransport, trees } = policies;
    
    const co2_reduction = (ev * 0.4) + (renewable * 0.3) + (publicTransport * 0.2) + ((trees / 1000000) * 0.1);
    const aqi_improvement = co2_reduction * 0.8;
    const temperature_change = -(co2_reduction * 0.05);
    const sustainability_score = Math.min(100, co2_reduction + aqi_improvement);
    
    setResults({
      co2_reduction,
      aqi_improvement,
      temperature_change,
      sustainability_score
    });
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <Navbar futureMode={futureMode} setFutureMode={setFutureMode} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Command Center</h2>
            <p className="text-slate-400">Configure global policies to simulate environmental impact.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={runSimulation}
              disabled={loading || !selectedCity}
              className={`relative overflow-hidden group flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                !selectedCity 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : loading 
                    ? 'bg-emerald-500/20 text-emerald-300 cursor-wait'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]'
              }`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5 fill-current" />
              )}
              <span>{loading ? 'Simulating...' : 'Run Simulation'}</span>
            </button>
          </div>
        </div>
        
        {/* Top Split: Map & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            <CitySelector onCitySelected={handleCitySearch} />
            
            <MapSection 
              cities={activeCities} 
              selectedCity={selectedCity} 
              onSelectCity={setSelectedCity}
              policies={policies}
              futureMode={futureMode}
            />
            
            <AnimatePresence>
              {(results || loading) && (
                <motion.div
                  key="results-dashboard"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <ResultsDashboard results={results} loading={loading} futureMode={futureMode} />
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
          
          <div className="space-y-6">
            <PolicyControls policies={policies} setPolicies={setPolicies} />
            
            {/* Supabase Mock Status */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm flex items-start gap-3 text-sm">
              <Database className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-300">Database Status</p>
                <p className="text-slate-500 mt-1 leading-relaxed">
                  FastAPI is currently disconnected from Supabase. Simulations are running in-memory. Connect DB to persist results.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts Full Width */}
        <AnimatePresence mode="wait">
          {(results || loading) && (
             <motion.div
               key="charts-section"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 20 }}
             >
                <ChartsSection results={results} city={selectedCity} futureMode={futureMode} loading={loading} />
             </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
