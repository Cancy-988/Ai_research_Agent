import { AnalyzeRequest, AnalyzeResponse } from '@/types';
import { investmentGraph } from '@/agents/investmentGraph';

/**
 * Service responsible for orchestrating company investment analysis.
 * Integrates directly with the LangGraph state graph workflow.
 */
export class AnalyzerService {
  /**
   * Run the investment analysis for the specified company using LangGraph.
   * @param data The analysis request containing the company name.
   */
  static async analyzeCompany(data: AnalyzeRequest): Promise<AnalyzeResponse> {
    console.log(`[Analyzer Service] Invoking LangGraph workflow for company: "${data.company}"`);
    
    // Invoke the compiled state graph workflow
    const result = await investmentGraph.invoke({
      company: data.company,
    });

    // Check for output validation in final state
    if (!result.finalReport) {
      throw new Error('LangGraph Workflow: Failed to generate the final analysis report.');
    }

    console.log(`[Analyzer Service] LangGraph analysis completed successfully.`);
    return result.finalReport;
  }
}
