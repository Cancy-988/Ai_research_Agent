# EquityLens — AI Investment Research Agent

> Enter a company name. Get institutional-grade equity research in under 60 seconds.

**Live Demo:** [https://equitylens-ashy.vercel.app](https://equitylens-ashy.vercel.app)

---

## Overview

EquityLens compresses a 3-hour analyst workflow into a 45-second AI-powered research dossier. You type a company name — it resolves the ticker, pulls real financial data, fetches recent news, runs a 5-node LangGraph pipeline through Google Gemini, and returns a structured investment dossier with an INVEST / PASS signal.

**What you get per analysis:**
- Investment score (0–100) with a color-coded gauge
- INVEST / PASS recommendation with conviction level
- Live financial metrics: Market Cap, Revenue, P/E, EPS, Dividend Yield
- 3–4 recent news headlines with AI-graded sentiment (Positive / Neutral / Negative)
- Company strengths and risk factors
- Full AI investment thesis (streamable, word-by-word)
- Sector benchmarking (company vs sector median P/E)
- PDF export, shareable URL, and watchlist

**Bonus features:**
- Compare two companies side-by-side (parallel pipelines)
- Watchlist saved to `localStorage` — re-load cached reports instantly
- Shareable `/report/:hash` URLs with 1-hour TTL
- Live streaming reasoning via Server-Sent Events

---

## How to Run It

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| npm | 9+ |

### 1. Clone and install

```bash
git clone <repo-url>
cd "AI Research Agent"
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
# Required — Google AI Studio (free): https://aistudio.google.com/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Required — NewsAPI (free, 100 req/day): https://newsapi.org/register
NEWS_API_KEY=your_newsapi_key_here

# Optional — LangSmith tracing (free): https://smith.langchain.com
LANGCHAIN_TRACING_V2=true
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
LANGCHAIN_API_KEY=your_langsmith_key_here
LANGCHAIN_PROJECT=investment-research

# Set to your deployed URL in production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Free tier limits:** Gemini free tier allows ~20–50 requests/day. NewsAPI free tier allows 100 requests/day. The system falls back to AI-synthesized news when NewsAPI is exhausted.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod --yes --name your-project-name
```

Add env vars to Vercel:
```bash
vercel env add GEMINI_API_KEY production
vercel env add NEWS_API_KEY production
# ... repeat for each key
vercel --prod --yes   # redeploy with env vars active
```

---

## How It Works

### Architecture

```
Browser (Next.js 16 App Router)
  │
  ├── POST /api/analyze        ← single company analysis
  ├── POST /api/compare        ← two companies in parallel
  ├── POST /api/stream         ← SSE streaming reasoning
  └── GET  /api/report/:hash   ← shareable cached report
          │
          ▼
  Rate Limiter (10 req/IP/min, in-memory sliding window)
  Request Cache (Map, 1-hour TTL, LRU at 100 entries)
          │
          ▼
  LangGraph.js 5-Node Pipeline
  ┌─────────────────────────────────────────────────────┐
  │  Node 1: Ticker Resolution                          │
  │    └─ yahoo-finance2 search → resolve "Apple" → AAPL│
  │  Node 2: Financial Data Fetch                       │
  │    └─ Yahoo Finance quoteSummary (11 modules)        │
  │  Node 3: News Context Fetch                         │
  │    └─ NewsAPI.org → fallback: AI-synthesized news   │
  │  Node 4: AI Analysis                                │
  │    └─ Gemini 2.5 Pro (deep) / Flash (quick)         │
  │       Structured JSON output with typed schema       │
  │  Node 5: Decision Validation + Formatting           │
  │    └─ Clamp score, infer recommendation, merge data │
  └─────────────────────────────────────────────────────┘
          │
          ▼
  External APIs: Yahoo Finance · NewsAPI.org · Google Gemini
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Animation | Framer Motion |
| AI Orchestration | LangGraph.js |
| LLM | Google Gemini 2.5 Pro / Flash |
| Financial Data | yahoo-finance2 |
| News | NewsAPI.org (+ AI fallback) |
| PDF Export | html2canvas + jsPDF |
| Streaming | Gemini `generateContentStream` + Next.js `ReadableStream` |
| Validation | Zod |
| Deployment | Vercel |

### Request Flow

1. User submits a company name (e.g. "Reliance Industries")
2. API route validates input with Zod, checks rate limit and cache
3. LangGraph pipeline executes:
   - **Node 1** resolves "Reliance Industries" → `RELIANCE.NS` via Yahoo Finance search
   - **Node 2** fetches quote, financials, profile, 52-week range, beta
   - **Node 3** fetches 6 recent news articles from NewsAPI; falls back to AI-generated news if unavailable
   - **Node 4** sends structured prompt to Gemini with all collected data; receives typed JSON (score, recommendation, strengths, risks, reasoning, newsItems with sentiment)
   - **Node 5** validates output: clamps score to 0–100, infers recommendation from score if missing, fills empty arrays with defaults
4. Server stores result in share cache (djb2 hash → 1-hour TTL Map)
5. Response returned as JSON; dashboard animates in with Framer Motion

---

## Key Decisions & Trade-offs

### What I chose and why

**LangGraph for orchestration (not a single prompt)**
Each node has a single responsibility. This means Node 2 (financial data) can fail gracefully and Node 4 (AI) still runs with partial context — rather than one giant prompt that silently skips data. It also makes the pipeline extensible: adding a `TechnicalAnalysis` node doesn't touch existing nodes.

**Gemini 2.5 Flash as primary, Pro as deep-mode option**
Flash is fast enough for Quick mode (< 20s) and cheap on the free tier. Pro gives noticeably richer reasoning for Deep mode. Automatic Pro → Flash fallback on 429 rate-limit errors means the app degrades gracefully instead of failing.

**Structured JSON output with typed Schema (not prompt-based parsing)**
Using `@google/generative-ai`'s `responseSchema` forces Gemini to emit valid JSON matching the `AnalyzeResponse` shape. This eliminates the `JSON.parse` failure class entirely. The trade-off: schema must use `Schema` type (not `as const`) to stay compatible with the SDK's `string[]` enum type.

**yahoo-finance2 over a paid data API**
Free, no key required, covers 90% of tickers globally including Indian (`.NS`), London (`.L`), and Hong Kong (`.HK`) exchanges. The trade-off: unofficial API, could break on Yahoo Finance changes. Good enough for a demo; a production system would use Polygon.io or Alpha Vantage.

**In-memory cache over Redis**
A Redis dependency would require a paid Upstash account. In-memory Map with 100-entry LRU and 1-hour TTL handles the demo scale perfectly. The trade-off: cache is lost on server restart, and doesn't share across Vercel serverless instances. The PRD documents the Redis upgrade path explicitly.

**localStorage for watchlist (no auth, no DB)**
Avoids the auth surface entirely. Users own their data. The trade-off: data is device-specific and lost on browser clear. This is acceptable for a demo; production would need a user account system.

**Server-Sent Events for streaming (not WebSockets)**
SSE is unidirectional (server → client) and works over HTTP/1.1 with zero setup — no WebSocket upgrade, no connection pooling. Next.js App Router's `ReadableStream` response handles it natively. The trade-off: no client → server messaging mid-stream.

### What I left out (and why)

| Feature | Reason |
|---------|--------|
| Real-time price ticks | Requires WebSocket + paid datafeed; outside scope |
| User authentication | LocalStorage watchlist is sufficient for demo |
| Technical charting | Heavy library (TradingView); would dominate bundle size |
| Portfolio tracking | "v2" feature; multiplies complexity without adding to the core research loop |
| Multi-language support | English-only for this scope |

---

## Example Runs

### Example 1 — Apple Inc. (AAPL) · Quick Mode

```
Company:        Apple Inc.
Ticker:         AAPL (NASDAQ)
Score:          82 / 100  ●  Grade: A
Recommendation: INVEST
Conviction:     High

Financial Snapshot:
  Market Cap:     $3.42T
  Revenue (TTM):  $391B
  P/E Ratio:      32.4×
  EPS:            $6.57
  Dividend Yield: 0.51%
  Sector:         Technology

Strengths:
  1. Unrivalled ecosystem lock-in with 2.2B active devices driving high-margin services revenue
  2. $165B cash reserve provides capacity for buybacks, R&D, and M&A
  3. Apple Silicon transition improving gross margins above 46%

Risks:
  1. 18% revenue concentration in China; geopolitical tensions create supply and demand risk
  2. Regulatory scrutiny on App Store commission model in EU and US
  3. Services growth decelerating from 2023 highs

Recent News Sentiment:
  + Apple Vision Pro ships globally — expansion of spatial computing portfolio  [Positive]
  ~ iPhone 16 cycle showing inline upgrades — analyst expectations mixed       [Neutral]
  - EU DMA compliance costs estimated at $1B+ annually                         [Negative]

Reasoning excerpt:
  "Apple's investment thesis rests on its transition from hardware company to a high-margin
  services platform — a shift that structurally improves earnings quality. The 46%+ gross
  margin reflects pricing power that commodity hardware rivals cannot match. The primary
  bear case is China: a sustained trade restriction or consumer boycott would remove ~$70B
  in annual revenue with no short-term substitute..."

Data source:   Yahoo Finance · NewsAPI
Generated in:  14.2s
```

---

### Example 2 — Reliance Industries (RELIANCE.NS) · Deep Mode

```
Company:        Reliance Industries Limited
Ticker:         RELIANCE.NS (NSE)
Score:          76 / 100  ●  Grade: B+
Recommendation: INVEST
Conviction:     Moderate-High

Financial Snapshot:
  Market Cap:     ₹19.8L Cr (~$237B)
  Revenue (TTM):  ₹9.74L Cr
  P/E Ratio:      27.1×
  EPS:            ₹98.4
  Dividend Yield: 0.32%
  Sector:         Energy / Telecom / Retail

Strengths:
  1. Three-engine growth model: O2C, Jio Platforms, and Retail — reduces single-sector risk
  2. Jio's 450M+ subscribers make it India's largest telecom operator with a data monopoly moat
  3. New Energy (solar, hydrogen) investments position Reliance for post-fossil-fuel transition

Risks:
  1. Debt load of ₹3.06L Cr constrains financial flexibility at high interest rates
  2. O2C margins remain sensitive to global crude spreads and refinery utilisation cycles
  3. Retail EBITDA margins (7%) lag global peers (Walmart: 5.5%, but on much higher volume)

Reasoning excerpt:
  "Reliance is best understood as three companies in a conglomerate wrapper. The O2C business
  funds the infrastructure build-out for Jio and Retail — a cross-subsidy model that has
  worked for two decades. The bull case is Jio's ARPU trajectory: at ₹200 ARPU vs Bharti
  Airtel's ₹208, modest tariff hikes translate to billions in incremental EBITDA..."

Generated in:  41.7s
```

---

### Example 3 — Comparison: Tesla vs. BYD · Quick Mode

```
WINNER: BYD (Score 71 vs Tesla 64, Δ7 points)

                    Tesla (TSLA)        BYD (BYDDF)
Score:              64 / 100            71 / 100
Recommendation:     PASS                INVEST
Market Cap:         $780B               $95B
P/E Ratio:          68×                 21×
Revenue (TTM):      $97B                $84B
Dividend Yield:     —                   1.2%

Tesla bear case:    P/E of 68× prices in robotaxi + FSD at scale; execution risk is high
BYD bull case:      Vertically integrated battery + EV manufacturing at 4× lower cost per unit;
                    dominant in China (world's largest EV market)
```

---

## What I Would Improve With More Time

**1. Streaming the full analysis (not just the thesis)**
Currently, streaming only covers the AI reasoning endpoint (`/api/stream`). The main `/api/analyze` endpoint returns a single JSON blob after all 5 nodes complete. A production system would stream node-by-node progress — "Fetching financials…", "Reading news…", "Analysing…" — with partial results filling in the dashboard as data arrives.

**2. Redis-backed cache and rate limiter**
The current in-memory Map doesn't persist across Vercel serverless function invocations. With Upstash Redis, cache hits would work across instances and survive restarts.

**3. Confidence intervals on the score**
A single `investmentScore: 76` hides Gemini's uncertainty. Running 3 parallel analyses and reporting the median ± standard deviation would give users a sense of model confidence.

**4. Historical score tracking**
Save score history per ticker to localStorage and show a sparkline — "this company was 82 last week, 76 today." This turns the watchlist from a snapshot tool into a trend tool.

**5. Company autocomplete**
As the user types, hit `/api/search?q=...` → yahoo-finance2 search → return top 5 ticker suggestions. Reduces typos and ambiguous company name resolution.

**6. Deeper financial data**
Currently using Yahoo Finance's `quoteSummary`. Adding earnings history, insider transactions, short interest, and analyst price targets (all available via yahoo-finance2) would improve the score's accuracy.

**7. Production-grade error monitoring**
Sentry integration for API route errors. Currently errors are `console.error`'d and returned as JSON — invisible in production without checking Vercel logs.

---

## LLM Chat Session

This project was built entirely in collaboration with **Claude Code (claude-sonnet-4-6)** via the Claude Code VS Code extension. The AI assistant was used for every phase: PRD scoping, architecture design, component implementation, debugging, and deployment.

### Sample exchange — architecture decision

> **Me:** I'm building a 5-node LangGraph pipeline. Should Node 4 (Gemini AI) receive the raw Yahoo Finance JSON, or should I pre-process it into a human-readable summary first?
>
> **Claude:** Pre-process it. Raw Yahoo Finance JSON has ~200 fields, most null for any given ticker. Passing the full blob wastes tokens and can hit Gemini's context window on deep mode. Instead, in Node 2 (financial data), extract the 12 fields you actually use into a typed `FinancialProfile` object, then in Node 4 serialize only those fields into the prompt. This gives Gemini cleaner signal and makes your prompt deterministic — same fields every time, no surprises from Yahoo Finance schema changes.

### Sample exchange — debugging the BOM encoding bug

> **Me:** In production on Vercel I'm getting "Cannot convert argument to a ByteString because the character at index 0 has a value of 65279 which is greater than 255." Locally it works fine.
>
> **Claude:** Character 65279 is `U+FEFF` — the UTF-8 Byte Order Mark. When you first set Vercel env vars by piping values through PowerShell (`echo $value | vercel env add ...`), PowerShell used its OEM codepage pipe, which prepended the BOM to the stored `GEMINI_API_KEY`. The Google SDK then sets `x-goog-api-key: <BOM>AQ.Ab8...` as an HTTP header — Node.js fetch rejects it because HTTP headers are Latin-1 only (≤ 255). Fix: use Git Bash's `printf '%s' "$value" | vercel env add KEY production --yes` — bash's printf sends raw bytes with no encoding transformation.

### Sample exchange — TypeScript error with Gemini schema

> **Me:** TypeScript error: `Type 'readonly ["INVEST", "PASS"]' is not assignable to type 'string[]'` on my Gemini response schema.
>
> **Claude:** The issue is `as const` making the enum array readonly, which is incompatible with the `Schema` type's `enum: string[]`. Instead of `const SCHEMA = { enum: ["INVEST", "PASS"] } as const`, use an explicit type annotation: `const SCHEMA: Schema = { enum: ["INVEST", "PASS"] }` and import `Schema` from `@google/generative-ai`. The explicit type lets TypeScript widen the array back to mutable `string[]`.

### Key AI-assisted decisions

| Decision | Claude's recommendation | Why I followed it |
|----------|------------------------|-------------------|
| Use `responseSchema` for Gemini output | Use typed `Schema` object, not string prompt instructions | Eliminates `JSON.parse` failures at the source |
| AnimatePresence multiple children bug | Guard landing condition with `&& !compareLoading` | Framer Motion `mode="wait"` requires exactly one active child |
| Vercel `maxDuration` | Add `export const maxDuration = 60` to all API routes | Vercel Hobby plan defaults to 10s; LangGraph needs up to 45s |
| `params` in Next.js 16 route handlers | Await `params` as a Promise | Next.js 16 changed route handler params to async |
| Pro → Flash fallback on 429 | Add `isRateLimitError` check with 2s delay before retry | Free-tier quota is ~20 deep-mode requests/day |

---

## Project Structure

```
├── agents/
│   ├── graph.ts              # LangGraph state machine definition
│   └── nodes/
│       ├── researchNode.ts   # Node 1+2: ticker resolution + Yahoo Finance
│       ├── newsNode.ts       # Node 3: NewsAPI + AI fallback
│       ├── analysisNode.ts   # Node 4: Gemini structured output
│       └── decisionNode.ts   # Node 5: validation + formatting
├── app/
│   ├── api/
│   │   ├── analyze/route.ts  # POST /api/analyze
│   │   ├── compare/route.ts  # POST /api/compare
│   │   ├── stream/route.ts   # POST /api/stream (SSE)
│   │   └── report/[hash]/    # GET /api/report/:hash
│   ├── report/[hash]/        # Shareable report page
│   └── page.tsx              # Main app entry
├── components/
│   ├── dashboard/            # Report view sub-components
│   ├── ComparisonView.tsx    # Side-by-side comparison
│   └── WatchlistPanel.tsx    # Slide-in drawer
├── hooks/
│   └── useResearch.ts        # Analysis state machine
├── lib/
│   ├── gemini.ts             # Gemini client singleton
│   ├── cache.ts              # In-memory LRU cache
│   ├── rateLimit.ts          # IP-based sliding window
│   └── shareCache.ts         # Hash → report TTL store
├── services/
│   └── analyzer.ts           # AnalyzerService wrapper
└── types/
    └── index.ts              # Shared TypeScript interfaces
```

---

*Built for the InsideIIM × Altuni AI Labs take-home assignment by Cancy Khandelwal.*
*Not financial advice.*
