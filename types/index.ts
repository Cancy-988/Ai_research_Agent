export type ResearchDepth = 'quick' | 'deep';

export interface CompanyAnalysisInput {
  ticker: string;
  depth: ResearchDepth;
  additionalContext?: string;
}

export type AnalysisStatus = 'idle' | 'loading' | 'success' | 'failed';

export interface AnalysisStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  message?: string;
}

export interface FinancialMetrics {
  peRatio?: number;
  pbRatio?: number;
  marketCap?: number;
  revenueGrowths5Yr?: number;
  debtToEquity?: number;
  roe?: number;
  freeCashFlow?: number;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface SentimentAnalysis {
  score: number;
  label: 'positive' | 'neutral' | 'negative';
  summary: string;
}

export interface InvestmentRecommendation {
  action: 'BUY' | 'HOLD' | 'SELL';
  confidence: number;
  targetPrice?: number;
  rationale: string;
}

export interface ResearchReport {
  ticker: string;
  companyName: string;
  summary: string;
  metrics: FinancialMetrics;
  swot: SWOTAnalysis;
  sentiment: SentimentAnalysis;
  recommendation: InvestmentRecommendation;
  createdAt: string;
}

export interface ResearchState {
  status: AnalysisStatus;
  currentStepIndex: number;
  steps: AnalysisStep[];
  report: ResearchReport | null;
  error: string | null;
}

// ─── News ─────────────────────────────────────────────────────────────────────

export interface NewsItem {
  headline: string;
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore?: number;
  source: string;
  url?: string;
  publishedAt: string;
  isAiSynthesized: boolean;
}

// ─── Financial Profile (extended from CompanyFinancialProfile) ─────────────────

export interface CompanyFinancialProfile {
  symbol: string;
  name: string;
  exchange?: string;
  industry?: string;
  sector?: string;
  marketCap?: number;
  revenue?: number;
  peRatio?: number;
  eps?: number;
  dividendYield?: number;
  currentPrice?: number;
  priceChange1D?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  beta?: number;
  grossMargin?: number;
  operatingMargin?: number;
  returnOnEquity?: number;
  debtToEquity?: number;
  freeCashFlow?: number;
  summary?: string;
}

// ─── Sector Benchmarking ──────────────────────────────────────────────────────

export interface SectorBenchmark {
  sector: string;
  medianPE: number;
  medianDividendYield: number;
  companyPEvsMedian: 'above' | 'below' | 'inline' | 'unknown';
}

// ─── API Contracts ────────────────────────────────────────────────────────────

export interface AnalyzeRequest {
  company: string;
  depth?: ResearchDepth;
  context?: string;
}

export interface AnalyzeResponse {
  company: string;
  ticker?: string;
  overview: string;
  strengths: string[];
  risks: string[];
  investmentScore: number;
  recommendation: 'INVEST' | 'PASS';
  reasoning: string;
  financialProfile?: CompanyFinancialProfile | null;
  newsItems?: NewsItem[];
  sectorBenchmark?: SectorBenchmark | null;
  meta: {
    generatedAt: string;
    depth: ResearchDepth;
    dataSource: 'yahoo_finance' | 'ai_only';
    newsSource: 'newsapi' | 'ai_synthesized';
    cacheHit: boolean;
    shareHash?: string;
  };
}

// ─── Comparison ───────────────────────────────────────────────────────────────

export interface CompareResponse {
  companies: [AnalyzeResponse, AnalyzeResponse];
  winner: string;
  delta: number;
}

// ─── Watchlist ────────────────────────────────────────────────────────────────

export interface WatchlistItem {
  v: 1;
  ticker: string;
  company: string;
  score: number;
  recommendation: 'INVEST' | 'PASS';
  analyzedAt: string;
  cachedReport: AnalyzeResponse;
}
