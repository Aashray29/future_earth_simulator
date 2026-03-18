import React from 'react';
import { Globe2, Sparkles } from 'lucide-react';

interface NavbarProps {
  futureMode: boolean;
  setFutureMode: (val: boolean) => void;
}

export function Navbar({ futureMode, setFutureMode }: NavbarProps) {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-emerald-500/20 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
          <Globe2 className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">
            Future Earth Simulator
          </h1>
          <p className="text-xs text-emerald-400 font-medium tracking-wider uppercase">
            Global Impact Forecaster
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
          <Sparkles className={`w-4 h-4 ${futureMode ? 'text-cyan-400' : 'text-slate-500'}`} />
          <span className="text-sm font-medium text-slate-300">Future Mode (2035)</span>
          <button
            onClick={() => setFutureMode(!futureMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              futureMode ? 'bg-cyan-500' : 'bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                futureMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
