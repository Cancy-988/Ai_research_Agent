import Link from "next/link";
import { RiArrowRightLine, RiLineChartLine, RiShieldCheckLine, RiSparklingLine } from "react-icons/ri";

const FEATURE_ITEMS = [
  {
    title: "Real-Time Market Context",
    body: "Pulls live quote and company fundamentals from Yahoo Finance before forming an investment stance.",
    icon: RiLineChartLine,
  },
  {
    title: "Explainable AI Thesis",
    body: "Generates strengths, risks, score rationale, and recommendation with structured output and confidence framing.",
    icon: RiSparklingLine,
  },
  {
    title: "Research Safety Rails",
    body: "Input validation, rate limiting, and response checks guard the pipeline from malformed or incomplete runs.",
    icon: RiShieldCheckLine,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-main text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-35 -left-30 w-120 h-120 rounded-full bg-brand-indigo/10 blur-[120px]" />
        <div className="absolute -bottom-45 -right-25 w-135 h-135 rounded-full bg-brand-emerald/10 blur-[140px]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-slate-900/80 bg-bg-main/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-emerald/10 rounded-xl border border-brand-emerald/20 text-brand-emerald">
              <RiLineChartLine className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black tracking-wide">EquityLens</p>
              <p className="text-[11px] text-slate-500">AI Investment Research Agent</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-brand-indigo/40 bg-brand-indigo/10 text-brand-indigo hover:bg-brand-indigo/20 transition-colors"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10 space-y-16 sm:space-y-24">
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-3 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-emerald/25 bg-brand-emerald/10 text-brand-emerald text-[11px] uppercase tracking-widest font-bold">
              Institutional-grade stock intelligence
            </div>
            <h1 className="text-4xl sm:text-6xl font-black leading-tight tracking-tight">
              Turn market noise into
              <span className="block bg-linear-to-r from-brand-emerald via-teal-400 to-brand-indigo bg-clip-text text-transparent">
                decision-ready research
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
              Run a 5-node analysis pipeline that blends fundamentals, sentiment, and AI reasoning into an INVEST or PASS recommendation in minutes.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-brand-emerald to-teal-500 hover:from-brand-emerald-hover hover:to-teal-600 text-sm font-bold shadow-lg shadow-brand-emerald/25 transition-all"
              >
                Open Dashboard
                <RiArrowRightLine className="w-4 h-4" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-700 bg-slate-900/70 hover:border-slate-600 text-sm font-semibold text-slate-200 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800/70 space-y-4">
              <p className="text-xs uppercase tracking-widest font-bold text-slate-500">Pipeline Summary</p>
              <div className="space-y-3">
                {[
                  "Resolve ticker and fundamentals",
                  "Scan live market news",
                  "Score sentiment impact",
                  "Generate AI investment thesis",
                  "Validate recommendation and report",
                ].map((item, idx) => (
                  <div key={item} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/70">
                    <span className="w-6 h-6 rounded-full bg-brand-indigo/15 text-brand-indigo text-[11px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">Not financial advice. Research output is for educational and decision-support use.</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {FEATURE_ITEMS.map(({ title, body, icon: Icon }) => (
            <article key={title} className="glass-card rounded-xl p-5 border border-slate-800/65">
              <div className="w-9 h-9 rounded-lg bg-slate-800/70 border border-slate-700 flex items-center justify-center text-brand-indigo">
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-100">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
