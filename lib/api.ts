type RustboxOutput = {
  integrity?: unknown;
  stdout?: unknown;
  stderr?: unknown;
  output?: unknown;
  cpu_time?: unknown;
  cpuTime?: unknown;
  wall_time?: unknown;
  wallTime?: unknown;
  cpu_wall?: unknown;
  cpuWall?: unknown;
  memory?: unknown;
  memory_peak?: unknown;
  memoryPeak?: unknown;
  memory_limit?: unknown;
  cpu_time_secs?: unknown;
  wall_time_secs?: unknown;
  memory_peak_bytes?: unknown;
  memory_limit_bytes?: unknown;
  memoryLimit?: unknown;
  metrics?: unknown;
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

export type ExecutionMetrics = {
  cpuTime?: string;
  wallTime?: string;
  cpuWall?: string;
  memoryPeak?: string;
  memoryLimit?: string;
};

export type ExecutionResult = {
  output: string[];
  metrics?: ExecutionMetrics;
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

const formatMetric = (value: unknown): string | undefined => {
  if (typeof value === "string" || typeof value === "number") return String(value);
  return undefined;
};

const getExecutionMetrics = (result: RustboxResult): ExecutionMetrics | undefined => {
  const output = isRustboxOutput(result.output) ? result.output : undefined;
  const resultOutput = isRustboxOutput(result.result?.output) ? result.result.output : undefined;
  const rawMetrics = [result.metrics, output?.metrics, result.result?.metrics, resultOutput?.metrics].filter(isRustboxOutput);
  const sources = [result, output, result.result, resultOutput, ...rawMetrics];
  const getMetric = (...keys: (keyof RustboxOutput)[]) => {
    for (const source of sources) {
      if (!source) continue;
      for (const key of keys) {
        const value = formatMetric(source[key]);
        if (value !== undefined) return value;
      }
    }
    return undefined;
  };

  const metrics = {
    cpuTime: getMetric("cpu_time_secs", "cpu_time", "cpuTime"),
    wallTime: getMetric("wall_time_secs", "wall_time", "wallTime"),
    cpuWall: getMetric("cpu_wall", "cpuWall"),
    memoryPeak: getMetric("memory_peak_bytes", "memory_peak", "memoryPeak", "memory"),
    memoryLimit: getMetric("memory_limit_bytes", "memory_limit", "memoryLimit"),
  };

  return Object.values(metrics).some(Boolean) ? metrics : undefined;
};

const formatResult = (result: RustboxResult): ExecutionResult => {
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

  return {
    output: logs.length > 0 ? logs : ["Execution completed without output."],
    metrics: getExecutionMetrics(result),
  };
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

export const executeRustbox = async (language: string, code: string, stdin = ""): Promise<ExecutionResult> => {
  try {
    const response = await fetch("/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, code, stdin }),
    });
    const submission: RustboxSubmission = await response.json();

    if (!response.ok) {
      return { output: [`Error: ${formatOutput(submission.error || submission.message || "Failed to submit code.")}`] };
    }

    if (typeof submission.id !== "string") {
      return { output: ["Error: Rustbox did not return a submission ID."] };
    }

    localStorage.setItem(SUBMISSION_STORAGE_KEY, submission.id);

    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
      const result = await getResult(submission.id);

      if (result && isComplete(result)) {
        return formatResult(result);
      }

      await wait(POLL_INTERVAL_MS);
    }

    return { output: [`Error: Result check timed out for submission ${submission.id}.`] };
  } catch (error: unknown) {
    return { output: [`Error: ${error instanceof Error ? error.message : String(error)}`] };
  }
};
