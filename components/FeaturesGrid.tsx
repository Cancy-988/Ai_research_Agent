"use client";
import { motion } from "framer-motion";
import { RiDatabase2Line, RiShieldCheckLine, RiNewspaperLine, RiAwardLine } from "react-icons/ri";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
  delay: number;
}

function FeatureCard({ icon, title, description, colorClass, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
      className="glass-card hover:bg-bg-card-hover/40 rounded-xl p-5 border border-slate-800/80 transition-colors flex items-start gap-4"
    >
      <div className={`p-2.5 rounded-lg border bg-slate-900/80 shrink-0 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

const FEATURES = [
  {
    icon: <RiDatabase2Line className="w-5 h-5" />,
    title: "LangChain Tool-Calling Research",
    description: "Gemini autonomously calls get_stock_quote and get_company_profile tools via LangChain, fetching real-time Yahoo Finance data agentically.",
    colorClass: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  },
  {
    icon: <RiShieldCheckLine className="w-5 h-5" />,
    title: "5-Node LangGraph Pipeline",
    description: "Stateful graph: Research → News Fetch → Sentiment Classification → Gemini Analysis → Decision Validation. Traced live in LangSmith.",
    colorClass: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
  },
  {
    icon: <RiNewspaperLine className="w-5 h-5" />,
    title: "Real News Sentiment Analysis",
    description: "NewsAPI fetches live headlines. LangChain ChatModel classifies each article's investment sentiment score — with AI fallback when unavailable.",
    colorClass: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
  },
  {
    icon: <RiAwardLine className="w-5 h-5" />,
    title: "Flash vs Pro Model Routing",
    description: "Quick mode uses Gemini 2.5 Flash for speed. Deep Research upgrades to Gemini 2.5 Pro for exhaustive thesis depth and scenario analysis.",
    colorClass: "text-amber-400 border-amber-500/20 bg-amber-500/5",
  },
];

export default function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {FEATURES.map((f, i) => (
        <FeatureCard key={f.title} {...f} delay={i * 0.07} />
      ))}
    </div>
  );
}
