export const runJavaScript = (code: string, stdin = ""): string[] => {
  const logs: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  console.log = (...args) => logs.push(args.map(arg => String(arg)).join(" "));
  console.error = (...args) => logs.push(`Error: ${args.map(arg => String(arg)).join(" ")}`);
  console.warn = (...args) => logs.push(`Warning: ${args.map(arg => String(arg)).join(" ")}`);

  try {
    const func = new Function("stdin", code);
    func(stdin);
  } catch (error: unknown) {
    logs.push(`Error: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
  }

  return logs;
};