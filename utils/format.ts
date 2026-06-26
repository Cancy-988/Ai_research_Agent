/**
 * Formatting utilities for financial numbers and labels.
 */

/**
 * Formats a number as USD currency.
 */
export function formatCurrency(value?: number): string {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats a number as a percentage.
 */
export function formatPercent(value?: number): string {
  if (value === undefined || value === null) return 'N/A';
  // If the value is a fraction (e.g. 0.15 for 15%), we multiply by 100 or format as is.
  // Standardizing to assume the value is already in percentage units (e.g. 15 for 15%).
  return `${value.toFixed(2)}%`;
}

/**
 * Formats large financial numbers (e.g. market cap) into readable strings (Million, Billion, Trillion).
 */
export function formatCompactNumber(value?: number): string {
  if (value === undefined || value === null) return 'N/A';
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)}T`;
  }
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  return value.toLocaleString();
}

/**
 * Formats an ISO date string into a friendly, local representation.
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'N/A';
  }
}
