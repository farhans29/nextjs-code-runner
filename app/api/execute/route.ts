import { NextResponse } from "next/server";

const RUSTBOX_API_BASE_URL = "https://api.rustbox.sh/api";
const RUSTBOX_SUBMIT_URL = `${RUSTBOX_API_BASE_URL}/submit`;
const RUSTBOX_LANGUAGES_URL = `${RUSTBOX_API_BASE_URL}/languages`;

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

type RustboxLanguage = string | {
  id?: unknown;
  language?: unknown;
  name?: unknown;
  aliases?: unknown;
};

const getSubmissionId = (result: RustboxSubmission): string | undefined => {
  const id = result.id || result.submissionId || result.submission_id || result.uuid || result.result?.id || result.result?.submissionId || result.result?.submission_id || result.result?.uuid;
  return typeof id === "string" ? id : undefined;
};

const normalizeLanguage = (value: unknown): string | undefined => {
  return typeof value === "string" ? value.toLowerCase() : undefined;
};

const getLanguages = async (apiKey: string): Promise<Set<string>> => {
  const response = await fetch(RUSTBOX_LANGUAGES_URL, {
    headers: { "X-API-Key": apiKey },
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || result.message || "Failed to fetch languages.");
  }

  const languages = Array.isArray(result) ? result : result.languages;

  if (!Array.isArray(languages)) {
    return new Set();
  }

  return languages.reduce((items: Set<string>, item: RustboxLanguage) => {
    if (typeof item === "string") {
      items.add(item.toLowerCase());
      return items;
    }

    const id = normalizeLanguage(item.id);
    const language = normalizeLanguage(item.language);
    const name = normalizeLanguage(item.name);

    if (id) items.add(id);
    if (language) items.add(language);
    if (name) items.add(name);
    if (Array.isArray(item.aliases)) {
      item.aliases.forEach((alias) => {
        const normalizedAlias = normalizeLanguage(alias);
        if (normalizedAlias) items.add(normalizedAlias);
      });
    }

    return items;
  }, new Set<string>());
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

    const normalizedLanguage = normalizeLanguage(language);

    if (!normalizedLanguage) {
      return NextResponse.json(
        { error: "Language must be a string." },
        { status: 400 }
      );
    }

    const languages = await getLanguages(apiKey);

    if (languages.size > 0 && !languages.has(normalizedLanguage)) {
      return NextResponse.json(
        { error: `${language} is not supported by Rustbox.` },
        { status: 400 }
      );
    }

    const response = await fetch(RUSTBOX_SUBMIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({ language: normalizedLanguage, code, stdin }),
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
