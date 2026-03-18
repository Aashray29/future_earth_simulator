import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { SimulationResult } from '../types';
import { Wind, ThermometerSnowflake, Activity, Leaf } from 'lucide-react';

interface ResultsDashboardProps {
  results: SimulationResult | null;
  loading: boolean;
  futureMode: boolean;
}

const AnimatedNumber = ({ value, formatter }: { value: number; formatter: (n: number) => string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrameId: number;
    const duration = 1000;
    
    const startValue = displayValue;
    const endValue = value;

    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentVal = startValue + (endValue - startValue) * easeOutQuart;
      
      setDisplayValue(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

  return <span>{formatter(displayValue)}</span>;
};

export function ResultsDashboard({ results, loading, futureMode }: ResultsDashboardProps) {
  if (loading) {
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center gap-4 border border-emerald-500/20 bg-slate-900/40 rounded-2xl backdrop-blur-sm">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-emerald-400 font-mono text-sm animate-pulse">Running Simulation Model...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="w-full h-48 flex items-center justify-center border border-slate-700/50 bg-slate-900/40 rounded-2xl backdrop-blur-sm">
        <p className="text-slate-400">Select policies and run simulation.</p>
      </div>
    );
  }

  const metrics = [
    {
      label: 'CO₂ Reduction',
      value: results.co2_reduction,
      icon: Wind,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      format: (n: number) => `-${n.toFixed(1)}%`
    },
    {
      label: 'AQI Improvement',
      value: results.aqi_improvement,
      icon: Activity,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      format: (n: number) => `+${Math.round(n)} pts`
    },
    {
      label: 'Temp Change',
      value: results.temperature_change,
      icon: ThermometerSnowflake,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      format: (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(2)}°C`
    },
    {
      label: 'Sustainability',
      value: results.sustainability_score,
      icon: Leaf,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      format: (n: number) => `${Math.round(n)}/100`
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            key={m.label}
            className={`p-5 rounded-2xl border ${m.border} ${m.bg} backdrop-blur-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group`}
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-current opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity ${m.color}`}></div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 mb-4 ${m.bg}`}>
              <Icon className={`w-5 h-5 ${m.color}`} />
            </div>
            
            <p className="text-slate-400 text-sm font-medium mb-1">{m.label}</p>
            <div className={`text-2xl lg:text-3xl font-bold tracking-tight font-mono ${m.color}`}>
              <AnimatedNumber value={m.value} formatter={m.format} />
            </div>
            
            {futureMode && (
              <div className="mt-2 text-xs font-mono opacity-80 flex items-center gap-1">
                <span className="text-slate-500">2035:</span> 
                <span className={m.color}>{m.format(m.value * 1.5)}</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
