import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AnalyzeResponse } from "@/types";

const apiKey = process.env.GEMINI_API_KEY;

export const geminiClient = new GoogleGenerativeAI(apiKey || "");

export class GeminiService {
  /**
   * Generates a structured investment report for a company using Gemini 2.5 Flash.
   * Forces JSON response format adhering exactly to the AnalyzeResponse schema.
   */
  static async generateInvestmentAnalysis(company: string): Promise<AnalyzeResponse> {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables. Please check your .env.local file.");
    }

    const model = geminiClient.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            company: {
              type: SchemaType.STRING,
              description: "The name of the company analyzed (e.g. Tesla, Inc.)"
            },
            overview: {
              type: SchemaType.STRING,
              description: "A comprehensive, institutional-grade business overview of the firm and its industry position."
            },
            strengths: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: "Top 3 to 5 key internal competitive strengths and technological moats."
            },
            risks: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: "Top 3 to 5 key structural, geopolitical, or macroeconomic risks."
            },
            investmentScore: {
              type: SchemaType.INTEGER,
              description: "A comprehensive score from 0 (extremely risky/avoid) to 100 (high conviction growth)."
            },
            recommendation: {
              type: SchemaType.STRING,
              format: "enum",
              enum: ["INVEST", "PASS"],
              description: "Actionable recommendation signal: INVEST or PASS."
            },
            reasoning: {
              type: SchemaType.STRING,
              description: "In-depth mathematical and fundamental logic justifying the investment score and recommendation."
            }
          },
          required: ["company", "overview", "strengths", "risks", "investmentScore", "recommendation", "reasoning"]
        }
      }
    });

    const prompt = `Conduct a rigorous, professional equity research study and investment analysis on the following company name/query: "${company}".
Analyze its market share, financial stability indicators, technological advantages, competitive rivalries, and structural weaknesses.
Return your findings strictly in the requested JSON structure.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    try {
      const parsedData = JSON.parse(responseText) as AnalyzeResponse;
      
      // Secondary validation to ensure recommendation is type-compatible
      if (parsedData.recommendation !== "INVEST" && parsedData.recommendation !== "PASS") {
        parsedData.recommendation = "PASS"; // Default safety fallback
      }
      
      return parsedData;
    } catch (e) {
      console.error("Failed to parse structured JSON from Gemini:", responseText);
      throw new Error(`Invalid structured output returned from Gemini: ${e instanceof Error ? e.message : e}`);
    }
  }
}
