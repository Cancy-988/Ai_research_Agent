import { useState, useCallback } from 'react';
import { ResearchState, ResearchDepth, AnalyzeResponse, AnalysisStep } from '@/types';

const INITIAL_STEPS: AnalysisStep[] = [
  { id: 'fetch', label: 'Retrieving Company Profile', status: 'pending' },
  { id: 'swot', label: 'Analyzing Strengths & Risks', status: 'pending' },
  { id: 'score', label: 'Calculating Investment Score', status: 'pending' },
  { id: 'synthesize', label: 'Formatting Investment Recommendation', status: 'pending' },
];

export function useResearch() {
  const [state, setState] = useState<ResearchState & { apiReport: AnalyzeResponse | null }>({
    status: 'idle',
    currentStepIndex: 0,
    steps: INITIAL_STEPS,
    report: null, // Legacy field
    apiReport: null, // New field for Gemini structured response
    error: null,
  });

  const runAnalysis = useCallback(async (ticker: string, depth: ResearchDepth, context?: string) => {
    if (!ticker.trim()) {
      setState(prev => ({ ...prev, error: 'Company name is required' }));
      return;
    }

    // Reset state for new run
    setState({
      status: 'loading',
      currentStepIndex: 0,
      steps: INITIAL_STEPS.map(step => ({ ...step, status: 'pending', message: undefined })),
      report: null,
      apiReport: null,
      error: null,
    });

    // We'll manage progress animations while the real API request runs
    let active = true;
    const progressTimers: NodeJS.Timeout[] = [];

    const triggerStepProgress = async () => {
      if (!active) return;
      // 1. Fetching Profile
      setState(prev => updateStep(prev, 0, 'running', 'Connecting to Gemini 2.5 Flash...'));
      
      progressTimers.push(setTimeout(() => {
        if (!active) return;
        setState(prev => updateStep(prev, 0, 'completed', 'Profile retrieved.'));
        setState(prev => updateStep(prev, 1, 'running', 'Extracting core business factors...'));
      }, 2000));

      progressTimers.push(setTimeout(() => {
        if (!active) return;
        setState(prev => updateStep(prev, 1, 'completed', 'Strengths and risks mapped.'));
        setState(prev => updateStep(prev, 2, 'running', 'Determining capital risk score...'));
      }, 4000));

      progressTimers.push(setTimeout(() => {
        if (!active) return;
        setState(prev => updateStep(prev, 2, 'completed', 'Score calculated.'));
        setState(prev => updateStep(prev, 3, 'running', 'Writing final analysis report...'));
      }, 6000));
    };

    triggerStepProgress();

    try {
      // Perform the actual API call
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company: ticker }),
      });

      active = false;
      progressTimers.forEach(clearTimeout);

      if (!response.ok) {
        let errMsg = 'Failed to analyze company';
        try {
          const errData = await response.json();
          errMsg = errData.error || errMsg;
        } catch {}
        throw new Error(errMsg);
      }

      const resultData = (await response.json()) as AnalyzeResponse;

      setState(prev => ({
        ...prev,
        status: 'success',
        currentStepIndex: 4,
        steps: prev.steps.map(step => ({ ...step, status: 'completed' })),
        apiReport: resultData,
      }));

    } catch (err: any) {
      active = false;
      progressTimers.forEach(clearTimeout);
      
      setState(prev => ({
        ...prev,
        status: 'failed',
        steps: prev.steps.map(step => 
          step.status === 'running' ? { ...step, status: 'failed', message: 'Failed here.' } : step
        ),
        error: err?.message || 'An error occurred during Gemini analysis.',
      }));
    }
  }, []);

  const resetResearch = useCallback(() => {
    setState({
      status: 'idle',
      currentStepIndex: 0,
      steps: INITIAL_STEPS,
      report: null,
      apiReport: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    runAnalysis,
    resetResearch,
  };
}

function updateStep(
  state: ResearchState & { apiReport: AnalyzeResponse | null },
  index: number,
  status: AnalysisStep['status'],
  message?: string
): ResearchState & { apiReport: AnalyzeResponse | null } {
  const nextSteps = [...state.steps];
  nextSteps[index] = {
    ...nextSteps[index],
    status,
    message,
  };

  return {
    ...state,
    currentStepIndex: index,
    steps: nextSteps,
  };
}
