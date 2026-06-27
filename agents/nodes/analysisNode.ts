import { geminiClient } from "@/lib/gemini";
import { SchemaType } from "@google/generative-ai";
import { InvestmentGraphState } from "../state";

export async function analysisNode(
  state: typeof InvestmentGraphState.State
) {
  const isDeep = state.depth === "deep";
  const modelName = isDeep ? "gemini-2.5-pro" : "gemini-2.5-flash";
  console.log(`[Node: Analysis] Running ${modelName} (depth: ${state.depth ?? "quick"})`);

  const newsContext =
    state.newsData && state.newsData.length > 0
      ? `\n\nRecent news context:\n${state.newsData
          .map((n) => `- [${n.sentiment.toUpperCase()}] "${n.headline}" (${n.source})`)
          .join("\n")}`
      : "";

  const prompt = (state.prompt ?? "") + newsContext;

  const model = geminiClient.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          company: { type: SchemaType.STRING, description: "Full official company name" },
          overview: {
            type: SchemaType.STRING,
            description: "2-3 sentence institutional-grade business overview covering products, market position, and key financials.",
          },
          strengths: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "4-5 key internal competitive strengths and technological moats.",
          },
          risks: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "4-5 key structural, regulatory, or macro risks and headwinds.",
          },
          investmentScore: {
            type: SchemaType.INTEGER,
            description: "Conviction score 0 (avoid) to 100 (high-conviction buy).",
          },
          recommendation: {
            type: SchemaType.STRING,
            format: "enum",
            enum: ["INVEST", "PASS"],
            description: "Clear actionable signal: INVEST or PASS.",
          },
          reasoning: {
            type: SchemaType.STRING,
            description:
              isDeep
                ? "Exhaustive investment thesis: valuation analysis, competitive positioning, risk-weighted scenario analysis, and quantitative rationale behind the score."
                : "Concise but rigorous investment thesis with the 3-4 most critical drivers of the score.",
          },
        },
        required: ["company", "overview", "strengths", "risks", "investmentScore", "recommendation", "reasoning"],
      },
    },
  });

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  if (!responseText) throw new Error("[Node: Analysis] Empty response from Gemini.");

  console.log(`[Node: Analysis] Response received. Model: ${modelName}`);
  return { rawAnalysis: responseText };
}
