import { StateGraph, Annotation } from "@langchain/langgraph";
import { ResearchState, ResearchReport } from "@/types";

// Define the state schema using LangGraph's Annotation API
export const ResearchAgentState = Annotation.Root({
  ticker: Annotation<string>(),
  depth: Annotation<'quick' | 'deep'>(),
  additionalContext: Annotation<string | undefined>(),
  companyName: Annotation<string>(),
  rawMetrics: Annotation<any>(),
  rawNews: Annotation<string[]>(),
  reportSummary: Annotation<string>(),
  swotAnalysis: Annotation<any>(),
  sentimentScore: Annotation<number>(),
  sentimentLabel: Annotation<'positive' | 'neutral' | 'negative'>(),
  sentimentSummary: Annotation<string>(),
  recommendationAction: Annotation<'BUY' | 'HOLD' | 'SELL'>(),
  recommendationConfidence: Annotation<number>(),
  recommendationRationale: Annotation<string>(),
  targetPrice: Annotation<number | undefined>(),
  error: Annotation<string | null>(),
});

/**
 * Node: Fetches raw company information and metrics.
 */
async function fetchCompanyData(state: typeof ResearchAgentState.State) {
  // To be implemented in the next step
  return {
    companyName: state.ticker === "AAPL" ? "Apple Inc." : "Standard Corp",
    rawMetrics: {},
    rawNews: [],
  };
}

/**
 * Node: Generates SWOT analysis of the company.
 */
async function analyzeSWOT(state: typeof ResearchAgentState.State) {
  // To be implemented in the next step
  return {
    swotAnalysis: {
      strengths: ["Strong brand loyalty"],
      weaknesses: ["High dependency on hardware"],
      opportunities: ["AI integration across products"],
      threats: ["Regulatory scrutiny"],
    },
  };
}

/**
 * Node: Evaluates recent news sentiment.
 */
async function analyzeSentiment(state: typeof ResearchAgentState.State) {
  // To be implemented in the next step
  return {
    sentimentScore: 0.75,
    sentimentLabel: "positive" as const,
    sentimentSummary: "Positive coverage around next-gen capabilities.",
  };
}

/**
 * Node: Synthesizes final recommendation.
 */
async function synthesizeRecommendation(state: typeof ResearchAgentState.State) {
  // To be implemented in the next step
  return {
    recommendationAction: "BUY" as const,
    recommendationConfidence: 85,
    recommendationRationale: "Strong financial footing and AI opportunities.",
    targetPrice: 245,
    reportSummary: "Comprehensive study shows strong metrics and valuation.",
  };
}

// Build the Graph Workflow
const workflow = new StateGraph(ResearchAgentState)
  .addNode("fetchData", fetchCompanyData)
  .addNode("analyzeSWOT", analyzeSWOT)
  .addNode("analyzeSentiment", analyzeSentiment)
  .addNode("synthesizeRecommendation", synthesizeRecommendation)
  .addEdge("__start__", "fetchData")
  .addEdge("fetchData", "analyzeSWOT")
  .addEdge("analyzeSWOT", "analyzeSentiment")
  .addEdge("analyzeSentiment", "synthesizeRecommendation")
  .addEdge("synthesizeRecommendation", "__end__");

// Compile the runnable graph
export const researchAgentGraph = workflow.compile();
