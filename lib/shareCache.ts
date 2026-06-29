import { AnalyzeResponse } from "@/types";

const TTL_MS = 60 * 60 * 1000; // 1 hour

interface ShareEntry {
  report: AnalyzeResponse;
  expiresAt: number;
}

const shareStore = new Map<string, ShareEntry>();

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash = hash >>> 0; // convert to unsigned 32-bit
  }
  return hash;
}

export function generateShareHash(company: string, ticker?: string): string {
  const seed = `${company}-${ticker ?? ""}-${Date.now()}`;
  const base = djb2(seed).toString(36);
  const extra = djb2(seed + "x").toString(36).slice(0, 4);
  return base + extra;
}

export function storeSharedReport(hash: string, report: AnalyzeResponse): void {
  shareStore.set(hash, { report, expiresAt: Date.now() + TTL_MS });
}

export function getSharedReport(hash: string): AnalyzeResponse | null {
  const entry = shareStore.get(hash);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    shareStore.delete(hash);
    return null;
  }
  return entry.report;
}
