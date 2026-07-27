type RustboxOutput = {
  integrity?: unknown;
  stdout?: unknown;
  stderr?: unknown;
  output?: unknown;
};

type RustboxResult = RustboxOutput & {
  error?: unknown;
  message?: unknown;
  status?: unknown;
  result?: RustboxOutput;
};

type RustboxSubmission = {
  id?: unknown;
  error?: unknown;
  message?: unknown;
};

const SUBMISSION_STORAGE_KEY = "rustboxSubmissionId";
const POLL_INTERVAL_MS = 1000;
const MAX_POLL_ATTEMPTS = 60;

const isRustboxOutput = (value: unknown): value is RustboxOutput => {
  return typeof value === "object" && value !== null;
};

const formatOutput = (value: unknown): string => {
  if (typeof value === "string") {
    return value
      .replace(/^Picked up JAVA_TOOL_OPTIONS:.*(?:\r?\n|$)/gm, "")
      .trimEnd();
  }
  if (value === null || value === undefined) return "";
  return JSON.stringify(value, null, 2);
};

const wait = (milliseconds: number) => {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
};

const isComplete = (result: RustboxResult): boolean => {
  const output = isRustboxOutput(result.output) ? result.output : undefined;
  const resultOutput = isRustboxOutput(result.result?.output) ? result.result.output : undefined;
  const status = typeof result.status === "string" ? result.status.toLowerCase() : "";
  const integrity = formatOutput(result.integrity || output?.integrity || result.result?.integrity || resultOutput?.integrity).toLowerCase();

  if (["completed", "complete", "failed", "error", "finished"].includes(status)) return true;
  if (integrity === "complete") return true;

  return Boolean(
    result.stdout ||
    result.stderr ||
    output?.stdout ||
    output?.stderr ||
    result.result?.stdout ||
    result.result?.stderr ||
    resultOutput?.stdout ||
    resultOutput?.stderr
  );
};

const formatResult = (result: RustboxResult): string[] => {
  const logs: string[] = [];
  const output = isRustboxOutput(result.output) ? result.output : undefined;
  const resultOutput = isRustboxOutput(result.result?.output) ? result.result.output : undefined;
  const stdout = result.stdout || output?.stdout || output?.output || result.result?.stdout || resultOutput?.stdout || resultOutput?.output;
  const stderr = result.stderr || output?.stderr || result.result?.stderr || resultOutput?.stderr;
  const formattedStdout = formatOutput(stdout);
  const formattedStderr = formatOutput(stderr);

  if (formattedStdout) logs.push(formattedStdout);
  if (formattedStderr) logs.push(`Error: ${formattedStderr}`);
  if (logs.length === 0 && result.message) logs.push(formatOutput(result.message));

  return logs.length > 0 ? logs : ["Execution completed without output."];
};

const getResult = async (id: string): Promise<RustboxResult | null> => {
  const response = await fetch(`/api/result/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  const result: RustboxResult = await response.json();

  if (response.status === 404 || response.status === 202) return null;
  if (!response.ok) {
    throw new Error(formatOutput(result.error || result.message || "Failed to fetch result."));
  }

  return result;
};

export const executeRustbox = async (language: string, code: string, stdin = ""): Promise<string[]> => {
  try {
    const response = await fetch("/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, code, stdin }),
    });
    const submission: RustboxSubmission = await response.json();

    if (!response.ok) {
      return [`Error: ${formatOutput(submission.error || submission.message || "Failed to submit code.")}`];
    }

    if (typeof submission.id !== "string") {
      return ["Error: Rustbox did not return a submission ID."];
    }

    localStorage.setItem(SUBMISSION_STORAGE_KEY, submission.id);

    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
      const result = await getResult(submission.id);

      if (result && isComplete(result)) {
        return formatResult(result);
      }

      await wait(POLL_INTERVAL_MS);
    }

    return [`Error: Result check timed out for submission ${submission.id}.`];
  } catch (error: unknown) {
    return [`Error: ${error instanceof Error ? error.message : String(error)}`];
  }
};
