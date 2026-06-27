"use client";
import { motion } from "framer-motion";
import {
  RiMoneyDollarCircleLine,
  RiBarChart2Line,
  RiPercentLine,
  RiPieChart2Line,
  RiBuildingLine,
  RiLineChartLine,
  RiArrowUpLine,
  RiArrowDownLine,
} from "react-icons/ri";
import { CompanyFinancialProfile, SectorBenchmark } from "@/types";
import { formatMarketCap } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: "positive" | "negative" | "neutral";
  tooltip?: string;
  badge?: string;
}

function MetricCard({ label, value, icon, trend = "neutral", badge }: MetricCardProps) {
  const valueColor =
    trend === "positive" ? "text-emerald-400" :
    trend === "negative" ? "text-rose-400" : "text-slate-200";

  return (
    <div className="glass-card rounded-xl p-4 border border-slate-800/50 flex flex-col gap-2 hover:border-slate-700/60 transition-colors group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
        <div className="p-1.5 rounded-lg bg-slate-800/60 text-slate-400 group-hover:text-slate-300 transition-colors">
          {icon}
        </div>
      </div>
      <div className={`text-xl font-bold font-mono ${valueColor}`}>
        {value}
      </div>
      {badge && (
        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded w-fit ${
          badge === "above" ? "bg-rose-500/15 text-rose-400" :
          badge === "below" ? "bg-emerald-500/15 text-emerald-400" :
          "bg-slate-700/50 text-slate-400"
        }`}>
          {badge === "above" ? "Above sector" : badge === "below" ? "Below sector" : "Inline with sector"}
        </span>
      )}
    </div>
  );
}

interface Props {
  profile?: CompanyFinancialProfile | null;
  benchmark?: SectorBenchmark | null;
}

export default function FinancialMetricsGrid({ profile, benchmark }: Props) {
  const metrics: MetricCardProps[] = [
    {
      label: "Market Cap",
      value: formatMarketCap(profile?.marketCap),
      icon: <RiMoneyDollarCircleLine className="w-3.5 h-3.5" />,
    },
    {
      label: "Revenue (TTM)",
      value: formatMarketCap(profile?.revenue),
      icon: <RiBarChart2Line className="w-3.5 h-3.5" />,
    },
    {
      label: "P/E Ratio",
      value: profile?.peRatio != null ? `${profile.peRatio.toFixed(1)}×` : "—",
      icon: <RiLineChartLine className="w-3.5 h-3.5" />,
      trend:
        profile?.peRatio == null ? "neutral" :
        profile.peRatio < (benchmark?.medianPE ?? 20) ? "positive" :
        profile.peRatio > (benchmark?.medianPE ?? 20) * 1.5 ? "negative" : "neutral",
      badge: benchmark?.companyPEvsMedian !== "unknown" ? benchmark?.companyPEvsMedian : undefined,
    },
    {
      label: "EPS (TTM)",
      value: profile?.eps != null ? `$${profile.eps.toFixed(2)}` : "—",
      icon: <RiPieChart2Line className="w-3.5 h-3.5" />,
      trend: profile?.eps == null ? "neutral" : profile.eps > 0 ? "positive" : "negative",
    },
    {
      label: "Dividend Yield",
      value: profile?.dividendYield != null ? `${(profile.dividendYield * 100).toFixed(2)}%` : "—",
      icon: <RiPercentLine className="w-3.5 h-3.5" />,
    },
    {
      label: "Beta",
      value: profile?.beta != null ? profile.beta.toFixed(2) : "—",
      icon: <RiLineChartLine className="w-3.5 h-3.5" />,
      trend: profile?.beta == null ? "neutral" : profile.beta < 1 ? "positive" : profile.beta > 1.5 ? "negative" : "neutral",
    },
    {
      label: "Op. Margin",
      value: profile?.operatingMargin != null ? `${(profile.operatingMargin * 100).toFixed(1)}%` : "—",
      icon: <RiPercentLine className="w-3.5 h-3.5" />,
      trend: profile?.operatingMargin == null ? "neutral" : profile.operatingMargin > 0.15 ? "positive" : profile.operatingMargin < 0 ? "negative" : "neutral",
    },
    {
      label: "ROE",
      value: profile?.returnOnEquity != null ? `${(profile.returnOnEquity * 100).toFixed(1)}%` : "—",
      icon: <RiBarChart2Line className="w-3.5 h-3.5" />,
      trend: profile?.returnOnEquity == null ? "neutral" : profile.returnOnEquity > 0.15 ? "positive" : profile.returnOnEquity < 0 ? "negative" : "neutral",
    },
    {
      label: "Sector",
      value: profile?.sector ?? profile?.industry ?? "—",
      icon: <RiBuildingLine className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass-card rounded-xl p-5 border border-slate-800/60 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Financial Metrics</span>
        <span className="text-[10px] text-slate-500 font-mono">Yahoo Finance · Real-time</span>
      </div>

      {!profile ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <p className="text-sm text-slate-500">Financial data unavailable</p>
            <p className="text-xs text-slate-600 mt-1">AI analysis based on training knowledge only</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <MetricCard {...m} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
