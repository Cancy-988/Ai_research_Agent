import { InvestmentGraphState } from "../state";
import { NewsItem } from "@/types";

export async function newsNode(
  state: typeof InvestmentGraphState.State
) {
  const company = state.financialData?.name ?? state.company;
  const ticker = state.financialData?.symbol;
  console.log(`[Node: News] Fetching news for "${company}"`);

  const newsApiKey = process.env.NEWS_API_KEY;
  let newsItems: NewsItem[] = [];
  let isAiSynthesized = false;

  if (newsApiKey) {
    try {
      const q = encodeURIComponent(ticker ? `${company} ${ticker}` : company);
      const url =
        `https://newsapi.org/v2/everything?q=${q}` +
        `&sortBy=publishedAt&pageSize=6&language=en` +
        `&apiKey=${newsApiKey}`;

      const res = await fetch(url, { signal: AbortSignal.timeout(6_000) });
      const data = await res.json();

      if (data.status === "ok" && data.articles?.length > 0) {
        newsItems = (data.articles as any[])
          .filter((a) => a.title && a.title !== "[Removed]")
          .slice(0, 4)
          .map((a) => ({
            headline: a.title,
            summary: a.description ?? a.content?.slice(0, 200) ?? "",
            sentiment: "neutral" as const, // classified in sentimentNode
            source: a.source?.name ?? "Unknown",
            url: a.url,
            publishedAt: a.publishedAt,
            isAiSynthesized: false,
          }));

        console.log(`[Node: News] NewsAPI returned ${newsItems.length} articles.`);
      } else {
        console.warn("[Node: News] NewsAPI returned 0 articles — will use AI fallback.");
      }
    } catch (err) {
      console.warn("[Node: News] NewsAPI request failed:", (err as Error).message);
    }
  }

  if (newsItems.length === 0) {
    isAiSynthesized = true;
    console.log("[Node: News] Using AI-synthesized news (sentimentNode will generate).");
  }

  return { newsData: newsItems, isAiSynthesized };
}
