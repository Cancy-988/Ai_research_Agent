"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { RiLineChartLine, RiArrowLeftLine, RiTimeLine } from "react-icons/ri";
import ReportView from "@/components/ReportView";
import { AnalyzeResponse } from "@/types";

interface Props {
  report: AnalyzeResponse | null;
  hash: string;
}

export default function SharedReportClient({ report, hash: _hash }: Props) {
  if (!report) {
    return (
      <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl mb-6">
          <RiTimeLine className="w-10 h-10 text-rose-400 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Report Expired</h1>
        <p className="text-slate-400 mb-6 max-w-sm">
          This shared report has expired (1-hour TTL) or the server restarted.
          Re-analyze the company to generate a new share link.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-emerald text-white font-semibold rounded-xl hover:bg-brand-emerald/90 transition-all"
        >
          <RiArrowLeftLine className="w-4 h-4" />
          Go to EquityLens
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Mini header */}
      <header className="w-full border-b border-border-main bg-bg-main/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
            <RiArrowLeftLine className="w-4 h-4" />
            <div className="flex items-center gap-2">
              <RiLineChartLine className="w-5 h-5 text-brand-emerald" />
              <span className="text-sm font-bold">EquityLens</span>
            </div>
          </Link>
          <span className="text-xs text-slate-500 font-medium">Shared Report · {report.meta.generatedAt.slice(0, 10)}</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-4 text-xs text-slate-500 text-center">
            Shared analysis · Generated {new Date(report.meta.generatedAt).toLocaleString()} · Not financial advice
          </div>
          <ReportView report={report} onReset={() => { window.location.href = "/"; }} />
        </motion.div>
      </main>
    </div>
  );
}
