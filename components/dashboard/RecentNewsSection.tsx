"use client";
import { motion } from "framer-motion";
import {
  RiNewspaperLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiSubtractLine,
  RiExternalLinkLine,
  RiRobotLine,
} from "react-icons/ri";
import { NewsItem } from "@/types";
import { timeAgo } from "@/lib/utils";

interface Props { newsItems?: NewsItem[] }

function SentimentBadge({ s }: { s: NewsItem["sentiment"] }) {
  if (s === "positive") return (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
      <RiArrowUpLine /> Positive
    </span>
  );
  if (s === "negative") return (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/20 uppercase tracking-wider">
      <RiArrowDownLine /> Negative
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-400 border border-slate-600/30 uppercase tracking-wider">
      <RiSubtractLine /> Neutral
    </span>
  );
}

export default function RecentNewsSection({ newsItems }: Props) {
  if (!newsItems || newsItems.length === 0) return null;
  const isAiNews = newsItems.some((n) => n.isAiSynthesized);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card rounded-xl p-5 border border-slate-800/60"
    >
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800/60">
        <RiNewspaperLine className="w-4 h-4 text-brand-indigo" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent News & Sentiment</h3>
        {isAiNews && (
          <span className="ml-auto flex items-center gap-1 text-[9px] text-amber-500/70 font-mono">
            <RiRobotLine className="w-3 h-3" /> AI-synthesized
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {newsItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + idx * 0.06 }}
            whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
            className={`p-4 rounded-lg border flex flex-col gap-2.5 transition-colors ${
              item.sentiment === "positive"
                ? "border-emerald-500/12 bg-emerald-500/2 hover:border-emerald-500/25"
                : item.sentiment === "negative"
                ? "border-rose-500/12 bg-rose-500/2 hover:border-rose-500/25"
                : "border-slate-800/50 bg-slate-900/20 hover:border-slate-700/50"
            }`}
          >
            <SentimentBadge s={item.sentiment} />
            <p className="text-xs font-semibold text-slate-200 leading-snug line-clamp-2">
              {item.headline}
            </p>
            {item.summary && (
              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3 flex-1">
                {item.summary}
              </p>
            )}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/40 mt-auto">
              <span className="text-[10px] text-slate-500 font-medium truncate">{item.source}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-600 font-mono">{timeAgo(item.publishedAt)}</span>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-400 transition-colors">
                    <RiExternalLinkLine className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
