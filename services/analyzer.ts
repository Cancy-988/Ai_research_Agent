import { AnalyzeRequest, AnalyzeResponse } from "@/types";
import { investmentGraph } from "@/agents/investmentGraph";

export class AnalyzerService {
  static async analyzeCompany(data: AnalyzeRequest): Promise<AnalyzeResponse> {
    console.log(`[Analyzer] Starting LangGraph pipeline for "${data.company}" (depth: ${data.depth ?? "quick"})`);

    const result = await investmentGraph.invoke({
      company: data.company,
      depth: data.depth ?? "quick",
      context: data.context,
      newsData: [],
      isAiSynthesized: false,
    });

    if (!result.finalReport) {
      throw new Error("LangGraph pipeline did not produce a final report.");
    }

    console.log(`[Analyzer] Pipeline complete.`);
    return result.finalReport;
  }
}
