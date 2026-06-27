import { Annotation } from "@langchain/langgraph";
import { AnalyzeResponse, CompanyFinancialProfile, NewsItem, ResearchDepth } from "@/types";

export const InvestmentGraphState = Annotation.Root({
  company: Annotation<string>(),
  depth: Annotation<ResearchDepth>(),
  context: Annotation<string | undefined>(),
  financialData: Annotation<CompanyFinancialProfile | null>(),
  newsData: Annotation<NewsItem[]>(),
  isAiSynthesized: Annotation<boolean>(),
  prompt: Annotation<string>(),
  rawAnalysis: Annotation<string>(),
  finalReport: Annotation<AnalyzeResponse | null>(),
  error: Annotation<string | null>(),
});
