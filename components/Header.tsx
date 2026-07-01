"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RiLineChartLine, RiRefreshLine, RiBookmarkLine, RiUser3Line, RiLogoutBoxRLine } from "react-icons/ri";
import { clearAuthSession } from "@/lib/auth";

interface Props {
  status: "idle" | "loading" | "success" | "failed";
  onReset?: () => void;
  onWatchlist?: () => void;
}

export default function Header({ status, onReset, onWatchlist }: Props) {
  const router = useRouter();
  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {
    const update = () => {
      try {
        const raw = localStorage.getItem("watchlist");
        const list = raw ? JSON.parse(raw) : [];
        setWatchlistCount(Array.isArray(list) ? list.length : 0);
      } catch { setWatchlistCount(0); }
    };
    update();
    window.addEventListener("storage", update);
    // Poll every 2s to catch same-tab changes
    const t = setInterval(update, 2000);
    return () => { window.removeEventListener("storage", update); clearInterval(t); };
  }, []);

  return (
    <header className="w-full border-b border-border-main bg-bg-main/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-emerald/10 rounded-xl border border-brand-emerald/20 text-brand-emerald">
            <RiLineChartLine className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-linear-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
              EquityLens
            </h1>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              AI Investment Research · Gemini × LangGraph
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 transition-all"
            title="Open Profile"
          >
            <RiUser3Line className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Profile</span>
          </Link>

          {/* Watchlist button */}
          <button
            onClick={onWatchlist}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 transition-all"
            title="Open Watchlist"
          >
            <RiBookmarkLine className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Watchlist</span>
            {watchlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold bg-amber-500 text-white rounded-full">
                {watchlistCount > 9 ? "9+" : watchlistCount}
              </span>
            )}
          </button>

          {status !== "idle" && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 transition-all"
            >
              <RiRefreshLine className={`w-3.5 h-3.5 ${status === "loading" ? "animate-spin" : ""}`} />
              Reset
            </button>
          )}

          <button
            onClick={() => {
              clearAuthSession();
              router.replace("/login");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg border border-rose-500/30 transition-all"
            title="Logout"
          >
            <RiLogoutBoxRLine className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 rounded-full border border-slate-800">
            <span className={`w-2 h-2 rounded-full transition-colors ${
              status === "loading" ? "bg-amber-500 animate-ping" :
              status === "success" ? "bg-brand-emerald" :
              status === "failed" ? "bg-rose-500" : "bg-slate-500"
            }`} />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {status === "idle" ? "Ready" : status === "loading" ? "Analyzing" : status}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
