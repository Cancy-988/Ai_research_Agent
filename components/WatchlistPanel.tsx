"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiCloseLine,
  RiBookmarkLine,
  RiDeleteBinLine,
  RiArrowRightLine,
  RiLineChartLine,
} from "react-icons/ri";
import { WatchlistItem, AnalyzeResponse } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onLoad: (report: AnalyzeResponse) => void;
}

function readWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("watchlist");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WatchlistItem[];
    return parsed.filter((item) => item.v === 1);
  } catch {
    return [];
  }
}

function writeWatchlist(items: WatchlistItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("watchlist", JSON.stringify(items));
  } catch { /* quota full */ }
}

export default function WatchlistPanel({ open, onClose, onLoad }: Props) {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    if (open) setItems(readWatchlist());
  }, [open]);

  const handleRemove = (company: string) => {
    const next = items.filter((i) => i.company !== company);
    setItems(next);
    writeWatchlist(next);
  };

  const handleLoad = (item: WatchlistItem) => {
    onLoad(item.cachedReport);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-slate-950 border-l border-slate-800 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <RiBookmarkLine className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Watchlist</h2>
                {items.length > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-500/15 text-amber-400 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <RiCloseLine className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16 space-y-3">
                  <div className="p-3 bg-slate-900 rounded-full border border-slate-800">
                    <RiBookmarkLine className="w-6 h-6 text-slate-600" />
                  </div>
                  <p className="text-slate-500 text-sm">No saved analyses yet.</p>
                  <p className="text-slate-600 text-xs max-w-[200px]">
                    Click "Save to Watchlist" after an analysis to bookmark it here.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.company}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="group p-4 bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <RiLineChartLine className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                          <span className="text-sm font-bold text-white truncate">{item.company}</span>
                          {item.ticker && item.ticker !== item.company && (
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
                              {item.ticker}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.recommendation === "INVEST"
                                ? "bg-emerald-500/15 text-emerald-400"
                                : "bg-rose-500/15 text-rose-400"
                            }`}
                          >
                            {item.recommendation}
                          </span>
                          <span className="text-xs text-slate-400">
                            Score: <span className="text-white font-semibold">{item.score}</span>
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-600 mt-1.5">
                          {new Date(item.analyzedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          onClick={() => handleLoad(item)}
                          className="p-1.5 text-slate-400 hover:text-brand-emerald hover:bg-brand-emerald/10 rounded-lg transition-all"
                          title="Load report"
                        >
                          <RiArrowRightLine className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemove(item.company)}
                          className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                          title="Remove"
                        >
                          <RiDeleteBinLine className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-800">
              <p className="text-[10px] text-slate-600 text-center">
                Saved locally · Clears on browser data clear
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
