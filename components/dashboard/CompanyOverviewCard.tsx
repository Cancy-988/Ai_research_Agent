"use client";
import { motion } from "framer-motion";
import { RiArrowUpLine, RiArrowDownLine, RiBuildingLine, RiStockLine } from "react-icons/ri";
import { AnalyzeResponse } from "@/types";

interface Props { report: AnalyzeResponse }

export default function CompanyOverviewCard({ report }: Props) {
  const isInvest = report.recommendation === "INVEST";
  const p = report.financialProfile;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-panel rounded-2xl p-6 border-l-4 shadow-xl ${
        isInvest ? "border-l-brand-emerald" : "border-l-rose-500"
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">

        {/* Left — company identity */}
        <div className="flex-1 space-y-3 min-w-0">
          {/* Badge row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-brand-indigo/15 text-brand-indigo border border-brand-indigo/25 font-mono uppercase">
              AI Research Dossier
            </span>
            {p?.symbol && (
              <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {p.symbol}
              </span>
            )}
            {p?.sector && (
              <span className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-slate-800/60 text-slate-400 border border-slate-700/50">
                <RiBuildingLine className="w-3 h-3" />
                {p.sector}
              </span>
            )}
            {p?.industry && (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800/60 text-slate-400 border border-slate-700/50">
                {p.industry}
              </span>
            )}
            {p?.exchange && (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 text-slate-500 border border-slate-800 font-mono">
                {p.exchange}
              </span>
            )}
          </div>

          {/* Company name */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              {report.company}
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Gemini {report.meta?.depth === "deep" ? "2.5 Pro" : "2.5 Flash"} · Yahoo Finance · LangGraph
              {report.meta?.cacheHit && <span className="ml-2 text-amber-500">· Cached</span>}
            </p>
          </div>

          {/* Overview */}
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            {report.overview}
          </p>

          {/* Price ticker strip */}
          {p?.currentPrice && (
            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5">
                <RiStockLine className="w-4 h-4 text-slate-500" />
                <span className="text-lg font-bold font-mono text-white">
                  ${p.currentPrice.toFixed(2)}
                </span>
                {p.priceChange1D != null && (
                  <span className={`text-xs font-bold font-mono ${p.priceChange1D >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {p.priceChange1D >= 0 ? "+" : ""}{p.priceChange1D.toFixed(2)}%
                  </span>
                )}
              </div>
              {p.fiftyTwoWeekLow && p.fiftyTwoWeekHigh && (
                <span className="text-xs text-slate-500 font-mono">
                  52W: ${p.fiftyTwoWeekLow.toFixed(0)} – ${p.fiftyTwoWeekHigh.toFixed(0)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right — recommendation pill */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className={`shrink-0 p-5 rounded-xl border text-center min-w-42.5 ${
            isInvest
              ? "bg-emerald-500/8 border-emerald-500/25"
              : "bg-rose-500/8 border-rose-500/25"
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3 ${
            isInvest ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
          }`}>
            {isInvest
              ? <RiArrowUpLine className="w-8 h-8" />
              : <RiArrowDownLine className="w-8 h-8" />}
          </div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">
            Recommendation
          </div>
          <div className={`text-3xl font-black tracking-tight ${isInvest ? "text-emerald-400" : "text-rose-400"}`}>
            {report.recommendation}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Score: <span className="font-bold text-slate-300">{report.investmentScore}/100</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
