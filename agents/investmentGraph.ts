import { StateGraph } from "@langchain/langgraph";
import { InvestmentGraphState } from "./state";
import { researchNode } from "./nodes/researchNode";
import { analysisNode } from "./nodes/analysisNode";
import { decisionNode } from "./nodes/decisionNode";

/**
 * Stateful LangGraph orchestration workflow for company analysis.
 * Arranges nodes sequentially: Start -> Research -> Analysis -> Decision -> End.
 * Custom nodes can be added by declaring them and adjusting layout edges.
 */
const workflow = new StateGraph(InvestmentGraphState)
  // Register workflow nodes
  .addNode("research", researchNode)
  .addNode("analysis", analysisNode)
  .addNode("decision", decisionNode)

  // Configure transition edges
  .addEdge("__start__", "research")
  .addEdge("research", "analysis")
  .addEdge("analysis", "decision")
  .addEdge("decision", "__end__");

// Compile the runnable graph workflow
export const investmentGraph = workflow.compile();
