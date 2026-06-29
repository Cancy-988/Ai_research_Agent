"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  RiDownloadLine,
  RiBookmarkLine,
  RiBookmarkFill,
  RiShareLine,
  RiRefreshLine,
  RiFileCopyLine,
} from "react-icons/ri";
import { AnalyzeResponse, WatchlistItem } from "@/types";

interface Props {
  report: AnalyzeResponse;
  onReset: () => void;
}

function getWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("watchlist") ?? "[]");
  } catch { return []; }
}

function saveWatchlist(items: WatchlistItem[]) {
  if (typeof window === "undefined") return;
  try {
    const data = JSON.stringify(items);
    if (data.length > 4_000_000) {
      // Evict oldest if quota near
      items.shift();
    }
    localStorage.setItem("watchlist", JSON.stringify(items));
  } catch { /* storage full — silent */ }
}

export default function ActionBar({ report, onReset }: Props) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(() => {
    const list = getWatchlist();
    return list.some((i) => i.company === report.company);
  });

  const handleExport = async () => {
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const dashboardEl = document.getElementById("dashboard-root");
      if (!dashboardEl) return;

      const canvas = await html2canvas(dashboardEl, {
        backgroundColor: "#070a13",
        scale: 1.5,
        useCORS: true,
        logging: false,
      });

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const imgW = 210;
      const imgH = (canvas.height * imgW) / canvas.width;
      let y = 0;
      const pageH = 297;

      while (y < imgH) {
        if (y > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, -y, imgW, imgH);
        y += pageH;
      }

      pdf.save(`${report.company.replace(/\s+/g, "_")}_Research.pdf`);
    } catch (e) {
      console.error("PDF export failed:", e);
    }
  };

  const handleSave = () => {
    const list = getWatchlist();
    if (saved) {
      saveWatchlist(list.filter((i) => i.company !== report.company));
      setSaved(false);
    } else {
      const item: WatchlistItem = {
        v: 1,
        ticker: report.ticker ?? report.company,
        company: report.company,
        score: report.investmentScore,
        recommendation: report.recommendation,
        analyzedAt: new Date().toISOString(),
        cachedReport: report,
      };
      saveWatchlist([...list, item]);
      setSaved(true);
    }
  };

  const handleShare = async () => {
    const hash = report.meta?.shareHash;
    const url = hash
      ? `${window.location.origin}/report/${hash}`
      : `${window.location.origin}?q=${encodeURIComponent(report.company)}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback: select prompt
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex flex-wrap items-center justify-center gap-3 pt-4"
    >
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-brand-indigo/10 hover:bg-brand-indigo/20 border border-brand-indigo/25 text-brand-indigo transition-all"
      >
        <RiDownloadLine className="w-4 h-4" />
        Export PDF
      </button>

      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all ${
          saved
            ? "bg-amber-500/10 border-amber-500/25 text-amber-400 hover:bg-amber-500/15"
            : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
        }`}
      >
        {saved ? <RiBookmarkFill className="w-4 h-4" /> : <RiBookmarkLine className="w-4 h-4" />}
        {saved ? "Saved" : "Save to Watchlist"}
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-all"
      >
        {copied ? <RiFileCopyLine className="w-4 h-4 text-emerald-400" /> : <RiShareLine className="w-4 h-4" />}
        {copied ? "Link Copied!" : "Share"}
      </button>

      <button
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-800/60 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all"
      >
        <RiRefreshLine className="w-4 h-4" />
        New Analysis
      </button>
    </motion.div>
  );
}
