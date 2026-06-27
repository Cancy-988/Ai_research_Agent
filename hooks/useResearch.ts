import { useState, useCallback } from "react";
import { ResearchState, ResearchDepth, AnalyzeResponse, AnalysisStep } from "@/types";

const INITIAL_STEPS: AnalysisStep[] = [
  { id: "research", label: "Fetching Financial Data", status: "pending" },
  { id: "news", label: "Scanning News Sources", status: "pending" },
  { id: "sentiment", label: "Classifying News Sentiment", status: "pending" },
  { id: "analysis", label: "Running AI Analysis", status: "pending" },
  { id: "decision", label: "Validating Report", status: "pending" },
];

type FullState = ResearchState & { apiReport: AnalyzeResponse | null };

export function useResearch() {
  const [state, setState] = useState<FullState>({
    status: "idle",
    currentStepIndex: 0,
    steps: INITIAL_STEPS,
    report: null,
    apiReport: null,
    error: null,
  });

  const runAnalysis = useCallback(
    async (ticker: string, depth: ResearchDepth, context?: string) => {
      if (!ticker.trim()) {
        setState((p) => ({ ...p, error: "Company name is required" }));
        return;
      }

      setState({
        status: "loading",
        currentStepIndex: 0,
        steps: INITIAL_STEPS.map((s) => ({ ...s, status: "pending", message: undefined })),
        report: null,
        apiReport: null,
        error: null,
      });

      let active = true;
      const timers: NodeJS.Timeout[] = [];

      // Simulate step progress (aligned with actual 5-node pipeline timings)
      const stepTimings: [number, number, string][] = [
        [0, 0, "Connecting to Yahoo Finance..."],
        [1, 3000, "Scanning NewsAPI..."],
        [2, 6000, "Running LangChain sentiment model..."],
        [3, 9500, "Invoking Gemini AI..."],
        [4, 14000, "Validating & formatting report..."],
      ];

      for (const [idx, delay, msg] of stepTimings) {
        timers.push(
          setTimeout(() => {
            if (!active) return;
            setState((p) => step(p, idx, "running", msg));
            if (idx > 0) setState((p) => step(p, idx - 1, "completed"));
          }, delay)
        );
      }

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company: ticker, depth, context }),
        });

        active = false;
        timers.forEach(clearTimeout);

        if (!res.ok) {
          let msg = "Analysis failed";
          try {
            const e = await res.json();
            msg = e.error ?? msg;
          } catch { /* ignore */ }
          throw new Error(msg);
        }

        const data = (await res.json()) as AnalyzeResponse;

        setState((p) => ({
          ...p,
          status: "success",
          currentStepIndex: 5,
          steps: p.steps.map((s) => ({ ...s, status: "completed" })),
          apiReport: data,
        }));
      } catch (err: any) {
        active = false;
        timers.forEach(clearTimeout);
        setState((p) => ({
          ...p,
          status: "failed",
          steps: p.steps.map((s) =>
            s.status === "running" ? { ...s, status: "failed", message: "Failed." } : s
          ),
          error: err?.message ?? "An unexpected error occurred.",
        }));
      }
    },
    []
  );

  const resetResearch = useCallback(() => {
    setState({
      status: "idle",
      currentStepIndex: 0,
      steps: INITIAL_STEPS,
      report: null,
      apiReport: null,
      error: null,
    });
  }, []);

  return { ...state, runAnalysis, resetResearch };
}

function step(
  state: FullState,
  index: number,
  status: AnalysisStep["status"],
  message?: string
): FullState {
  const steps = [...state.steps];
  steps[index] = { ...steps[index], status, message };
  return { ...state, currentStepIndex: index, steps };
}
