"use client";
import { motion } from "framer-motion";
import { RiCpuLine, RiBrainLine, RiSparklingLine } from "react-icons/ri";

interface Props {
  reasoning: string;
  company: string;
  depth?: "quick" | "deep";
}

export default function AIReasoningSection({ reasoning, company, depth }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="glass-card rounded-xl p-5 border border-slate-800/60"
    >
      <div className="flex items-start justify-between gap-4 pb-3 mb-4 border-b border-slate-800/60">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <RiCpuLine className="w-4 h-4 text-brand-indigo" />
          Investment Thesis & Fundamental Reasoning
        </h3>
        <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-indigo/10 border border-brand-indigo/20">
          <RiBrainLine className="w-3 h-3 text-brand-indigo" />
          <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider">
            Gemini {depth === "deep" ? "2.5 Pro" : "2.5 Flash"}
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed text-justify">
        {reasoning}
      </p>

      <div className="mt-4 pt-3 border-t border-slate-800/40 flex flex-wrap items-center gap-3 text-[10px] text-slate-600">
        <span className="flex items-center gap-1">
          <RiSparklingLine className="w-3 h-3" />
          Based on publicly available financial data
        </span>
        <span>·</span>
        <span>Not financial advice</span>
        <span>·</span>
        <span className="font-mono uppercase">Research on: {company}</span>
      </div>
    </motion.div>
  );
}
