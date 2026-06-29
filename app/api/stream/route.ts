import { NextRequest } from "next/server";

export const maxDuration = 60;
import { z } from "zod";
import { geminiClient } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rateLimit";

const schema = z.object({
  company: z.string().trim().min(2),
  depth: z.enum(["quick", "deep"]).default("quick"),
  context: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", message: "Rate limit exceeded." })}\n\n`)
        );
        controller.close();
      },
    });
    return new Response(stream, {
      status: 429,
      headers: { "Content-Type": "text/event-stream" },
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("data: " + JSON.stringify({ type: "error", message: "Invalid JSON." }) + "\n\n", {
      status: 400,
      headers: { "Content-Type": "text/event-stream" },
    });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      "data: " + JSON.stringify({ type: "error", message: "Company name required." }) + "\n\n",
      { status: 400, headers: { "Content-Type": "text/event-stream" } }
    );
  }

  const { company, depth, context } = parsed.data;
  const modelName = depth === "deep" ? "gemini-2.5-pro" : "gemini-2.5-flash";

  const depthInstruction =
    depth === "deep"
      ? "Provide an exhaustive investment thesis covering valuation, competitive moat, macro headwinds, and risk-weighted scenario analysis."
      : "Provide a focused, rigorous investment thesis covering the 3-4 most critical drivers.";

  const prompt = `You are a senior equity research analyst. Write a detailed investment thesis for: "${company}".
${context ? `\nAdditional context: ${context}` : ""}

${depthInstruction}

Cover: business model, competitive position, key financial signals, primary risks, and a clear INVEST or PASS rationale. Write in a flowing, analytical prose style — not bullet points.`;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const model = geminiClient.getGenerativeModel({ model: modelName });
        const result = await model.generateContentStream(prompt);

        let buffer = "";
        for await (const chunk of result.stream) {
          if (req.signal.aborted) break;
          const text = chunk.text();
          if (text) {
            buffer += text;
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "token", content: text })}\n\n`
              )
            );
          }
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "complete", reasoning: buffer })}\n\n`
          )
        );
      } catch (err: any) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", message: err?.message ?? "Streaming failed." })}\n\n`
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
