"use client";
import { motion } from "framer-motion";
import {
  RiTrophyLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiRefreshLine,
} from "react-icons/ri";
import { CompareResponse, AnalyzeResponse } from "@/types";

interface Props {
  data: CompareResponse;
  onReset: () => void;
}

function fmt(n?: number | null, prefix = "", suffix = "", decimals = 1): string {
  if (n == null || isNaN(n)) return "—";
  if (Math.abs(n) >= 1e12) return `${prefix}${(n / 1e12).toFixed(1)}T${suffix}`;
  if (Math.abs(n) >= 1e9) return `${prefix}${(n / 1e9).toFixed(1)}B${suffix}`;
  if (Math.abs(n) >= 1e6) return `${prefix}${(n / 1e6).toFixed(1)}M${suffix}`;
  return `${prefix}${n.toFixed(decimals)}${suffix}`;
}

function ScoreBar({ score, isInvest }: { score: number; isInvest: boolean }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">Investment Score</span>
        <span className={`font-bold ${isInvest ? "text-emerald-400" : "text-rose-400"}`}>{score}/100</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${
            score >= 65 ? "bg-emerald-500" : score >= 40 ? "bg-amber-500" : "bg-rose-500"
          }`}
        />
      </div>
    </div>
  );
}

function CompanyCard({ report, isWinner }: { report: AnalyzeResponse; isWinner: boolean }) {
  const isInvest = report.recommendation === "INVEST";
  const p = report.financialProfile;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-panel rounded-2xl p-5 space-y-5 relative overflow-hidden ${
        isWinner ? "border border-amber-500/30 shadow-amber-500/10 shadow-lg" : ""
      }`}
    >
      {isWinner && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-amber-500/15 border border-amber-500/25 rounded-full">
          <RiTrophyLine className="w-3 h-3 text-amber-400" />
          <span className="text-[10px] font-bold text-amber-400">WINNER</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {p?.symbol && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
              {p.symbol}
            </span>
          )}
          {p?.exchange && (
            <span className="text-[10px] font-mono text-slate-500">{p.exchange}</span>
          )}
        </div>
        <h2 className="text-xl font-black text-white leading-tight">{report.company}</h2>
        {p?.sector && <p className="text-xs text-slate-500 mt-0.5">{p.sector} · {p.industry}</p>}
      </div>

      {/* Recommendation */}
      <div className={`flex items-center gap-3 p-3 rounded-xl ${
        isInvest ? "bg-emerald-500/8 border border-emerald-500/20" : "bg-rose-500/8 border border-rose-500/20"
      }`}>
        <div className={`p-2 rounded-lg ${isInvest ? "bg-emerald-500/15" : "bg-rose-500/15"}`}>
          {isInvest
            ? <RiArrowUpLine className="w-5 h-5 text-emerald-400" />
            : <RiArrowDownLine className="w-5 h-5 text-rose-400" />}
        </div>
        <div>
          <div className={`text-lg font-black ${isInvest ? "text-emerald-400" : "text-rose-400"}`}>
            {report.recommendation}
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">Recommendation</div>
        </div>
      </div>

      {/* Score bar */}
      <ScoreBar score={report.investmentScore} isInvest={isInvest} />

      {/* Financial metrics */}
      {p && (
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "Market Cap", value: fmt(p.marketCap, "$") },
            { label: "Revenue (TTM)", value: fmt(p.revenue, "$") },
            { label: "P/E Ratio", value: p.peRatio ? p.peRatio.toFixed(1) + "x" : "—" },
            { label: "EPS", value: fmt(p.eps, "$") },
            { label: "Div Yield", value: p.dividendYield ? (p.dividendYield * 100).toFixed(1) + "%" : "—" },
            { label: "Current Price", value: p.currentPrice ? `$${p.currentPrice.toFixed(2)}` : "—" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-800/60">
              <div className="text-[10px] text-slate-500 mb-0.5">{label}</div>
              <div className="text-sm font-bold text-white">{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Strengths */}
      {report.strengths.length > 0 && (
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">
            Key Strengths
          </div>
          <ul className="space-y-1.5">
            {report.strengths.slice(0, 3).map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-bold">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risks */}
      {report.risks.length > 0 && (
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mb-2">
            Key Risks
          </div>
          <ul className="space-y-1.5">
            {report.risks.slice(0, 2).map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                <span className="mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center rounded-full bg-rose-500/15 text-rose-400 text-[9px] font-bold">
                  {i + 1}
                </span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reasoning snippet */}
      <div className="border-t border-slate-800 pt-3">
        <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-4">
          {report.reasoning}
        </p>
      </div>
    </motion.div>
  );
}

export default function ComparisonView({ data, onReset }: Props) {
  const [a, b] = data.companies;

  return (
    <div className="space-y-6">
      {/* Winner banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel rounded-2xl p-4 text-center border border-amber-500/20"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <RiTrophyLine className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-bold text-white">Comparison Result</span>
        </div>
        <p className="text-xs text-slate-400">
          <span className="text-amber-400 font-bold">{data.winner}</span> scores{" "}
          <span className="text-white font-bold">{data.delta} points</span> higher
          {data.delta === 0 && " — tied match"}
        </p>
      </motion.div>

      {/* Side-by-side cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CompanyCard report={a} isWinner={a.company === data.winner} />
        <CompanyCard report={b} isWinner={b.company === data.winner} />
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center"
      >
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-slate-800/60 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all"
        >
          <RiRefreshLine className="w-4 h-4" />
          New Analysis
        </button>
      </motion.div>
    </div>
  );
}
