"use client";
import { motion } from "framer-motion";
import { RiAwardLine } from "react-icons/ri";

interface Props {
  score: number;
  recommendation: "INVEST" | "PASS";
}

// Arc geometry — 270° gauge, cx=100, cy=100, r=72
const CX = 100, CY = 100, R = 72;
const CIRCUMFERENCE = 2 * Math.PI * R; // ≈ 452.39
const ARC_270 = (270 / 360) * CIRCUMFERENCE; // ≈ 339.29

// Path for a 270° arc starting at 135° (lower-left) ending at 45° (lower-right)
function arcPath(cx: number, cy: number, r: number): string {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const sx = cx + r * Math.cos(toRad(135));
  const sy = cy + r * Math.sin(toRad(135));
  const ex = cx + r * Math.cos(toRad(45));
  const ey = cy + r * Math.sin(toRad(45));
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 1 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
}

const BG_PATH = arcPath(CX, CY, R);

function scoreColor(s: number) {
  if (s >= 75) return { hex: "#10b981", text: "text-emerald-400" };
  if (s >= 50) return { hex: "#f59e0b", text: "text-amber-400" };
  return { hex: "#f43f5e", text: "text-rose-400" };
}

function gradeLabel(s: number) {
  if (s >= 80) return { grade: "A", label: "Investment Grade" };
  if (s >= 65) return { grade: "B", label: "Moderate Buy" };
  if (s >= 50) return { grade: "C", label: "Speculative" };
  return { grade: "D", label: "High Risk" };
}

export default function InvestmentScoreGauge({ score, recommendation }: Props) {
  const { hex, text } = scoreColor(score);
  const { grade, label } = gradeLabel(score);
  const isInvest = recommendation === "INVEST";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-card rounded-xl p-5 border border-slate-800/60 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Investment Score</span>
        <RiAwardLine className="text-brand-emerald w-4 h-4" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <svg viewBox="0 0 200 175" className="w-full max-w-[220px]" aria-label={`Score ${score}/100`}>
          {/* Background arc */}
          <path d={BG_PATH} fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />

          {/* Animated value arc using pathLength */}
          <motion.path
            d={BG_PATH}
            fill="none"
            stroke={hex}
            strokeWidth="10"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${hex}55)` }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: score / 100 }}
            transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
          />

          {/* Zone labels */}
          <text x="30" y="166" fill="#475569" fontSize="9" textAnchor="middle" fontFamily="monospace">0</text>
          <text x="100" y="24" fill="#475569" fontSize="9" textAnchor="middle" fontFamily="monospace">50</text>
          <text x="170" y="166" fill="#475569" fontSize="9" textAnchor="middle" fontFamily="monospace">100</text>

          {/* Grade */}
          <text x={CX} y={CY - 14} fill={hex} fontSize="13" fontWeight="700" textAnchor="middle">
            Grade {grade}
          </text>

          {/* Score number */}
          <motion.text
            x={CX} y={CY + 16}
            fill={hex}
            fontSize="40"
            fontWeight="900"
            textAnchor="middle"
            fontFamily="monospace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.text>
          <text x={CX} y={CY + 32} fill="#475569" fontSize="11" textAnchor="middle">/ 100</text>
        </svg>

        <div className={`mt-1 text-sm font-bold ${text}`}>{label}</div>
        <div className="text-xs text-slate-500 mt-1 text-center leading-tight">
          {score >= 75 ? "Strong conviction signal" : score >= 50 ? "Moderate investment case" : "Elevated risk profile"}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/40 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-mono uppercase">Quant Score</span>
        <span className={`text-[11px] font-black ${isInvest ? "text-emerald-400" : "text-rose-400"}`}>
          {recommendation}
        </span>
      </div>
    </motion.div>
  );
}
