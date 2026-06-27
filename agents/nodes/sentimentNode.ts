import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { InvestmentGraphState } from "../state";
import { NewsItem } from "@/types";

const SentimentSchema = z.object({
  articles: z.array(
    z.object({
      headline: z.string(),
      sentiment: z.enum(["positive", "neutral", "negative"]),
      sentimentScore: z.number().min(-1).max(1),
      summary: z.string().describe("1-sentence investment-relevance summary"),
    })
  ),
});

const GeneratedNewsSchema = z.object({
  articles: z.array(
    z.object({
      headline: z.string(),
      sentiment: z.enum(["positive", "neutral", "negative"]),
      sentimentScore: z.number().min(-1).max(1),
      summary: z.string(),
      source: z.string().describe("Plausible news source e.g. Reuters, Bloomberg, CNBC"),
      publishedAt: z.string().describe("Approximate date e.g. 2025-01-15"),
    })
  ),
});

export async function sentimentNode(
  state: typeof InvestmentGraphState.State
) {
  const company = state.financialData?.name ?? state.company;
  console.log(`[Node: Sentiment] Classifying news sentiment for "${company}"`);

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.2,
    apiKey: process.env.GEMINI_API_KEY,
  });

  let processedNews: NewsItem[] = [];

  if (state.newsData && state.newsData.length > 0) {
    // Classify sentiment of real NewsAPI articles
    try {
      const structured = model.withStructuredOutput(SentimentSchema);
      const result = await structured.invoke(
        `Classify investment sentiment for each news headline about ${company}.\n\n` +
        `Articles:\n` +
        state.newsData
          .map((a, i) => `${i + 1}. "${a.headline}" — ${a.summary}`)
          .join("\n")
      );

      processedNews = state.newsData.map((article, i) => ({
        ...article,
        sentiment: result.articles[i]?.sentiment ?? "neutral",
        sentimentScore: result.articles[i]?.sentimentScore ?? 0,
        summary: result.articles[i]?.summary ?? article.summary,
      }));

      console.log(`[Node: Sentiment] Classified ${processedNews.length} real articles.`);
    } catch (err) {
      console.warn("[Node: Sentiment] Classification failed, returning unclassified news.");
      processedNews = state.newsData;
    }
  } else {
    // Generate AI-synthesized news items
    try {
      const structured = model.withStructuredOutput(GeneratedNewsSchema);
      const result = await structured.invoke(
        `Generate 4 recent, realistic, investor-relevant news items about ${company}. ` +
        `Cover a mix of: earnings/financial results, product/strategy news, regulatory or macro risks, ` +
        `and market sentiment. Vary the sentiment (at least one positive and one negative). ` +
        `Make dates realistic for late 2024 / early 2025.`
      );

      processedNews = result.articles.map((a) => ({
        headline: a.headline,
        summary: a.summary,
        sentiment: a.sentiment,
        sentimentScore: a.sentimentScore,
        source: a.source,
        publishedAt: a.publishedAt,
        isAiSynthesized: true,
        url: undefined,
      }));

      console.log(`[Node: Sentiment] Generated ${processedNews.length} AI-synthesized articles.`);
    } catch (err) {
      console.warn("[Node: Sentiment] AI news generation failed:", (err as Error).message);
      processedNews = [];
    }
  }

  return { newsData: processedNews };
}
