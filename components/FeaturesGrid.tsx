import React from 'react';
import { Database, ShieldCheck, Newspaper, Award } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
}

function FeatureCard({ icon, title, description, colorClass }: FeatureCardProps) {
  return (
    <div className="glass-card hover:bg-bg-card-hover/40 rounded-xl p-5 border border-slate-800/80 transition-all duration-300 hover:scale-[1.02] flex items-start gap-4">
      <div className={`p-2.5 rounded-lg border bg-slate-900/80 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FeatureCard
        icon={<Database className="w-5 h-5" />}
        title="Institutional Financials Ingestion"
        description="Pulls detailed income statements, balance sheets, and cash flows to assess operating margin leverage, ROE, and debt stability."
        colorClass="text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
      />
      <FeatureCard
        icon={<ShieldCheck className="w-5 h-5" />}
        title="Agentic SWOT Analysis"
        description="Applies stateful LLM nodes to categorize core strengths, product weaknesses, competitive threats, and tailwind growth opportunities."
        colorClass="text-indigo-400 border-indigo-500/20 bg-indigo-500/5"
      />
      <FeatureCard
        icon={<Newspaper className="w-5 h-5" />}
        title="News Sentiment Parsing"
        description="Retrieves active market press releases and media coverage, generating a combined raw sentiment score to gauge momentum."
        colorClass="text-cyan-400 border-cyan-500/20 bg-cyan-500/5"
      />
      <FeatureCard
        icon={<Award className="w-5 h-5" />}
        title="Recommendation Engine"
        description="Synthesizes qualitative trends with quantitative financial metrics to formulate clear BUY/HOLD/SELL ratings and target prices."
        colorClass="text-amber-400 border-amber-500/20 bg-amber-500/5"
      />
    </div>
  );
}
