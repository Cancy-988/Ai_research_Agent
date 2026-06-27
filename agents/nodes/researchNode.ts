import yahooFinance from "yahoo-finance2";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { HumanMessage, ToolMessage } from "@langchain/core/messages";
import { z } from "zod";
import { InvestmentGraphState } from "../state";
import { CompanyFinancialProfile } from "@/types";

// ─── LangChain Tools ──────────────────────────────────────────────────────────

const getStockQuoteTool = tool(
  async ({ ticker }: { ticker: string }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await yahooFinance.quote(ticker) as any;
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
      });
    } catch {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await yahooFinance.quoteSummary(ticker, {
        modules: ["assetProfile", "financialData"],
      }) as any;
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
    } catch {
      return "Profile data unavailable";
    }
  },
  {
    name: "get_company_profile",
    description: "Fetch company sector, industry, revenue, margins, ROE, debt/equity, and free cash flow.",
    schema: z.object({ ticker: z.string() }),
  }
);

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
    const searchResult = await yahooFinance.search(query) as any;
    const equity = searchResult.quotes?.find((q: any) => q.quoteType === "EQUITY") ?? searchResult.quotes?.[0];
    if (equity?.symbol) {
      ticker = equity.symbol;
      console.log(`[Node: Research] Resolved "${query}" → ${ticker}`);
    }
  } catch (err) {
    console.warn("[Node: Research] Search failed, proceeding with raw query.");
  }

  // Step 2 — LangChain tool-calling agent to gather financial data
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
          `Call both available tools to fetch the stock quote AND company profile.`
        ),
      ];

      const aiResponse = await model.invoke(messages);
      messages.push(aiResponse);

      // Execute all tool calls the model requested
      const quoteResult: Record<string, any> = {};
      const profileResult: Record<string, any> = {};

      for (const tc of aiResponse.tool_calls ?? []) {
        const toolFn = tc.name === "get_stock_quote" ? getStockQuoteTool : getCompanyProfileTool;
        const raw = await toolFn.invoke(tc as any);
        messages.push(new ToolMessage({ content: raw, tool_call_id: tc.id! }));

        try {
          const parsed = JSON.parse(raw as string);
          if (tc.name === "get_stock_quote") Object.assign(quoteResult, parsed);
          else Object.assign(profileResult, parsed);
        } catch { /* tool returned a string error */ }
      }

      financialData = {
        symbol: ticker,
        name: quoteResult.longName ?? quoteResult.shortName ?? query,
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

      console.log(`[Node: Research] Tool-calling complete for ${ticker}`);
    } catch (err) {
      console.warn("[Node: Research] Tool-calling failed, falling back to direct fetch.");

      // Fallback: direct Yahoo Finance fetch
      try {
        const [quote, summary] = await Promise.all([
          (yahooFinance.quote(ticker) as any).catch(() => null),
          (yahooFinance.quoteSummary(ticker, { modules: ["assetProfile", "financialData"] }) as any).catch(() => null),
        ]);

        if (quote) {
          financialData = {
            symbol: ticker,
            name: quote.longName ?? quote.shortName ?? query,
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
            summary: summary?.assetProfile?.longBusinessSummary,
          };
        }
      } catch { /* proceed without financial data */ }
    }
  }

  // Step 3 — Build prompt for analysis node
  const contextBlock = financialData
    ? `Real-time financial data (Yahoo Finance / LangChain tool call):
${JSON.stringify(financialData, null, 2)}`
    : `No financial data retrieved. Use your training knowledge for: "${query}".`;

  const userContext = state.context ? `\n\nAdditional analyst instructions: ${state.context}` : "";
  const depthInstruction =
    state.depth === "deep"
      ? "Provide exhaustive institutional-grade depth: detailed valuation rationale, competitive moat analysis, macro tail/headwinds, and scenario-based risk weighting."
      : "Provide a focused, concise analysis hitting the most critical signals.";

  const prompt = `You are a senior equity research analyst. Conduct a rigorous investment analysis of: "${query}".

${contextBlock}
${userContext}

${depthInstruction}

Return a structured JSON report per the response schema.`;

  return { financialData, prompt };
}
