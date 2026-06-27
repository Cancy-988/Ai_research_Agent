import { StateGraph } from "@langchain/langgraph";
import { InvestmentGraphState } from "./state";
import { researchNode } from "./nodes/researchNode";
import { newsNode } from "./nodes/newsNode";
import { sentimentNode } from "./nodes/sentimentNode";
import { analysisNode } from "./nodes/analysisNode";
import { decisionNode } from "./nodes/decisionNode";

/**
 * 5-node LangGraph investment research pipeline:
 *
 *   Research (tool-calling) → News Fetch → Sentiment Classification → AI Analysis → Decision
 *
 * LangSmith traces every run automatically when LANGCHAIN_TRACING_V2=true.
 */
const workflow = new StateGraph(InvestmentGraphState)
  .addNode("research", researchNode)
  .addNode("news", newsNode)
  .addNode("sentiment", sentimentNode)
  .addNode("analysis", analysisNode)
  .addNode("decision", decisionNode)

  .addEdge("__start__", "research")
  .addEdge("research", "news")
  .addEdge("news", "sentiment")
  .addEdge("sentiment", "analysis")
  .addEdge("analysis", "decision")
  .addEdge("decision", "__end__");

export const investmentGraph = workflow.compile();
