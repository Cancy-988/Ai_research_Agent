import { getSharedReport } from "@/lib/shareCache";
import { AnalyzeResponse } from "@/types";
import SharedReportClient from "./SharedReportClient";

export default async function SharedReportPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;
  const report: AnalyzeResponse | null = getSharedReport(hash);

  return <SharedReportClient report={report} hash={hash} />;
}
