"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine, RiLogoutBoxRLine, RiMailLine, RiUser3Line } from "react-icons/ri";
import { clearAuthSession, getAuthSession, UserSession } from "@/lib/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    const next = getAuthSession();
    setSession(next);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-bg-main text-white px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-36 -left-20 w-110 h-110 rounded-full bg-brand-indigo/10 blur-[110px]" />
        <div className="absolute -bottom-40 -right-16 w-110 h-110 rounded-full bg-brand-emerald/10 blur-[120px]" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10 space-y-5">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
          <RiArrowLeftLine className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="glass-panel rounded-2xl border border-slate-800/70 p-6 sm:p-8">
          <h1 className="text-2xl font-black tracking-tight">My Profile</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your account session and identity details.</p>

          <div className="mt-6 grid gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-indigo/15 text-brand-indigo flex items-center justify-center">
                <RiUser3Line className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 font-bold">Full Name</p>
                <p className="text-sm font-semibold text-slate-200">{session?.name ?? "User"}</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-emerald/15 text-brand-emerald flex items-center justify-center">
                <RiMailLine className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 font-bold">Email</p>
                <p className="text-sm font-semibold text-slate-200">{session?.email ?? "user@example.com"}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/35 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-colors text-sm font-semibold"
          >
            <RiLogoutBoxRLine className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
