"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { RiLineChartLine, RiLockPasswordLine, RiMailLine } from "react-icons/ri";
import { setAuthSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const safeEmail = email.trim().toLowerCase();
    if (!safeEmail || !password.trim()) return;

    const namePart = safeEmail.split("@")[0] ?? "user";
    const inferredName = namePart
      .split(/[._-]/g)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || "User";

    setAuthSession({
      name: inferredName,
      email: safeEmail,
    });

    const next = searchParams.get("next");
    router.push(next && next.startsWith("/") ? next : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-bg-main text-white relative overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-35 -left-25 w-105 h-105 rounded-full bg-brand-indigo/10 blur-[120px]" />
        <div className="absolute -bottom-35 -right-20 w-115 h-115 rounded-full bg-brand-emerald/10 blur-[130px]" />
      </div>

      <div className="w-full max-w-md glass-panel rounded-2xl border border-slate-800/70 p-6 sm:p-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm mb-6">
          <RiLineChartLine className="w-4 h-4" />
          EquityLens
        </Link>

        <h1 className="text-2xl font-black tracking-tight">Welcome Back</h1>
        <p className="text-sm text-slate-400 mt-2">Sign in to access your research dashboard and watchlist.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</span>
            <div className="mt-1.5 relative">
              <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-800 bg-slate-900/80 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-brand-emerald/20 focus:border-brand-emerald"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</span>
            <div className="mt-1.5 relative">
              <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-800 bg-slate-900/80 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-brand-emerald/20 focus:border-brand-emerald"
              />
            </div>
          </label>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-sm font-bold bg-linear-to-r from-brand-emerald to-teal-500 hover:from-brand-emerald-hover hover:to-teal-600 transition-all shadow-lg shadow-brand-emerald/25"
          >
            Login
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-4">Session is stored in browser cookies for local development auth.</p>

        <p className="text-sm text-slate-400 mt-5">
          New to EquityLens?{" "}
          <Link href="/signup" className="text-brand-indigo hover:text-brand-indigo-hover font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
