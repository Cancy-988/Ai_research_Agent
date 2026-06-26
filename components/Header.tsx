import React from 'react';
import { TrendingUp, Cpu, RefreshCw } from 'lucide-react';

interface HeaderProps {
  status: 'idle' | 'loading' | 'success' | 'failed';
  onReset?: () => void;
}

export default function Header({ status, onReset }: HeaderProps) {
  return (
    <header className="w-full border-b border-border-main bg-bg-main/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-emerald/10 rounded-xl border border-brand-emerald/20 text-brand-emerald animate-pulse">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
              AI Investment Research Agent
            </h1>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Institutional-grade analysis powered by Gemini & LangGraph
            </p>
          </div>
        </div>

        {/* Right Side: Status badge & Reset */}
        <div className="flex items-center gap-3">
          {status !== 'idle' && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${status === 'loading' ? 'animate-spin' : ''}`} />
              Reset
            </button>
          )}
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 rounded-full border border-slate-800">
            <span className={`w-2 h-2 rounded-full ${
              status === 'loading' 
                ? 'bg-amber-500 animate-ping' 
                : status === 'success' 
                  ? 'bg-brand-emerald' 
                  : status === 'failed' 
                    ? 'bg-rose-500' 
                    : 'bg-slate-500'
            }`} />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {status === 'idle' ? 'Ready' : status}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
