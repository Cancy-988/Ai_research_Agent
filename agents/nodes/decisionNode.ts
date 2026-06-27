import { InvestmentGraphState } from "../state";
import { AnalyzeResponse, SectorBenchmark } from "@/types";

// Sector median P/E lookup for benchmarking
const SECTOR_PE: Record<string, number> = {
  Technology: 28,
  "Financial Services": 14,
  Healthcare: 22,
  "Consumer Cyclical": 20,
  "Consumer Defensive": 19,
  Energy: 12,
  Industrials: 18,
  "Communication Services": 24,
  "Basic Materials": 14,
  Utilities: 16,
  "Real Estate": 35,
};

const SECTOR_DIV: Record<string, number> = {
  Utilities: 3.8,
  "Real Estate": 3.5,
  Energy: 3.2,
  "Financial Services": 2.1,
  Industrials: 1.8,
  Healthcare: 1.4,
  Technology: 0.8,
  "Consumer Cyclical": 1.2,
  "Consumer Defensive": 2.2,
  "Communication Services": 1.6,
  "Basic Materials": 2.0,
};

export async function decisionNode(
  state: typeof InvestmentGraphState.State
) {
  console.log(`[Node: Decision] Validating report for "${state.company}"`);

  if (!state.rawAnalysis) throw new Error("[Node: Decision] rawAnalysis missing from state.");

  let finalReport: AnalyzeResponse;

  try {
    finalReport = JSON.parse(state.rawAnalysis) as AnalyzeResponse;
  } catch (err: any) {
    throw new Error(`[Node: Decision] JSON parse failed: ${err.message}`);
  }

  // ── Score clamping ──────────────────────────────────────────────────────────
  if (typeof finalReport.investmentScore !== "number" || isNaN(finalReport.investmentScore)) {
    finalReport.investmentScore = 50;
  } else {
    finalReport.investmentScore = Math.max(0, Math.min(100, Math.round(finalReport.investmentScore)));
  }

  // ── Recommendation fallback ─────────────────────────────────────────────────
  if (finalReport.recommendation !== "INVEST" && finalReport.recommendation !== "PASS") {
    finalReport.recommendation = finalReport.investmentScore >= 65 ? "INVEST" : "PASS";
  }

  // ── Array safeguards ────────────────────────────────────────────────────────
  if (!Array.isArray(finalReport.strengths)) finalReport.strengths = [];
  if (!Array.isArray(finalReport.risks)) finalReport.risks = [];

  // ── Attach financial profile from research node ─────────────────────────────
  finalReport.financialProfile = state.financialData ?? null;
  finalReport.ticker = state.financialData?.symbol;

  // ── Attach news items from sentiment node ───────────────────────────────────
  finalReport.newsItems = state.newsData ?? [];

  // ── Sector benchmarking ─────────────────────────────────────────────────────
  const sector = state.financialData?.sector;
  if (sector && SECTOR_PE[sector]) {
    const medianPE = SECTOR_PE[sector];
    const medianDiv = SECTOR_DIV[sector] ?? 1.5;
    const companyPE = state.financialData?.peRatio;

    let peVsMedian: SectorBenchmark["companyPEvsMedian"] = "unknown";
    if (companyPE != null) {
      const diff = ((companyPE - medianPE) / medianPE) * 100;
      if (diff > 15) peVsMedian = "above";
      else if (diff < -15) peVsMedian = "below";
      else peVsMedian = "inline";
    }

    finalReport.sectorBenchmark = { sector, medianPE, medianDividendYield: medianDiv, companyPEvsMedian: peVsMedian };
  } else {
    finalReport.sectorBenchmark = null;
  }

  // ── Meta ────────────────────────────────────────────────────────────────────
  finalReport.meta = {
    generatedAt: new Date().toISOString(),
    depth: state.depth ?? "quick",
    dataSource: state.financialData ? "yahoo_finance" : "ai_only",
    newsSource: state.isAiSynthesized ? "ai_synthesized" : "newsapi",
    cacheHit: false,
  };

  console.log(`[Node: Decision] ✓ ${finalReport.recommendation} | Score: ${finalReport.investmentScore}`);
  return { finalReport };
}
