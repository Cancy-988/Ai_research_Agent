'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import AnalysisForm from '@/components/AnalysisForm';
import FeaturesGrid from '@/components/FeaturesGrid';
import ReportView from '@/components/ReportView';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import { useResearch } from '@/hooks/useResearch';
import {
  RiCheckboxCircleLine,
  RiLoaderLine,
  RiCircleLine,
  RiErrorWarningLine,
  RiBrainLine,
} from 'react-icons/ri';

export default function Home() {
  const { status, steps, apiReport, error, runAnalysis, resetResearch } = useResearch();
  const isLoading = status === 'loading';

  return (
    <div className="min-h-screen bg-bg-main flex flex-col relative overflow-hidden font-sans">
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-indigo/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-emerald/5 rounded-full blur-[140px] pointer-events-none" />

      <Header status={status} onReset={resetResearch} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <AnimatePresence mode="wait">

          {/* ── IDLE / FAILED — landing ── */}
          {(status === 'idle' || status === 'failed') && (
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

              <AnalysisForm onSubmit={runAnalysis} isLoading={isLoading} />

              <div className="border-t border-slate-800/80 pt-8 space-y-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                  What's under the hood
                </h3>
                <FeaturesGrid />
              </div>
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
              <ReportView report={apiReport} onReset={resetResearch} />
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
