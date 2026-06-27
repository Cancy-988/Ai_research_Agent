import YahooFinanceClass from "yahoo-finance2";
const yahooFinance = new (YahooFinanceClass as any)();
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { HumanMessage, ToolMessage } from "@langchain/core/messages";
import { z } from "zod";
import { InvestmentGraphState } from "../state";
import { CompanyFinancialProfile } from "@/types";

const YF_OPTS = { validateResult: false } as const;

// ─── LangChain Tools ──────────────────────────────────────────────────────────

const getStockQuoteTool = tool(
  async ({ ticker }: { ticker: string }) => {
    try {
      const data = await yahooFinance.quote(ticker, {}, YF_OPTS) as any;
      return JSON.stringify({
        currentPrice: data.regularMarketPrice,
        marketCap: data.marketCap,
        pe: data.trailingPE ?? data.forwardPE,
        eps: data.epsTrailingTwelveMonths,
        dayChangePct: data.regularMarketChangePercent,
        fiftyTwoWeekHigh: data.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: data.fiftyTwoWeekLow,
        beta: data.beta,
        dividendYield: data.trailingAnnualDividendYield ?? data.dividendYield,
        shortName: data.shortName,
        longName: data.longName,
        exchange: data.exchange ?? data.fullExchangeName,
      });
    } catch (e) {
      console.warn("[Tool: getStockQuote] Failed:", (e as Error).message);
      return "Quote data unavailable";
    }
  },
  {
    name: "get_stock_quote",
    description: "Fetch real-time stock price, market cap, P/E, EPS, and 52-week range for a ticker symbol.",
    schema: z.object({ ticker: z.string().describe("Stock ticker e.g. AAPL, MSFT, RELIANCE.NS") }),
  }
);

const getCompanyProfileTool = tool(
  async ({ ticker }: { ticker: string }) => {
    try {
      const data = await yahooFinance.quoteSummary(
        ticker,
        { modules: ["assetProfile", "financialData"] },
        YF_OPTS
      ) as any;
      return JSON.stringify({
        sector: data.assetProfile?.sector,
        industry: data.assetProfile?.industry,
        employees: data.assetProfile?.fullTimeEmployees,
        description: data.assetProfile?.longBusinessSummary?.slice(0, 600),
        revenue: data.financialData?.totalRevenue,
        grossMargin: data.financialData?.grossMargins,
        operatingMargin: data.financialData?.operatingMargins,
        returnOnEquity: data.financialData?.returnOnEquity,
        debtToEquity: data.financialData?.debtToEquity,
        freeCashFlow: data.financialData?.freeCashflow,
      });
    } catch (e) {
      console.warn("[Tool: getCompanyProfile] Failed:", (e as Error).message);
      return "Profile data unavailable";
    }
  },
  {
    name: "get_company_profile",
    description: "Fetch company sector, industry, revenue, margins, ROE, debt/equity, and free cash flow.",
    schema: z.object({ ticker: z.string() }),
  }
);

// ─── Direct fetch helper (fallback & retry) ──────────────────────────────────

async function directFetch(ticker: string, query: string): Promise<CompanyFinancialProfile | null> {
  try {
    const [quote, summary] = await Promise.all([
      yahooFinance.quote(ticker, {}, YF_OPTS).catch(() => null) as any,
      yahooFinance.quoteSummary(ticker, { modules: ["assetProfile", "financialData"] }, YF_OPTS).catch(() => null) as any,
    ]);

    if (!quote) return null;

    return {
      symbol: ticker,
      name: quote.longName ?? quote.shortName ?? query,
      exchange: quote.exchange ?? quote.fullExchangeName,
      sector: summary?.assetProfile?.sector,
      industry: summary?.assetProfile?.industry,
      marketCap: quote.marketCap,
      revenue: summary?.financialData?.totalRevenue,
      peRatio: quote.trailingPE ?? quote.forwardPE,
      eps: quote.epsTrailingTwelveMonths,
      dividendYield: quote.trailingAnnualDividendYield ?? quote.dividendYield,
      currentPrice: quote.regularMarketPrice,
      priceChange1D: quote.regularMarketChangePercent,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      beta: quote.beta,
      grossMargin: summary?.financialData?.grossMargins,
      operatingMargin: summary?.financialData?.operatingMargins,
      returnOnEquity: summary?.financialData?.returnOnEquity,
      debtToEquity: summary?.financialData?.debtToEquity,
      freeCashFlow: summary?.financialData?.freeCashflow,
      summary: summary?.assetProfile?.longBusinessSummary?.slice(0, 600),
    };
  } catch (e) {
    console.warn(`[Node: Research] Direct fetch failed for ${ticker}:`, (e as Error).message);
    return null;
  }
}

// ─── Node ────────────────────────────────────────────────────────────────────

export async function researchNode(
  state: typeof InvestmentGraphState.State
) {
  const query = state.company;
  console.log(`[Node: Research] Resolving company: "${query}"`);

  let ticker: string | null = null;
  let financialData: CompanyFinancialProfile | null = null;

  // Step 1 — Resolve ticker via Yahoo Finance search
  try {
    const searchResult = await yahooFinance.search(query, { quotesCount: 5 }, YF_OPTS) as any;
    const quotes = searchResult.quotes ?? [];
    const equity =
      quotes.find((q: any) => q.quoteType === "EQUITY") ??
      quotes.find((q: any) => q.symbol) ??
      quotes[0];
    if (equity?.symbol) {
      ticker = equity.symbol;
      console.log(`[Node: Research] Resolved "${query}" → ${ticker}`);
    } else {
      console.warn("[Node: Research] Search returned no symbols — trying raw query as ticker.");
      ticker = query.toUpperCase().replace(/\s+/g, "");
    }
  } catch (err: any) {
    console.warn(`[Node: Research] Search threw: ${err?.message ?? err} — trying raw query as ticker.`);
    ticker = query.toUpperCase().replace(/\s+/g, "");
  }

  // Step 2 — LangChain tool-calling to gather financial data
  if (ticker) {
    try {
      const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        temperature: 0,
        apiKey: process.env.GEMINI_API_KEY,
      }).bindTools([getStockQuoteTool, getCompanyProfileTool]);

      const messages: (HumanMessage | ToolMessage | any)[] = [
        new HumanMessage(
          `You are a financial data agent. Gather complete financial data for: ${query} (ticker: ${ticker}). ` +
          `Call BOTH tools: get_stock_quote AND get_company_profile for ticker "${ticker}".`
        ),
      ];

      const aiResponse = await model.invoke(messages);
      messages.push(aiResponse);

      const quoteResult: Record<string, any> = {};
      const profileResult: Record<string, any> = {};

      for (const tc of aiResponse.tool_calls ?? []) {
        const toolFn = tc.name === "get_stock_quote" ? getStockQuoteTool : getCompanyProfileTool;
        const rawResult = await toolFn.invoke(tc as any);
        const raw = typeof rawResult === "string" ? rawResult : JSON.stringify(rawResult);
        messages.push(new ToolMessage({ content: raw, tool_call_id: tc.id! }));
        try {
          const parsed = JSON.parse(raw);
          if (tc.name === "get_stock_quote") Object.assign(quoteResult, parsed);
          else Object.assign(profileResult, parsed);
        } catch { /* tool returned error string */ }
      }

      if (Object.keys(quoteResult).length > 0 || Object.keys(profileResult).length > 0) {
        financialData = {
          symbol: ticker,
          name: quoteResult.longName ?? quoteResult.shortName ?? query,
          exchange: quoteResult.exchange,
          sector: profileResult.sector,
          industry: profileResult.industry,
          marketCap: quoteResult.marketCap,
          revenue: profileResult.revenue,
          peRatio: quoteResult.pe,
          eps: quoteResult.eps,
          dividendYield: quoteResult.dividendYield,
          currentPrice: quoteResult.currentPrice,
          priceChange1D: quoteResult.dayChangePct,
          fiftyTwoWeekHigh: quoteResult.fiftyTwoWeekHigh,
          fiftyTwoWeekLow: quoteResult.fiftyTwoWeekLow,
          beta: quoteResult.beta,
          grossMargin: profileResult.grossMargin,
          operatingMargin: profileResult.operatingMargin,
          returnOnEquity: profileResult.returnOnEquity,
          debtToEquity: profileResult.debtToEquity,
          freeCashFlow: profileResult.freeCashFlow,
          summary: profileResult.description,
        };
        console.log(`[Node: Research] Tool-calling complete for ${ticker} — got ${Object.keys(quoteResult).length} quote fields`);
      } else {
        console.warn("[Node: Research] Tool-calling returned empty results, falling back to direct fetch.");
        financialData = await directFetch(ticker, query);
      }
    } catch (err: any) {
      console.warn(`[Node: Research] Tool-calling threw: ${err?.message ?? err} — falling back.`);
      financialData = await directFetch(ticker, query);
    }
  }

  if (financialData) {
    console.log(`[Node: Research] Financial data ready: ${financialData.symbol} (${financialData.name})`);
  } else {
    console.warn("[Node: Research] No financial data — AI-only analysis.");
  }

  // Step 3 — Build prompt for analysis node
  const contextBlock = financialData
    ? `Real-time financial data (Yahoo Finance via LangChain tool calls):\n${JSON.stringify(financialData, null, 2)}`
    : `No financial data available. Conduct analysis from training knowledge for: "${query}".`;

  const userContext = state.context ? `\n\nAdditional analyst context: ${state.context}` : "";
  const depthInstruction =
    state.depth === "deep"
      ? "Provide exhaustive institutional-grade depth: detailed valuation rationale, competitive moat analysis, macro tail/headwinds, and scenario-based risk weighting."
      : "Provide a focused, concise analysis covering the most critical investment signals.";

  const prompt = `You are a senior equity research analyst at a tier-1 investment bank. Conduct a rigorous investment analysis of: "${query}".

${contextBlock}
${userContext}

${depthInstruction}

Return a structured JSON report per the response schema.`;

  return { financialData, prompt };
}
