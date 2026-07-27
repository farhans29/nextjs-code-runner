import { NextResponse } from "next/server";

const RUSTBOX_API_BASE_URL = "https://api.rustbox.sh/api";
const RUSTBOX_SUBMIT_URL = `${RUSTBOX_API_BASE_URL}/submit`;

type RustboxSubmission = {
  id?: unknown;
  submissionId?: unknown;
  submission_id?: unknown;
  uuid?: unknown;
  result?: {
    id?: unknown;
    submissionId?: unknown;
    submission_id?: unknown;
    uuid?: unknown;
  };
};

const getSubmissionId = (result: RustboxSubmission): string | undefined => {
  const id = result.id || result.submissionId || result.submission_id || result.uuid || result.result?.id || result.result?.submissionId || result.result?.submission_id || result.result?.uuid;
  return typeof id === "string" ? id : undefined;
};

export async function POST(request: Request) {
  const apiKey = process.env.RUSTBOX_SUBMISSION_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "RUSTBOX_SUBMISSION_KEY is not configured." },
      { status: 500 }
    );
  }

  try {
    const { language, code, stdin = "" } = await request.json();

    if (!language || !code) {
      return NextResponse.json(
        { error: "Language and code are required." },
        { status: 400 }
      );
    }

    if (typeof language !== "string") {
      return NextResponse.json(
        { error: "Language must be a string." },
        { status: 400 }
      );
    }

    const response = await fetch(RUSTBOX_SUBMIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({ language, code, stdin }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.error || result.message || "Failed to execute code." },
        { status: response.status }
      );
    }

    const submissionId = getSubmissionId(result);

    if (!submissionId) {
      return NextResponse.json(
        { error: "Rustbox did not return a submission ID." },
        { status: 502 }
      );
    }

    return NextResponse.json({ id: submissionId });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to execute code." },
      { status: 500 }
    );
  }
}
