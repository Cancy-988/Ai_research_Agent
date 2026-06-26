import yahooFinance from 'yahoo-finance2';
import { InvestmentGraphState } from '../state';
import { CompanyFinancialProfile } from '@/types';

/**
 * Node: Research Node
 * Resolves the company query to a stock ticker, fetches real-time financial metrics 
 * from Yahoo Finance, and builds a comprehensive context-aware prompt.
 */
export async function researchNode(state: typeof InvestmentGraphState.State) {
  console.log(`[LangGraph][Research Node] Resolving company information for query: "${state.company}"`);
  
  const query = state.company;
  if (!query) {
    throw new Error('Research Node: Company name query is missing from graph state.');
  }

  let financialData: CompanyFinancialProfile | null = null;

  try {
    // 1. Search for the ticker symbol based on company name
    const searchResult = await yahooFinance.search(query);
    const quotes = searchResult.quotes || [];
    
    // Prioritize equity listings to avoid index/option tickers
    const stockQuote = quotes.find(q => q.quoteType === 'EQUITY') || quotes[0];
    
    if (stockQuote && stockQuote.symbol) {
      const ticker = stockQuote.symbol;
      console.log(`[LangGraph][Research Node] Resolved "${query}" to ticker: "${ticker}"`);

      // 2. Fetch quote detail and summary modules concurrently
      const [quoteData, summaryData] = await Promise.all([
        yahooFinance.quote(ticker).catch(() => null),
        yahooFinance.quoteSummary(ticker, {
          modules: ['assetProfile', 'financialData']
        }).catch(() => null)
      ]);

      if (quoteData) {
        financialData = {
          symbol: ticker,
          name: quoteData.longName || quoteData.shortName || stockQuote.longname || ticker,
          industry: summaryData?.assetProfile?.industry,
          sector: summaryData?.assetProfile?.sector,
          marketCap: quoteData.marketCap,
          revenue: summaryData?.financialData?.totalRevenue,
          peRatio: quoteData.trailingPE || quoteData.forwardPE,
          eps: quoteData.epsTrailingTwelveMonths,
          dividendYield: quoteData.trailingAnnualDividendYield || quoteData.dividendYield,
          summary: summaryData?.assetProfile?.longBusinessSummary
        };
        console.log(`[LangGraph][Research Node] Successfully fetched real-time financial metrics for ${ticker}`);
      }
    } else {
      console.log(`[LangGraph][Research Node] Could not resolve search quote for: "${query}". Proceeding without market data.`);
    }
  } catch (err: any) {
    // Continue gracefully if Yahoo Finance API fails or is geoblocked
    console.error(`[LangGraph][Research Node] Error retrieving Yahoo Finance data:`, err?.message || err);
    console.log(`[LangGraph][Research Node] Continuing gracefully with raw query context.`);
  }

  // 3. Construct prompt based on retrieved data (with fallback handling)
  let contextPrompt = '';
  if (financialData) {
    contextPrompt = `
Real-time financial profile retrieved from Yahoo Finance for ${financialData.name} (${financialData.symbol}):
- Official Name: ${financialData.name}
- Ticker Symbol: ${financialData.symbol}
- Sector: ${financialData.sector || 'N/A'}
- Industry: ${financialData.industry || 'N/A'}
- Market Cap: ${financialData.marketCap ? '$' + financialData.marketCap.toLocaleString('en-US') : 'N/A'}
- Annual Revenue: ${financialData.revenue ? '$' + financialData.revenue.toLocaleString('en-US') : 'N/A'}
- P/E Ratio: ${financialData.peRatio ?? 'N/A'}
- Earnings Per Share (EPS): ${financialData.eps ?? 'N/A'}
- Dividend Yield: ${financialData.dividendYield ? (financialData.dividendYield * 100).toFixed(2) + '%' : 'N/A'}
- Business Summary: ${financialData.summary || 'N/A'}
`;
  } else {
    contextPrompt = `No direct financial statistics could be retrieved from yFinance. Perform standard equity research based on general knowledge for: "${query}".`;
  }

  const analysisPrompt = `Conduct a rigorous, professional equity research study and investment analysis on the following company query: "${query}".
Here is the real-time financial profile context retrieved for the company:
${contextPrompt}

Based on this real-time financial context, verify the company overview, strengths, risks, investment score, and recommendation rating.
Ensure the overview is detailed, strengths and risks capture actual market conditions, the score is balanced (out of 100), the recommendation is either INVEST or PASS based on standard valuation risk assessments, and the reasoning is mathematically sound and highly analytical.
Return your findings strictly in the requested JSON structure.`;

  console.log(`[LangGraph][Research Node] Structured prompt successfully constructed.`);

  return {
    financialData,
    prompt: analysisPrompt,
  };
}
