import React from 'react';
import { Navigation } from 'lucide-react';
import { City, Policies } from '../types';
import { Earth3D } from './Earth3D';

interface MapSectionProps {
  cities: City[];
  selectedCity: City | null;
  onSelectCity: (city: City) => void;
  policies: Policies;
  futureMode: boolean;
}

export function MapSection({ cities, selectedCity, onSelectCity, policies, futureMode }: MapSectionProps) {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] bg-slate-950 border border-slate-700/50 rounded-2xl overflow-hidden shadow-[inset_0_0_100px_rgba(16,185,129,0.05)] flex items-center justify-center">
      {/* Abstract Tech Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0,transparent_100%)] pointer-events-none"></div>
      
      <Earth3D 
        policies={policies}
        futureMode={futureMode}
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={onSelectCity}
      />

      {/* Control Panel Header inside Map */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
         <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-700 backdrop-blur-sm text-sm font-medium text-slate-300">
           <Navigation className="w-4 h-4 text-emerald-500" />
           <span>Interactive 3D Simulation</span>
         </div>
         <div className="text-xs text-slate-500 bg-slate-900/60 p-2 rounded-lg border border-slate-700/50 backdrop-blur-sm inline-flex">
           Drag to rotate • Scroll to zoom
         </div>
      </div>
    </div>
  );
}
