import { geminiClient } from "@/lib/gemini";
import { Schema, SchemaType } from "@google/generative-ai";
import { InvestmentGraphState } from "../state";

const RESPONSE_SCHEMA: Schema = {
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
      description: "Investment thesis with the key drivers behind the score and recommendation.",
    },
  },
  required: ["company", "overview", "strengths", "risks", "investmentScore", "recommendation", "reasoning"],
};

function isRateLimitError(err: unknown): boolean {
  const msg = (err as any)?.message ?? String(err);
  return msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED");
}

async function callGemini(modelName: string, prompt: string): Promise<string> {
  const model = geminiClient.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  if (!text) throw new Error("[Node: Analysis] Empty response from Gemini.");
  return text;
}

export async function analysisNode(
  state: typeof InvestmentGraphState.State
) {
  const isDeep = state.depth === "deep";
  const newsContext =
    state.newsData && state.newsData.length > 0
      ? `\n\nRecent news context:\n${state.newsData
          .map((n) => `- [${n.sentiment.toUpperCase()}] "${n.headline}" (${n.source})`)
          .join("\n")}`
      : "";

  const prompt = (state.prompt ?? "") + newsContext;

  // Model cascade: deep → pro (preferred) → flash fallback on 429
  //                quick → flash only
  const primaryModel = isDeep ? "gemini-2.5-pro" : "gemini-2.5-flash";
  const fallbackModel = "gemini-2.5-flash";

  console.log(`[Node: Analysis] Trying ${primaryModel} (depth: ${state.depth ?? "quick"})`);

  try {
    const text = await callGemini(primaryModel, prompt);
    console.log(`[Node: Analysis] ✓ Response from ${primaryModel}`);
    return { rawAnalysis: text };
  } catch (err) {
    if (isRateLimitError(err) && primaryModel !== fallbackModel) {
      console.warn(`[Node: Analysis] ${primaryModel} quota hit — falling back to ${fallbackModel}`);
      // Brief pause before retry on the fallback model
      await new Promise((r) => setTimeout(r, 2000));
      const text = await callGemini(fallbackModel, prompt);
      console.log(`[Node: Analysis] ✓ Response from ${fallbackModel} (fallback)`);
      return { rawAnalysis: text };
    }
    // Re-throw non-429 errors or if fallback also not available
    throw err;
  }
}
