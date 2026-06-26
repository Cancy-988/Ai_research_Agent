import { Annotation } from "@langchain/langgraph";
import { AnalyzeResponse, CompanyFinancialProfile } from "@/types";

/**
 * Shared state schema definition for the Investment LangGraph workflow.
 * Decoupled from the graph build configuration to avoid circular dependencies.
 */
export const InvestmentGraphState = Annotation.Root({
  company: Annotation<string>(),
  financialData: Annotation<CompanyFinancialProfile | null>(),
  prompt: Annotation<string>(),
  rawAnalysis: Annotation<string>(),
  finalReport: Annotation<AnalyzeResponse | null>(),
  error: Annotation<string | null>(),
});
