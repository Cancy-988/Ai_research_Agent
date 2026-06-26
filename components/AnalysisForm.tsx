import React, { useState } from 'react';
import { Search, Info, HelpCircle, ArrowRight, Loader2 } from 'lucide-react';
import { ResearchDepth } from '@/types';

interface AnalysisFormProps {
  onSubmit: (ticker: string, depth: ResearchDepth, context: string) => void;
  isLoading: boolean;
}

const POPULAR_TICKERS = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL'];

export default function AnalysisForm({ onSubmit, isLoading }: AnalysisFormProps) {
  const [ticker, setTicker] = useState('');
  const [depth, setDepth] = useState<ResearchDepth>('quick');
  const [context, setContext] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) {
      setError('Please enter a company name or ticker symbol.');
      return;
    }
    setError('');
    onSubmit(ticker.trim().toUpperCase(), depth, context);
  };

  const selectSuggestedTicker = (symbol: string) => {
    if (isLoading) return;
    setTicker(symbol);
    setError('');
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Background radial accent glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-emerald/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-indigo/10 rounded-full blur-3xl pointer-events-none" />

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        {/* Ticker Search Field */}
        <div>
          <label htmlFor="ticker" className="block text-sm font-semibold text-slate-200 mb-2">
            Company Ticker or Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              id="ticker"
              disabled={isLoading}
              value={ticker}
              onChange={(e) => {
                setTicker(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. AAPL, Microsoft, NVDA..."
              className={`w-full pl-11 pr-4 py-3.5 bg-slate-900/80 text-white placeholder-slate-500 rounded-xl border ${
                error ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-800 focus:border-brand-emerald focus:ring-brand-emerald/20'
              } focus:outline-none focus:ring-4 transition-all duration-200`}
            />
          </div>
          {error && <p className="mt-1.5 text-xs text-rose-400 font-medium">{error}</p>}

          {/* Quick Suggestions */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Quick suggestions:</span>
            {POPULAR_TICKERS.map((symbol) => (
              <button
                key={symbol}
                type="button"
                disabled={isLoading}
                onClick={() => selectSuggestedTicker(symbol)}
                className={`text-xs px-2.5 py-1 rounded-md border font-mono transition-all ${
                  ticker.toUpperCase() === symbol
                    ? 'bg-brand-emerald/10 border-brand-emerald text-brand-emerald'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>

        {/* Depth Option */}
        <div>
          <span className="block text-sm font-semibold text-slate-200 mb-2">
            Analysis Depth
          </span>
          <div className="grid grid-cols-2 gap-3.5">
            {/* Quick Option */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setDepth('quick')}
              className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                depth === 'quick'
                  ? 'bg-brand-emerald/5 border-brand-emerald shadow-lg shadow-brand-emerald/5'
                  : 'bg-slate-900/35 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className={`text-sm font-bold ${depth === 'quick' ? 'text-brand-emerald' : 'text-slate-200'}`}>
                Quick Pulse
              </span>
              <span className="text-xs text-slate-400 mt-1 leading-relaxed">
                Aggregates high-level metrics and general sentiment. (~15s)
              </span>
            </button>

            {/* Deep Option */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setDepth('deep')}
              className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                depth === 'deep'
                  ? 'bg-brand-indigo/5 border-brand-indigo shadow-lg shadow-brand-indigo/5'
                  : 'bg-slate-900/35 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className={`text-sm font-bold ${depth === 'deep' ? 'text-brand-indigo' : 'text-slate-200'}`}>
                Deep Research
              </span>
              <span className="text-xs text-slate-400 mt-1 leading-relaxed">
                Full SWOT, core financial indicators, and thematic sentiment. (~45s)
              </span>
            </button>
          </div>
        </div>

        {/* Focus / Extra Context */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <label htmlFor="context" className="block text-sm font-semibold text-slate-200">
              Additional Research Instructions
            </label>
            <div className="group relative">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-950 text-slate-300 text-xs rounded border border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 shadow-xl pointer-events-none leading-normal">
                Guide the AI, e.g. "Focus on valuation ratios" or "Highlight regulatory concerns".
              </div>
            </div>
          </div>
          <textarea
            id="context"
            rows={3}
            disabled={isLoading}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Focus on the impact of their new AI segment, balance sheet leverage, or general margin health..."
            className="w-full px-4 py-3 bg-slate-900/80 text-white placeholder-slate-650 rounded-xl border border-slate-800 focus:border-brand-emerald focus:ring-brand-emerald/20 focus:outline-none focus:ring-4 transition-all duration-200 resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-brand-emerald to-teal-500 hover:from-brand-emerald-hover hover:to-teal-600 text-white font-bold tracking-wide shadow-lg shadow-brand-emerald/20 hover:shadow-brand-emerald/30 focus:outline-none focus:ring-4 focus:ring-brand-emerald/35 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Analysis...
            </>
          ) : (
            <>
              Generate Research Report
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
