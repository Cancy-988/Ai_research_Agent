import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AnalyzerService } from "@/services/analyzer";
import { analysisCache } from "@/lib/cache";
import { checkRateLimit } from "@/lib/rateLimit";

const schema = z.object({
  company: z.string().trim().min(2, "Company name must be at least 2 characters"),
  depth: z.enum(["quick", "deep"]).default("quick"),
  context: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  // ── Rate limiting ─────────────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait before retrying." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(rate.resetInMs / 1000)) },
      }
    );
  }

  // ── Parse & validate ──────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors.map((e) => e.message).join(", ") },
      { status: 400 }
    );
  }

  const { company, depth, context } = parsed.data;
  const cacheKey = `${company.toLowerCase().trim()}-${depth}`;

  // ── Cache check ───────────────────────────────────────────────────────────
  const cached = analysisCache.get(cacheKey);
  if (cached) {
    console.log(`[API] Cache HIT — ${cacheKey}`);
    return NextResponse.json({ ...cached, meta: { ...cached.meta, cacheHit: true } });
  }

  console.log(`[API] Cache MISS — ${cacheKey}`);

  // ── Run pipeline ──────────────────────────────────────────────────────────
  try {
    const result = await AnalyzerService.analyzeCompany({ company, depth, context });
    analysisCache.set(cacheKey, result);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("[API] Pipeline error:", err?.message ?? err);

    if (err?.message?.includes("GEMINI_API_KEY") || err?.message?.includes("API_KEY")) {
      return NextResponse.json({ error: "AI service misconfigured — check GEMINI_API_KEY." }, { status: 500 });
    }
    if (err?.message?.includes("timeout") || err?.code === "ETIMEDOUT") {
      return NextResponse.json({ error: "Analysis timed out. Try Quick mode." }, { status: 504 });
    }

    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
