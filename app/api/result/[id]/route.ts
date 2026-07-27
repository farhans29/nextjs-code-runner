import { NextResponse } from "next/server";

const RUSTBOX_RESULT_URL = "https://api.rustbox.sh/api/result";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = process.env.RUSTBOX_SUBMISSION_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "RUSTBOX_SUBMISSION_KEY is not configured." },
      { status: 500 }
    );
  }

  try {
    const { id } = await params;
    const response = await fetch(`${RUSTBOX_RESULT_URL}/${encodeURIComponent(id)}`, {
      headers: { "X-API-Key": apiKey },
      cache: "no-store",
    });
    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.error || result.message || "Failed to fetch result." },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch result." },
      { status: 500 }
    );
  }
}
