import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;
import { z } from "zod";
import { AnalyzerService } from "@/services/analyzer";
import { checkRateLimit } from "@/lib/rateLimit";
import { CompareResponse } from "@/types";

const schema = z.object({
  companies: z.tuple([
    z.string().trim().min(2),
    z.string().trim().min(2),
  ]),
  depth: z.enum(["quick", "deep"]).default("quick"),
});

export async function POST(req: NextRequest) {
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Exactly 2 company names required (min 2 chars each)." },
      { status: 400 }
    );
  }

  const { companies, depth } = parsed.data;

  // Detect same ticker entered twice
  if (companies[0].toLowerCase().trim() === companies[1].toLowerCase().trim()) {
    return NextResponse.json(
      { error: "Please enter two different companies for comparison." },
      { status: 400 }
    );
  }

  const [result0, result1] = await Promise.allSettled([
    AnalyzerService.analyzeCompany({ company: companies[0], depth }),
    AnalyzerService.analyzeCompany({ company: companies[1], depth }),
  ]);

  // If both failed
  if (result0.status === "rejected" && result1.status === "rejected") {
    const msg0: string = result0.reason?.message ?? "";
    const isQuota = msg0.includes("429") || msg0.includes("quota") || msg0.includes("RESOURCE_EXHAUSTED");
    return NextResponse.json(
      {
        error: isQuota
          ? "Gemini API quota exceeded. Comparison runs two pipelines simultaneously and uses 2× quota. Wait a minute and retry."
          : "Both analyses failed. Please try again.",
      },
      { status: isQuota ? 429 : 500 }
    );
  }

  // If one failed — 207 Multi-Status
  if (result0.status === "rejected" || result1.status === "rejected") {
    return NextResponse.json(
      {
        results: [
          result0.status === "fulfilled" ? result0.value : null,
          result1.status === "fulfilled" ? result1.value : null,
        ],
        errors: [
          result0.status === "rejected" ? result0.reason?.message : null,
          result1.status === "rejected" ? result1.reason?.message : null,
        ],
      },
      { status: 207 }
    );
  }

  const r0 = result0.value;
  const r1 = result1.value;
  const winner =
    r0.investmentScore >= r1.investmentScore ? r0.company : r1.company;
  const delta = Math.abs(r0.investmentScore - r1.investmentScore);

  const response: CompareResponse = {
    companies: [r0, r1],
    winner,
    delta,
  };

  return NextResponse.json(response, { status: 200 });
}
