'use html';
'use client';

import React from 'react';
import Header from '@/components/Header';
import AnalysisForm from '@/components/AnalysisForm';
import FeaturesGrid from '@/components/FeaturesGrid';
import ReportView from '@/components/ReportView';
import { useResearch } from '@/hooks/useResearch';
import { 
  CheckCircle2, 
  Loader2, 
  Circle, 
  AlertCircle, 
  ChevronRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

export default function Home() {
  const { 
    status, 
    steps, 
    apiReport, 
    error, 
    runAnalysis, 
    resetResearch 
  } = useResearch();

  const isLoading = status === 'loading';

  return (
    <div className="min-h-screen bg-bg-main flex flex-col relative overflow-hidden font-sans">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-indigo/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-emerald/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header bar */}
      <Header status={status} onReset={resetResearch} />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 relative z-10 flex flex-col justify-center">
        
        {/* State 1: Idle or Failed (Form input & features) */}
        {(status === 'idle' || status === 'failed') && (
          <div className="space-y-10 animate-fade-in">
            {/* Title Hero */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-indigo/10 text-brand-indigo text-xs font-bold uppercase tracking-wider rounded-full border border-brand-indigo/20">
                <BrainCircuit className="w-3.5 h-3.5" />
                Next-Gen Quant Intel
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                AI Investment <span className="bg-gradient-to-r from-brand-emerald to-teal-400 bg-clip-text text-transparent">Research Agent</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto font-medium">
                Generate professional equity research dossiers instantly. Our LangGraph-orchestrated workflows synthesize financial metrics, sentiment scanning, and SWOT modeling.
              </p>
            </div>

            {/* Error Message */}
            {status === 'failed' && error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-455 rounded-xl flex items-start gap-3 shadow-lg">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-bold">Analysis Failed</div>
                  <div className="text-xs text-rose-400 mt-1">{error}</div>
                </div>
              </div>
            )}

            {/* Input Form Panel */}
            <AnalysisForm onSubmit={runAnalysis} isLoading={isLoading} />

            {/* Features Info Section */}
            <div className="border-t border-slate-800/80 pt-8 space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                Agent Orchestration Pipelines
              </h3>
              <FeaturesGrid />
            </div>
          </div>
        )}

        {/* State 2: Processing (Multi-step loader) */}
        {status === 'loading' && (
          <div className="max-w-md mx-auto w-full glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8 animate-pulse-subtle">
            <div className="text-center space-y-3">
              <div className="relative inline-flex items-center justify-center p-4 bg-brand-emerald/10 text-brand-emerald rounded-full border border-brand-emerald/20">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Orchestrating Agent Workflow
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Connecting nodes, fetching financial APIs, and formulating SWOT matrix. Please do not close this window.
              </p>
            </div>

            {/* Steps Container */}
            <div className="space-y-4">
              {steps.map((step, idx) => {
                const isPending = step.status === 'pending';
                const isRunning = step.status === 'running';
                const isCompleted = step.status === 'completed';

                return (
                  <div 
                    key={step.id} 
                    className={`flex items-start gap-4 p-3.5 rounded-xl border transition-all duration-305 ${
                      isRunning 
                        ? 'bg-slate-900/60 border-slate-700 shadow-md shadow-brand-emerald/5' 
                        : 'bg-slate-950/20 border-slate-900/60'
                    }`}
                  >
                    {/* Status Circle */}
                    <div className="mt-0.5">
                      {isCompleted && <CheckCircle2 className="w-5 h-5 text-brand-emerald" />}
                      {isRunning && <Loader2 className="w-5 h-5 text-brand-indigo animate-spin" />}
                      {isPending && <Circle className="w-5 h-5 text-slate-700" />}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-semibold truncate ${
                          isRunning ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                        }`}>
                          {step.label}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-bold text-brand-emerald uppercase tracking-wider font-mono">
                            Done
                          </span>
                        )}
                        {isRunning && (
                          <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider animate-pulse font-mono">
                            Running
                          </span>
                        )}
                      </div>
                      
                      {/* Optional message info */}
                      {step.message && (isRunning || isCompleted) && (
                        <p className="text-xs text-slate-450 mt-1 leading-normal truncate">
                          {step.message}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* State 3: Report Results */}
        {status === 'success' && apiReport && (
          <div className="space-y-6">
            <ReportView report={apiReport} />
            
            {/* Action Bar */}
            <div className="flex justify-center pt-4">
              <button
                onClick={resetResearch}
                className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-slate-800 hover:bg-slate-705 border border-slate-700 text-slate-200 transition-all shadow-md cursor-pointer hover:text-white"
              >
                Perform Another Research Analysis
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-6 text-center text-xs text-slate-500 relative z-10 bg-bg-main/40">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} AI Investment Research Agent. Built for quantitative equity analysis.</p>
        </div>
      </footer>
    </div>
  );
}
