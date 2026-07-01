import Link from "next/link";
import {
  RiArrowRightLine,
  RiLineChartLine,
  RiShieldCheckLine,
  RiSparklingLine,
  RiSearchLine,
  RiBarChart2Line,
  RiNewspaperLine,
  RiEmotionNormalLine,
  RiUserLine,
  RiGraduationCapLine,
  RiBriefcaseLine,
  RiQuestionLine,
} from "react-icons/ri";

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

const PIPELINE_STEPS = [
  {
    step: "1",
    title: "Ticker Resolution Node",
    description: "Resolves natural language queries (e.g., 'Apple' or 'RIL') into official ticker symbols (AAPL, RELIANCE.NS) across global stock exchanges. It filters out delisted stocks, alerts users of ETFs, and handles ambiguous matches.",
    icon: RiSearchLine,
  },
  {
    step: "2",
    title: "Fundamentals Extraction Node",
    description: "Pulls key metrics directly from Yahoo Finance, including P/E ratios, EPS, debt-to-equity, profit margins, and historical growth trends to establish a grounded, data-driven financial baseline.",
    icon: RiBarChart2Line,
  },
  {
    step: "3",
    title: "Market News Crawler Node",
    description: "Retrieves recent news and press releases for the resolved stock to identify macroeconomic headwinds, regulatory filings, product announcements, and broader market movements.",
    icon: RiNewspaperLine,
  },
  {
    step: "4",
    title: "News Sentiment Scorer Node",
    description: "Grades current news articles on a positive, neutral, or negative scale, calculating a weighted average market sentiment score to contextualize raw financials with ambient market feelings.",
    icon: RiEmotionNormalLine,
  },
  {
    step: "5",
    title: "Thesis Synthesis & Guardrails Node",
    description: "Orchestrates Gemini models via LangGraph to compile the final SWOT analysis, recommendation stance, and score. It runs the output through verification guardrails to eliminate hallucinations.",
    icon: RiShieldCheckLine,
  },
];

const TARGET_AUDIENCES = [
  {
    title: "Retail Investors",
    description: "Skip the noise and institutional jargon. Access institutional-quality equity research and clear signals in under a minute to make informed choices.",
    icon: RiUserLine,
  },
  {
    title: "Finance & MBA Students",
    description: "Synthesize company metrics, SWOT points, and market sentiment rapidly. Perfect for course assignments, pitch competitions, and mock-portfolio research.",
    icon: RiGraduationCapLine,
  },
  {
    title: "Analysts & Researchers",
    description: "Automate repetitive data collection and initial document drafts. Use EquityLens as a highly reliable starting point to speed up your deep-dive analyses.",
    icon: RiBriefcaseLine,
  },
];

const FAQS = [
  {
    q: "Is EquityLens offering direct financial advice?",
    a: "No. EquityLens is a decision-support tool meant for research and educational purposes. All outputs represent AI-driven assessments based on publicly available data, not professional financial advice.",
  },
  {
    q: "How fresh is the research data?",
    a: "The market quote, fundamentals, and sentiment data are pulled live from Yahoo Finance and active news feeds at the exact second you run the analysis pipeline.",
  },
  {
    q: "How does the system handle API limits or outages?",
    a: "The core system has built-in graceful fallback layers. If secondary APIs fail, EquityLens uses historical snapshots and LLM-assisted knowledge blocks to maintain a functional research flow.",
  },
  {
    q: "What AI models power the analysis?",
    a: "EquityLens relies on LangGraph orchestration and Google's high-performance Gemini models, specifically configured to output highly structured JSON schemas for consistent, error-free parsing.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-main text-white relative overflow-hidden flex flex-col justify-between">
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10 space-y-20 sm:space-y-32 flex-grow">
        {/* Hero Section */}
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

        {/* Features Quick Grid */}
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

        {/* Pipeline Nodes Detail Section */}
        <section className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Inside the <span className="text-brand-emerald">5-Node Research Pipeline</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              EquityLens orchestrates multiple specialized nodes in a stateful workflow, feeding precise data from step to step to craft a complete research profile.
            </p>
          </div>

          <div className="relative border-l border-slate-800/60 ml-4 md:ml-12 space-y-8">
            {PIPELINE_STEPS.map(({ step, title, description, icon: Icon }) => (
              <div key={step} className="relative pl-8 sm:pl-12 group">
                {/* Timeline Icon Badge */}
                <div className="absolute -left-5 top-0 w-10 h-10 rounded-xl bg-bg-card border border-slate-800 flex items-center justify-center text-brand-indigo shadow-md shadow-brand-indigo/10 group-hover:border-brand-emerald/40 transition-colors">
                  <Icon className="w-5 h-5 text-brand-indigo group-hover:text-brand-emerald transition-colors" />
                </div>
                <div className="glass-card rounded-xl p-5 sm:p-6 border border-slate-800/60 hover:border-slate-700/80 transition-all space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded-full">
                      Node {step}
                    </span>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">
                      {title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Target Audience Section */}
        <section className="space-y-12 bg-slate-950/20 py-12 rounded-3xl border border-slate-900/60 px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Designed For <span className="text-brand-indigo">Every Investor</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Whether you are managing your personal savings, studying modern finance, or compiling analyst sheets, EquityLens streamlines your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TARGET_AUDIENCES.map(({ title, description, icon: Icon }) => (
              <div key={title} className="glass-panel hover:bg-bg-card-hover/40 rounded-2xl p-6 border border-slate-800/70 hover:border-slate-700/70 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-center text-brand-indigo">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Frequently Asked <span className="bg-linear-to-r from-teal-400 to-brand-indigo bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Got questions about our system capabilities, data sources, or recommendations? We have answered the most common ones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="glass-card rounded-2xl p-6 border border-slate-800/50 hover:border-slate-700/50 transition-all space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1 bg-brand-emerald/10 text-brand-emerald rounded-lg">
                    <RiQuestionLine className="w-4 h-4" />
                  </div>
                  <h4 className="text-base font-bold text-slate-200">{q}</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed pl-8">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="relative rounded-3xl overflow-hidden border border-slate-800/80">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-12 -right-12 w-60 h-60 rounded-full bg-brand-emerald/10 blur-[80px]" />
            <div className="absolute -bottom-12 -left-12 w-60 h-60 rounded-full bg-brand-indigo/10 blur-[80px]" />
          </div>
          <div className="glass-panel p-8 sm:p-12 text-center space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Ready to run your first analysis?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Join thousands of users screening stocks with institutional-grade AI research pipelines.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-brand-emerald to-teal-500 hover:from-brand-emerald-hover hover:to-teal-600 text-sm font-bold shadow-lg shadow-brand-emerald/25 transition-all text-white"
              >
                Launch App
                <RiArrowRightLine className="w-4 h-4" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-700 bg-slate-900/50 hover:border-slate-600 text-sm font-semibold text-slate-200 transition-colors"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900/80 bg-slate-950/40 py-12 relative z-10 text-slate-500 text-xs text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-left">
              <div className="p-1.5 bg-brand-emerald/10 rounded-lg border border-brand-emerald/20 text-brand-emerald">
                <RiLineChartLine className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black tracking-wide text-slate-400">EquityLens</p>
                <p className="text-[10px]">AI Investment Research Agent</p>
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/login" className="hover:text-slate-300 transition-colors">Login</Link>
              <Link href="/signup" className="hover:text-slate-300 transition-colors">Sign Up</Link>
              <Link href="/dashboard" className="hover:text-slate-300 transition-colors">Dashboard</Link>
            </div>
          </div>
          <div className="border-t border-slate-900/60 pt-6 space-y-2">
            <p>Built for the InsideIIM × Altuni AI Labs take-home assignment.</p>
            <p className="max-w-3xl mx-auto leading-relaxed">
              Disclaimer: EquityLens utilizes advanced artificial intelligence models to gather and analyze financial information. None of the ratings, thesis statements, or scores generated constitute specific investment advice. Please conduct your own due diligence before committing capital.
            </p>
            <p className="text-[10px] mt-4">© {new Date().getFullYear()} EquityLens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

