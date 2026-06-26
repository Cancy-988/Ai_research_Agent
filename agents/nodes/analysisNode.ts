import { geminiClient } from '@/lib/gemini';
import { InvestmentGraphState } from '../state';

/**
 * Node: Analysis Node
 * Invokes Gemini 2.5 Flash with the structured prompt to generate a raw JSON research report.
 */
export async function analysisNode(state: typeof InvestmentGraphState.State) {
  console.log(`[LangGraph][Analysis Node] Initiating model call for: "${state.company}"`);

  const prompt = state.prompt;
  if (!prompt) {
    throw new Error('Analysis Node: Prompt is missing from graph state.');
  }

  // Get model configured with structured JSON outputs matching AnalyzeResponse properties
  const model = geminiClient.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          company: { 
            type: 'string', 
            description: 'The name of the company analyzed' 
          },
          overview: { 
            type: 'string', 
            description: 'Comprehensive business overview of the firm and its industry position.' 
          },
          strengths: {
            type: 'array',
            items: { type: 'string' },
            description: 'Top 3 to 5 key internal competitive strengths and technological moats.'
          },
          risks: {
            type: 'array',
            items: { type: 'string' },
            description: 'Top 3 to 5 key structural, geopolitical, or macroeconomic risks.'
          },
          investmentScore: { 
            type: 'integer', 
            description: 'A comprehensive score from 0 (avoid) to 100 (high conviction growth).' 
          },
          recommendation: { 
            type: 'string', 
            enum: ['INVEST', 'PASS'], 
            description: 'Actionable recommendation signal: INVEST or PASS.' 
          },
          reasoning: { 
            type: 'string', 
            description: 'In-depth mathematical and fundamental logic justifying the investment score.' 
          }
        },
        required: ['company', 'overview', 'strengths', 'risks', 'investmentScore', 'recommendation', 'reasoning']
      }
    }
  });

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  if (!responseText) {
    throw new Error('Analysis Node: Received empty response text from Gemini API.');
  }

  console.log(`[LangGraph][Analysis Node] Model returned structured response.`);
  
  return {
    rawAnalysis: responseText,
  };
}
