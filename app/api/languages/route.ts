import { NextResponse } from "next/server";

const RUSTBOX_LANGUAGES_URL = "https://api.rustbox.sh/api/languages";

export async function GET() {
  const apiKey = process.env.RUSTBOX_SUBMISSION_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "RUSTBOX_SUBMISSION_KEY is not configured." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(RUSTBOX_LANGUAGES_URL, {
      headers: { "X-API-Key": apiKey },
      cache: "no-store",
    });
    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.error || result.message || "Failed to fetch languages." },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch languages." },
      { status: 500 }
    );
  }
}
