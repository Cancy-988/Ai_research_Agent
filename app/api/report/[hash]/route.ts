import { NextRequest, NextResponse } from "next/server";
import { getSharedReport } from "@/lib/shareCache";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params;
  const report = getSharedReport(hash);

  if (!report) {
    return NextResponse.json(
      { error: "Report expired or not found. Re-analyze to generate a new link." },
      { status: 404 }
    );
  }

  return NextResponse.json(report);
}
