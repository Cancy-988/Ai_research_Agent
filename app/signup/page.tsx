"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { RiLineChartLine, RiLockPasswordLine, RiMailLine, RiUser3Line } from "react-icons/ri";
import { setAuthSession } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const safeName = name.trim();
    const safeEmail = email.trim().toLowerCase();
    if (!safeName || !safeEmail || !password.trim()) return;

    setAuthSession({
      name: safeName,
      email: safeEmail,
    });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-bg-main text-white relative overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-25 w-115 h-115 rounded-full bg-brand-indigo/10 blur-[120px]" />
        <div className="absolute -bottom-45 -left-30 w-125 h-125 rounded-full bg-brand-emerald/10 blur-[140px]" />
      </div>

      <div className="w-full max-w-md glass-panel rounded-2xl border border-slate-800/70 p-6 sm:p-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm mb-6">
          <RiLineChartLine className="w-4 h-4" />
          EquityLens
        </Link>

        <h1 className="text-2xl font-black tracking-tight">Create Your Account</h1>
        <p className="text-sm text-slate-400 mt-2">Start saving analyses, comparing stocks, and building your AI-powered watchlist.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Full Name</span>
            <div className="mt-1.5 relative">
              <RiUser3Line className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Carter"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-800 bg-slate-900/80 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-brand-indigo/20 focus:border-brand-indigo"
              />
            </div>
          </label>

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
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-800 bg-slate-900/80 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-brand-indigo/20 focus:border-brand-indigo"
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
                placeholder="Create a strong password"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-800 bg-slate-900/80 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-brand-indigo/20 focus:border-brand-indigo"
              />
            </div>
          </label>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-sm font-bold bg-linear-to-r from-brand-indigo to-indigo-500 hover:from-brand-indigo-hover hover:to-indigo-600 transition-all shadow-lg shadow-brand-indigo/25"
          >
            Sign Up
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-4">Session is stored in browser cookies for local development auth.</p>

        <p className="text-sm text-slate-400 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-emerald hover:text-brand-emerald-hover font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
