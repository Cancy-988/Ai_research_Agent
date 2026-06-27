"use client";
import { AnalyzeResponse } from "@/types";
import CompanyOverviewCard from "./dashboard/CompanyOverviewCard";
import FinancialMetricsGrid from "./dashboard/FinancialMetricsGrid";
import InvestmentScoreGauge from "./dashboard/InvestmentScoreGauge";
import StrengthsSection from "./dashboard/StrengthsSection";
import RisksSection from "./dashboard/RisksSection";
import RecentNewsSection from "./dashboard/RecentNewsSection";
import AIReasoningSection from "./dashboard/AIReasoningSection";
import ActionBar from "./dashboard/ActionBar";

interface Props {
  report: AnalyzeResponse;
  onReset: () => void;
}

export default function ReportView({ report, onReset }: Props) {
  return (
    <div id="dashboard-root" className="space-y-6 relative z-10">

      {/* 1 — Company header + recommendation */}
      <CompanyOverviewCard report={report} />

      {/* 2 — Score gauge + financial metrics side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <InvestmentScoreGauge
            score={report.investmentScore}
            recommendation={report.recommendation}
          />
        </div>
        <div className="lg:col-span-2">
          <FinancialMetricsGrid
            profile={report.financialProfile}
            benchmark={report.sectorBenchmark}
          />
        </div>
      </div>

      {/* 3 — Strengths & Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StrengthsSection strengths={report.strengths} />
        <RisksSection risks={report.risks} />
      </div>

      {/* 4 — News */}
      <RecentNewsSection newsItems={report.newsItems} />

      {/* 5 — AI Reasoning */}
      <AIReasoningSection
        reasoning={report.reasoning}
        company={report.company}
        depth={report.meta?.depth}
      />

      {/* 6 — Action bar */}
      <ActionBar report={report} onReset={onReset} />
    </div>
  );
}
