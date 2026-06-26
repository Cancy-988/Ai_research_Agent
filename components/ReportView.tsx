import React from 'react';
import { AnalyzeResponse } from '@/types';
import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Bookmark,
  Award,
  Zap
} from 'lucide-react';

interface ReportViewProps {
  report: AnalyzeResponse;
}

export default function ReportView({ report }: ReportViewProps) {
  const isInvest = report.recommendation === 'INVEST';
  const score = report.investmentScore;
  
  // Custom score color mapping
  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-450 stroke-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (val >= 60) return 'text-amber-450 stroke-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-455 stroke-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  const getScoreProgressColor = (val: number) => {
    if (val >= 80) return 'from-emerald-500 to-teal-400';
    if (val >= 60) return 'from-amber-500 to-orange-400';
    return 'from-rose-500 to-red-400';
  };

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      
      {/* 1. Header Card: Signal & Identity */}
      <div className={`glass-panel rounded-2xl p-6 border-l-4 shadow-xl ${
        isInvest ? 'border-l-brand-emerald' : 'border-l-rose-500'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-350 border border-slate-700 font-mono">
                AI ANALYSIS DOSSIER
              </span>
              <span className="text-xs text-slate-405">
                Generated via Gemini 2.5 Flash
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              {report.company}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {report.overview}
            </p>
          </div>

          {/* Recommendation Pill */}
          <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 min-w-[250px] justify-between sm:justify-start">
            <div className={`p-3.5 rounded-xl ${
              isInvest 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-450 border border-rose-500/20'
            }`}>
              {isInvest ? <TrendingUp className="w-8 h-8 animate-bounce-subtle" /> : <TrendingDown className="w-8 h-8" />}
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Recommendation</div>
              <div className={`text-2xl font-black ${
                isInvest ? 'text-emerald-450' : 'text-rose-455'
              }`}>
                {report.recommendation}
              </div>
              <div className="text-xs text-slate-350 mt-0.5">
                Conviction Score: <span className="font-semibold">{score}/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Score Meter and Quick Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Score Dial/Bar */}
        <div className="glass-card rounded-xl p-5 border border-slate-800/60 md:col-span-2 flex flex-col justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Quantitative Investment Score</span>
            <Award className="w-4 h-4 text-brand-emerald" />
          </div>

          <div className="my-6 space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-xs text-slate-400 font-medium">Capital Allocation Rating</span>
              <span className={`text-3xl font-black font-mono ${getScoreColor(score).split(' ')[0]}`}>
                {score}<span className="text-sm font-semibold text-slate-500">/100</span>
              </span>
            </div>
            
            {/* Visual Progress Bar */}
            <div className="w-full h-3.5 bg-slate-900 rounded-full border border-slate-800 overflow-hidden relative">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${getScoreProgressColor(score)}`}
                style={{ width: `${score}%` }}
              />
            </div>
            
            <div className="flex justify-between text-[9px] text-slate-500 font-mono font-bold">
              <span>0 (HIGH RISK)</span>
              <span>50 (NEUTRAL)</span>
              <span>100 (HIGH CONVICTION)</span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-800/40 text-[11px] text-slate-400 leading-normal flex items-start gap-2">
            <Zap className="w-3.5 h-3.5 text-brand-indigo mt-0.5 flex-shrink-0" />
            <span>Scores above 75 reflect a strong competitive position, solid balance sheet buffers, and clear industry tails.</span>
          </div>
        </div>

        {/* Quick Summary Badge */}
        <div className="glass-card rounded-xl p-5 border border-slate-800/60 flex flex-col justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Summary Matrix</span>
            <Bookmark className="w-4 h-4 text-brand-indigo" />
          </div>
          <div className="py-4 flex flex-col items-center justify-center text-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border font-bold text-lg mb-2 ${getScoreColor(score)}`}>
              {score >= 80 ? 'A' : score >= 60 ? 'B' : 'C'}
            </div>
            <div className="text-sm font-bold text-slate-205">Grade Rating</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {score >= 80 ? 'Investment Grade' : score >= 60 ? 'Speculative Hold' : 'High Risk Profile'}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/40 text-center text-[10px] text-slate-500 font-mono">
            EVALUATED BY GEMINI 2.5 FLASH
          </div>
        </div>
      </div>

      {/* 3. Strengths & Risks Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Strengths */}
        <div className="glass-card rounded-xl p-5 border border-emerald-500/10 bg-emerald-500/[0.01] space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-emerald-500/15 pb-2">
            <CheckCircle2 className="w-4 h-4" />
            Key Competitive Strengths
          </h3>
          <ul className="space-y-3.5">
            {report.strengths.map((str, idx) => (
              <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                <span className="text-emerald-450 font-bold mt-0.5">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Core Risks */}
        <div className="glass-card rounded-xl p-5 border border-rose-500/10 bg-rose-500/[0.01] space-y-4">
          <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2 border-b border-rose-500/15 pb-2">
            <AlertTriangle className="w-4 h-4" />
            Key Core Risks & Headwinds
          </h3>
          <ul className="space-y-3.5">
            {report.risks.map((risk, idx) => (
              <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                <span className="text-rose-455 font-bold mt-0.5">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Full Thesis & Reasoning */}
      <div className="glass-card rounded-xl p-5 border border-slate-800/60">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350 flex items-center gap-1.5 border-b border-slate-800/60 pb-3 mb-3">
          <Cpu className="w-4 h-4 text-brand-indigo" />
          Detailed Investment Thesis & Fundamental Reasoning
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium text-justify">
          {report.reasoning}
        </p>
      </div>

    </div>
  );
}
