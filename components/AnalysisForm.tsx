"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  RiSearchLine,
  RiQuestionLine,
  RiArrowRightLine,
  RiLoaderLine,
} from "react-icons/ri";
import { ResearchDepth } from "@/types";

interface Props {
  onSubmit: (ticker: string, depth: ResearchDepth, context: string) => void;
  isLoading: boolean;
}

const POPULAR = ["AAPL", "MSFT", "NVDA", "TSLA", "AMZN", "GOOGL", "RELIANCE.NS", "META"];

export default function AnalysisForm({ onSubmit, isLoading }: Props) {
  const [ticker, setTicker] = useState("");
  const [depth, setDepth] = useState<ResearchDepth>("quick");
  const [context, setContext] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) { setError("Please enter a company name or ticker."); return; }
    if (ticker.trim().length < 2) { setError("Name must be at least 2 characters."); return; }
    setError("");
    onSubmit(ticker.trim(), depth, context);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-emerald/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-indigo/10 rounded-full blur-3xl pointer-events-none" />

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

        {/* Search field */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            Company Name or Ticker
          </label>
          <div className="relative">
            <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              disabled={isLoading}
              value={ticker}
              onChange={(e) => { setTicker(e.target.value); if (error) setError(""); }}
              placeholder="e.g. Apple, AAPL, NVDA, Reliance..."
              className={`w-full pl-11 pr-4 py-3.5 bg-slate-900/80 text-white placeholder-slate-500 rounded-xl border ${
                error
                  ? "border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-800 focus:border-brand-emerald focus:ring-brand-emerald/20"
              } focus:outline-none focus:ring-4 transition-all`}
            />
          </div>
          {error && <p className="mt-1.5 text-xs text-rose-400 font-medium">{error}</p>}

          {/* Quick picks */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Try:</span>
            {POPULAR.map((sym) => (
              <button
                key={sym}
                type="button"
                disabled={isLoading}
                onClick={() => { setTicker(sym); setError(""); }}
                className={`text-xs px-2.5 py-1 rounded-md border font-mono transition-all ${
                  ticker.toUpperCase() === sym
                    ? "bg-brand-emerald/10 border-brand-emerald text-brand-emerald"
                    : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        {/* Depth toggle */}
        <div>
          <span className="block text-sm font-semibold text-slate-200 mb-2">Analysis Depth</span>
          <div className="grid grid-cols-2 gap-3">
            {([
              { id: "quick", title: "Quick Pulse", sub: "Fast AI scan · Gemini 2.5 Flash · ~20s", color: "brand-emerald" },
              { id: "deep",  title: "Deep Research", sub: "Full thesis · Gemini 2.5 Pro · ~60s", color: "brand-indigo" },
            ] as const).map(({ id, title, sub, color }) => (
              <button
                key={id}
                type="button"
                disabled={isLoading}
                onClick={() => setDepth(id)}
                className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                  depth === id
                    ? `bg-${color}/5 border-${color} shadow-lg shadow-${color}/5`
                    : "bg-slate-900/35 border-slate-800 hover:border-slate-700"
                }`}
              >
                <span className={`text-sm font-bold ${depth === id ? `text-${color}` : "text-slate-200"}`}>
                  {title}
                </span>
                <span className="text-xs text-slate-400 mt-1">{sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Extra context */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <label className="block text-sm font-semibold text-slate-200">
              Additional Instructions
            </label>
            <div className="group relative">
              <RiQuestionLine className="w-3.5 h-3.5 text-slate-500 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2 bg-slate-950 text-slate-300 text-xs rounded border border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 shadow-xl">
                Guide the AI — e.g. "Focus on AI revenue growth" or "Highlight debt risks."
              </div>
            </div>
          </div>
          <textarea
            rows={2}
            disabled={isLoading}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Focus on margin expansion, regulatory risk, or competitive moat..."
            className="w-full px-4 py-3 bg-slate-900/80 text-white placeholder-slate-600 rounded-xl border border-slate-800 focus:border-brand-emerald focus:ring-brand-emerald/20 focus:outline-none focus:ring-4 transition-all resize-none"
          />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-linear-to-r from-brand-emerald to-teal-500 hover:from-brand-emerald-hover hover:to-teal-600 text-white font-bold tracking-wide shadow-lg shadow-brand-emerald/20 focus:outline-none focus:ring-4 focus:ring-brand-emerald/35 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
        >
          {isLoading ? (
            <><RiLoaderLine className="w-5 h-5 animate-spin" /> Processing Analysis...</>
          ) : (
            <>Generate Research Report <RiArrowRightLine className="w-5 h-5" /></>
          )}
        </motion.button>
      </form>
    </div>
  );
}
