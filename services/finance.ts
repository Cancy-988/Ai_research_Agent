import { FinancialMetrics } from '@/types';

/**
 * Service to fetch financial data and metrics for a given stock ticker.
 */
export class FinanceService {
  /**
   * Fetches real-time financial metrics for the company.
   */
  static async getCompanyMetrics(ticker: string): Promise<FinancialMetrics> {
    // Mock simulation for initial setup
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const formattedTicker = ticker.toUpperCase();
    
    // Return sample mock data based on ticker
    if (formattedTicker === 'AAPL') {
      return {
        peRatio: 31.42,
        pbRatio: 48.2,
        marketCap: 3250000000000,
        revenueGrowths5Yr: 8.5,
        debtToEquity: 1.45,
        roe: 154.27,
        freeCashFlow: 104000000000,
      };
    }

    return {
      peRatio: 22.5,
      pbRatio: 4.1,
      marketCap: 45000000000,
      revenueGrowths5Yr: 12.3,
      debtToEquity: 0.85,
      roe: 18.2,
      freeCashFlow: 3500000000,
    };
  }

  /**
   * Fetches recent news and articles for market sentiment analysis.
   */
  static async getCompanyNews(ticker: string): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      `${ticker.toUpperCase()} reports strong quarterly revenue matching expectations.`,
      `Analysts upgrade target price for ${ticker.toUpperCase()} ahead of product launch.`,
      `Market trends see increased institutional ownership in ${ticker.toUpperCase()}.`,
    ];
  }
}
