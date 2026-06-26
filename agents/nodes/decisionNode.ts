import { InvestmentGraphState } from '../state';
import { AnalyzeResponse } from '@/types';

/**
 * Node: Decision Node
 * Parses the raw analysis string, validates the format, executes business logic/clamping rules,
 * and sets the final report state.
 */
export async function decisionNode(state: typeof InvestmentGraphState.State) {
  console.log(`[LangGraph][Decision Node] Starting report validation for: "${state.company}"`);

  const rawAnalysis = state.rawAnalysis;
  if (!rawAnalysis) {
    throw new Error('Decision Node: Raw analysis string is missing from graph state.');
  }

  let finalReport: AnalyzeResponse;
  
  try {
    finalReport = JSON.parse(rawAnalysis) as AnalyzeResponse;
  } catch (err: any) {
    console.error('[LangGraph][Decision Node] Failed to parse raw output JSON:', rawAnalysis);
    throw new Error(`Decision Node: Failed to parse raw analysis payload. Details: ${err.message}`);
  }

  // 1. Validate and clamp Investment Score (0 to 100)
  if (typeof finalReport.investmentScore !== 'number') {
    finalReport.investmentScore = 50; // Fallback median
  } else {
    finalReport.investmentScore = Math.max(0, Math.min(100, Math.round(finalReport.investmentScore)));
  }

  // 2. Validate Recommendation Enum
  if (finalReport.recommendation !== 'INVEST' && finalReport.recommendation !== 'PASS') {
    // If invalid recommendation, infer from score
    finalReport.recommendation = finalReport.investmentScore >= 75 ? 'INVEST' : 'PASS';
  }

  // 3. Ensure Arrays are fully initialized
  if (!Array.isArray(finalReport.strengths)) {
    finalReport.strengths = finalReport.strengths ? [finalReport.strengths] : [];
  }
  if (!Array.isArray(finalReport.risks)) {
    finalReport.risks = finalReport.risks ? [finalReport.risks] : [];
  }

  console.log(`[LangGraph][Decision Node] Validation succeeded. Signal: ${finalReport.recommendation}, Score: ${finalReport.investmentScore}`);

  return {
    finalReport,
  };
}
