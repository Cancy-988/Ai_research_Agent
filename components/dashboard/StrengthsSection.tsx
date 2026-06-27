"use client";
import { motion } from "framer-motion";
import { RiCheckboxCircleLine } from "react-icons/ri";

interface Props { strengths: string[] }

export default function StrengthsSection({ strengths }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card rounded-xl p-5 border border-emerald-500/15 bg-emerald-500/[0.02] h-full"
    >
      <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 pb-3 mb-3 border-b border-emerald-500/15">
        <RiCheckboxCircleLine className="w-4 h-4" />
        Key Competitive Strengths
        <span className="ml-auto text-[10px] text-emerald-500/50 font-mono">{strengths.length} factors</span>
      </h3>
      <ul className="space-y-3">
        {strengths.map((strength, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + idx * 0.07 }}
            className="flex items-start gap-3 group"
          >
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mt-0.5">
              <span className="text-[9px] font-black text-emerald-400 font-mono">{idx + 1}</span>
            </div>
            <span className="text-xs text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
              {strength}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
