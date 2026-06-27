"use client";
import { motion } from "framer-motion";
import { RiAlertLine } from "react-icons/ri";

interface Props { risks: string[] }

export default function RisksSection({ risks }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card rounded-xl p-5 border border-rose-500/15 bg-rose-500/[0.02] h-full"
    >
      <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2 pb-3 mb-3 border-b border-rose-500/15">
        <RiAlertLine className="w-4 h-4" />
        Key Risks & Headwinds
        <span className="ml-auto text-[10px] text-rose-500/50 font-mono">{risks.length} factors</span>
      </h3>
      <ul className="space-y-3">
        {risks.map((risk, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + idx * 0.07 }}
            className="flex items-start gap-3 group"
          >
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mt-0.5">
              <span className="text-[9px] font-black text-rose-400 font-mono">{idx + 1}</span>
            </div>
            <span className="text-xs text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
              {risk}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
