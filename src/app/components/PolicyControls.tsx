import React from 'react';
import { Policies } from '../types';
import { BatteryCharging, TreePine, Sun, Train } from 'lucide-react';

interface PolicyControlsProps {
  policies: Policies;
  setPolicies: React.Dispatch<React.SetStateAction<Policies>>;
}

export function PolicyControls({ policies, setPolicies }: PolicyControlsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPolicies(prev => ({ ...prev, [name]: Number(value) }));
  };

  const controls = [
    {
      id: 'ev',
      name: 'ev',
      label: 'EV Adoption',
      icon: BatteryCharging,
      min: 0,
      max: 100,
      value: policies.ev,
      unit: '%',
      color: 'text-blue-400',
      bgHover: 'group-hover:text-blue-300'
    },
    {
      id: 'trees',
      name: 'trees',
      label: 'Trees Planted',
      icon: TreePine,
      min: 0,
      max: 10000000,
      value: policies.trees,
      unit: '',
      color: 'text-emerald-400',
      bgHover: 'group-hover:text-emerald-300',
      format: (val: number) => (val / 1000000).toFixed(1) + 'M'
    },
    {
      id: 'renewable',
      name: 'renewable',
      label: 'Renewable Energy',
      icon: Sun,
      min: 0,
      max: 100,
      value: policies.renewable,
      unit: '%',
      color: 'text-yellow-400',
      bgHover: 'group-hover:text-yellow-300'
    },
    {
      id: 'publicTransport',
      name: 'publicTransport',
      label: 'Public Transport',
      icon: Train,
      min: 0,
      max: 100,
      value: policies.publicTransport,
      unit: '%',
      color: 'text-purple-400',
      bgHover: 'group-hover:text-purple-300'
    }
  ];

  return (
    <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm shadow-xl">
      <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-emerald-500 rounded-sm inline-block"></span>
        Policy Controls
      </h2>
      
      <div className="space-y-8">
        {controls.map((ctrl) => {
          const Icon = ctrl.icon;
          return (
            <div key={ctrl.id} className="group relative">
              <div className="flex justify-between items-center mb-3 text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-slate-800 border border-slate-700 transition-colors ${ctrl.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm">{ctrl.label}</span>
                </div>
                <div className="px-3 py-1 bg-slate-800 rounded-md font-mono text-sm border border-slate-700 text-emerald-400 font-bold">
                  {ctrl.format ? ctrl.format(ctrl.value) : `${ctrl.value}${ctrl.unit}`}
                </div>
              </div>
              
              <div className="relative pt-1">
                <input
                  type="range"
                  name={ctrl.name}
                  min={ctrl.min}
                  max={ctrl.max}
                  value={ctrl.value}
                  onChange={handleChange}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  style={{
                    background: `linear-gradient(to right, #10b981 ${(ctrl.value - ctrl.min) / (ctrl.max - ctrl.min) * 100}%, #1e293b ${(ctrl.value - ctrl.min) / (ctrl.max - ctrl.min) * 100}%)`
                  }}
                />
                {/* Custom thumb styles using Tailwind are hard for cross-browser, using inline style mostly for track */}
                <style dangerouslySetInnerHTML={{__html: `
                  input[type=range]::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: #10b981;
                    border: 2px solid #0f172a;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
                    transition: all 0.2s ease;
                  }
                  input[type=range]::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    background: #34d399;
                  }
                `}} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
