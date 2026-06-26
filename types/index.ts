/**
 * Types and interfaces for the AI Investment Research Agent.
 */

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
  score: number; // -1 to 1 scale
  label: 'positive' | 'neutral' | 'negative';
  summary: string;
}

export interface InvestmentRecommendation {
  action: 'BUY' | 'HOLD' | 'SELL';
  confidence: number; // 0 to 100
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

export interface AnalyzeRequest {
  company: string;
}

export interface AnalyzeResponse {
  company: string;
  overview: string;
  strengths: string[];
  risks: string[];
  investmentScore: number;
  recommendation: 'INVEST' | 'PASS';
  reasoning: string;
}

export interface CompanyFinancialProfile {
  symbol: string;
  name: string;
  industry?: string;
  sector?: string;
  marketCap?: number;
  revenue?: number;
  peRatio?: number;
  eps?: number;
  dividendYield?: number;
  summary?: string;
}
