'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import AnalysisForm from '@/components/AnalysisForm';
import FeaturesGrid from '@/components/FeaturesGrid';
import ReportView from '@/components/ReportView';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import WatchlistPanel from '@/components/WatchlistPanel';
import ComparisonView from '@/components/ComparisonView';
import { useResearch } from '@/hooks/useResearch';
import { CompareResponse, ResearchDepth } from '@/types';
import {
  RiCheckboxCircleLine,
  RiLoaderLine,
  RiCircleLine,
  RiErrorWarningLine,
  RiBrainLine,
  RiScalesLine,
  RiArrowLeftLine,
} from 'react-icons/ri';

// ── Comparison form state ─────────────────────────────────────────────────────

function CompareForm({
  onCompare,
  isLoading,
  onBack,
}: {
  onCompare: (a: string, b: string, depth: ResearchDepth) => void;
  isLoading: boolean;
  onBack: () => void;
}) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [depth, setDepth] = useState<ResearchDepth>('quick');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!a.trim() || !b.trim()) { setError('Please enter both company names.'); return; }
    if (a.trim().length < 2 || b.trim().length < 2) { setError('Each name must be at least 2 characters.'); return; }
    if (a.trim().toLowerCase() === b.trim().toLowerCase()) { setError('Please enter two different companies.'); return; }
    setError('');
    onCompare(a.trim(), b.trim(), depth);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-all">
          <RiArrowLeftLine className="w-4 h-4" />
        </button>
        <div>
          <h3 className="text-sm font-bold text-white">Compare 2 Companies</h3>
          <p className="text-xs text-slate-500">Both are analyzed in parallel and shown side-by-side</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['Company A', 'Company B'] as const).map((label, idx) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</label>
              <input
                type="text"
                disabled={isLoading}
                value={idx === 0 ? a : b}
                onChange={(e) => { (idx === 0 ? setA : setB)(e.target.value); setError(''); }}
                placeholder={idx === 0 ? 'e.g. Apple, AAPL' : 'e.g. Microsoft, MSFT'}
                className="w-full px-3.5 py-3 bg-slate-900/80 text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:border-brand-emerald focus:ring-brand-emerald/20 focus:outline-none focus:ring-4 transition-all text-sm"
              />
            </div>
          ))}
        </div>

        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

        <div className="grid grid-cols-2 gap-3">
          {(['quick', 'deep'] as const).map((id) => (
            <button
              key={id}
              type="button"
              disabled={isLoading}
              onClick={() => setDepth(id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                depth === id
                  ? 'bg-brand-emerald/5 border-brand-emerald'
                  : 'bg-slate-900/35 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className={`text-sm font-bold ${depth === id ? 'text-brand-emerald' : 'text-slate-200'}`}>
                {id === 'quick' ? 'Quick Pulse' : 'Deep Research'}
              </span>
              <span className="block text-xs text-slate-400 mt-0.5">
                {id === 'quick' ? '~20s per company' : '~60s per company'}
              </span>
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-linear-to-r from-brand-emerald to-teal-500 text-white font-bold shadow-lg shadow-brand-emerald/20 disabled:opacity-50 disabled:pointer-events-none transition-all"
        >
          {isLoading ? (
            <><RiLoaderLine className="w-5 h-5 animate-spin" /> Comparing…</>
          ) : (
            <><RiScalesLine className="w-5 h-5" /> Compare Companies</>
          )}
        </button>
      </form>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const { status, steps, apiReport, error, runAnalysis, resetResearch, loadCachedReport } = useResearch();

  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);
  const [compareResult, setCompareResult] = useState<CompareResponse | null>(null);

  const isLoading = status === 'loading';

  const handleCompare = useCallback(async (a: string, b: string, depth: ResearchDepth) => {
    setCompareLoading(true);
    setCompareError(null);
    setCompareResult(null);
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companies: [a, b], depth }),
      });
      const body = await res.json().catch(() => ({}));
      // 207 = one analysis succeeded, one failed — can't show a comparison
      if (res.status === 207) {
        const failMsg = (body.errors as (string | null)[])?.find(Boolean);
        throw new Error(failMsg ?? 'One analysis failed. Try again or use Single Analysis mode.');
      }
      if (!res.ok) {
        // Surface rate-limit info if present
        const msg: string = body.error ?? 'Comparison failed';
        const isQuota = msg.includes('quota') || msg.includes('429') || msg.includes('rate');
        throw new Error(isQuota
          ? 'Gemini free-tier quota reached. Wait ~1 minute and retry, or use Single Analysis mode.'
          : msg);
      }
      setCompareResult(body as CompareResponse);
    } catch (err: any) {
      setCompareError(err?.message ?? 'Comparison failed');
    } finally {
      setCompareLoading(false);
    }
  }, []);

  const handleFullReset = () => {
    resetResearch();
    setCompareMode(false);
    setCompareResult(null);
    setCompareError(null);
  };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col relative overflow-hidden font-sans">
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-brand-indigo/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-150 h-150 bg-brand-emerald/5 rounded-full blur-[140px] pointer-events-none" />

      <Header
        status={status}
        onReset={handleFullReset}
        onWatchlist={() => setWatchlistOpen(true)}
      />

      <WatchlistPanel
        open={watchlistOpen}
        onClose={() => setWatchlistOpen(false)}
        onLoad={(report) => {
          loadCachedReport(report);
          setCompareMode(false);
          setCompareResult(null);
        }}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <AnimatePresence mode="wait">

          {/* ── IDLE / FAILED — landing ── */}
          {(status === 'idle' || status === 'failed') && !compareResult && !compareLoading && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="space-y-10"
            >
              {/* Hero */}
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-indigo/10 text-brand-indigo text-xs font-bold uppercase tracking-wider rounded-full border border-brand-indigo/20">
                  <RiBrainLine className="w-3.5 h-3.5" />
                  LangGraph · Gemini · Yahoo Finance
                </div>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  AI Investment{' '}
                  <span className="bg-linear-to-r from-brand-emerald to-teal-400 bg-clip-text text-transparent">
                    Research Agent
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
                  Enter a company name. Our 5-node LangGraph pipeline fetches real financial data,
                  classifies news sentiment, and produces an institutional-grade INVEST / PASS signal.
                </p>
              </div>

              {/* Error */}
              {status === 'failed' && error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-3">
                  <RiErrorWarningLine className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-bold">Analysis Failed</div>
                    <div className="text-xs mt-1 opacity-80">{error}</div>
                  </div>
                </div>
              )}

              {/* Compare error */}
              {compareError && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-3">
                  <RiErrorWarningLine className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-bold">Comparison Failed</div>
                    <div className="text-xs mt-1 opacity-80">{compareError}</div>
                  </div>
                </div>
              )}

              {/* Form toggle */}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setCompareMode(false)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    !compareMode
                      ? 'bg-brand-emerald/10 border-brand-emerald text-brand-emerald'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  Single Analysis
                </button>
                <button
                  onClick={() => setCompareMode(true)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    compareMode
                      ? 'bg-brand-indigo/10 border-brand-indigo text-brand-indigo'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <RiScalesLine className="w-3.5 h-3.5" />
                  Compare 2 Stocks
                </button>
              </div>

              {compareMode ? (
                <CompareForm
                  onCompare={handleCompare}
                  isLoading={compareLoading}
                  onBack={() => setCompareMode(false)}
                />
              ) : (
                <AnalysisForm onSubmit={runAnalysis} isLoading={isLoading} />
              )}

              <div className="border-t border-slate-800/80 pt-8 space-y-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                  What&apos;s under the hood
                </h3>
                <FeaturesGrid />
              </div>
            </motion.div>
          )}

          {/* ── COMPARE LOADING ── */}
          {compareLoading && (
            <motion.div
              key="compare-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 space-y-4"
            >
              <div className="p-4 bg-brand-indigo/10 border border-brand-indigo/20 rounded-2xl">
                <RiScalesLine className="w-8 h-8 text-brand-indigo animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">Running Parallel Analysis</p>
                <p className="text-xs text-slate-400 mt-1">Two LangGraph pipelines running simultaneously…</p>
              </div>
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-brand-indigo animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── COMPARE RESULT ── */}
          {compareResult && !compareLoading && (
            <motion.div
              key="compare-result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ComparisonView data={compareResult} onReset={handleFullReset} />
            </motion.div>
          )}

          {/* ── LOADING — step progress + skeleton preview ── */}
          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Step progress panel */}
              <div className="max-w-lg mx-auto w-full glass-panel rounded-2xl p-6 shadow-2xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand-emerald/10 text-brand-emerald rounded-full border border-brand-emerald/20">
                    <RiLoaderLine className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Orchestrating 5-Node Pipeline</h3>
                    <p className="text-xs text-slate-400 mt-0.5">LangGraph · LangSmith tracing active</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {steps.map((s) => {
                    const done = s.status === 'completed';
                    const running = s.status === 'running';
                    return (
                      <div
                        key={s.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                          running
                            ? 'bg-slate-900/60 border-slate-700 shadow-sm'
                            : 'bg-slate-950/20 border-slate-900/40'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {done    && <RiCheckboxCircleLine className="w-4.5 h-4.5 text-brand-emerald" />}
                          {running && <RiLoaderLine className="w-4.5 h-4.5 text-brand-indigo animate-spin" />}
                          {!done && !running && <RiCircleLine className="w-4.5 h-4.5 text-slate-700" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center gap-2">
                            <span className={`text-xs font-semibold truncate ${
                              running ? 'text-white' : done ? 'text-slate-300' : 'text-slate-500'
                            }`}>{s.label}</span>
                            {done    && <span className="text-[10px] font-bold text-brand-emerald font-mono shrink-0">Done</span>}
                            {running && <span className="text-[10px] font-bold text-brand-indigo font-mono animate-pulse shrink-0">Running</span>}
                          </div>
                          {s.message && (done || running) && (
                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">{s.message}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dimmed skeleton preview */}
              <div className="opacity-25 pointer-events-none select-none">
                <DashboardSkeleton />
              </div>
            </motion.div>
          )}

          {/* ── SUCCESS — full dashboard ── */}
          {status === 'success' && apiReport && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ReportView report={apiReport} onReset={handleFullReset} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <footer className="w-full border-t border-slate-900 py-5 text-center text-xs text-slate-600 relative z-10">
        EquityLens · AI Investment Research Agent · Not financial advice
      </footer>
    </div>
  );
}
