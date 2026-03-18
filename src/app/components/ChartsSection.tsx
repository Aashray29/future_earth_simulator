import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SimulationResult, City } from '../types';

interface ChartsSectionProps {
  results: SimulationResult | null;
  city: City | null;
  futureMode: boolean;
  loading?: boolean;
}

export function ChartsSection({ results, city, futureMode, loading }: ChartsSectionProps) {
  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-4 border border-emerald-500/20 bg-slate-900/40 rounded-2xl backdrop-blur-sm">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-blue-400 font-mono text-sm animate-pulse">Generating Forecasts...</p>
      </div>
    );
  }

  if (!results || !city) {
    return (
      <div className="h-64 flex items-center justify-center border border-slate-700/50 bg-slate-900/40 rounded-2xl backdrop-blur-sm">
        <p className="text-slate-500 text-sm">Waiting for simulation data...</p>
      </div>
    );
  }

  // Generate mock projection data based on results
  const currentYear = new Date().getFullYear();
  const baseCo2 = city.baseline_co2;
  const baseAqi = city.baseline_aqi;
  
  const targetYear = futureMode ? 2035 : currentYear + 5;
  const data = [];
  
  const years = targetYear - currentYear;
  for (let i = 0; i <= years; i++) {
    const progress = i / years;
    const futureMultiplier = futureMode ? 1.5 : 1; // Accelerated impact in future mode
    
    // Linearly interpolate between baseline and target simulation result
    const projectedCo2Reduction = (results.co2_reduction * progress * futureMultiplier);
    const co2 = Math.max(0, baseCo2 * (1 - projectedCo2Reduction / 100));
    
    const projectedAqiImprovement = (results.aqi_improvement * progress * futureMultiplier);
    const aqi = Math.max(0, baseAqi - projectedAqiImprovement);
    
    data.push({
      year: currentYear + i,
      'CO2 Levels (Mt)': Number(co2.toFixed(1)),
      'AQI Score': Number(aqi.toFixed(1)),
    });
  }

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl h-80 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-blue-500/5 opacity-50 pointer-events-none transition-opacity group-hover:opacity-100 duration-500"></div>
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-100 font-semibold flex items-center gap-2 relative z-10">
          <span className="w-2 h-6 bg-blue-500 rounded-sm inline-block"></span>
          Environmental Projection {futureMode && <span className="text-cyan-400 text-xs px-2 py-0.5 border border-cyan-500/30 bg-cyan-500/10 rounded-full">2035 Mode Active</span>}
        </h3>
      </div>
      
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
            <defs key="chart-defs">
              <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid key="chart-grid" strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis key="chart-xaxis" dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis key="chart-yaxis" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              key="chart-tooltip"
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f1f5f9' }}
              itemStyle={{ fontSize: '14px', fontWeight: '500' }}
            />
            <Area
              key="chart-area-co2"
              type="monotone"
              dataKey="CO2 Levels (Mt)"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCo2)"
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#0f172a', strokeWidth: 2 }}
            />
            <Area
              key="chart-area-aqi"
              type="monotone"
              dataKey="AQI Score"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAqi)"
              activeDot={{ r: 6, fill: '#10b981', stroke: '#0f172a', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
