"use client";

import React, { useState } from "react";
import type { ExecutionMetrics } from "@/lib/api";

interface OutputWindowProps {
  output: string[];
  executionMetrics?: ExecutionMetrics;
  htmlContent?: string | null;
  isLoading?: boolean;
  height?: string;
}

const formatSeconds = (value: string) => {
  const seconds = Number(value);
  return Number.isFinite(seconds) ? `${(seconds * 1000).toFixed(1)} ms` : value;
};

const formatBytes = (value: string) => {
  const bytes = Number(value);
  return Number.isFinite(bytes) ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : value;
};

const OutputWindow: React.FC<OutputWindowProps> = ({ output, executionMetrics, htmlContent, isLoading, height = "520px" }) => {
  const [copied, setCopied] = useState(false);
  const hasOutput = output.length > 0;
  const hasFault = output.some((line) => line.toLowerCase().includes("error") || line.toLowerCase().includes("exception"));
  const cpuWall = executionMetrics?.cpuWall ?? (
    executionMetrics?.cpuTime && executionMetrics.wallTime
      ? String(Number(executionMetrics.cpuTime) / Number(executionMetrics.wallTime))
      : undefined
  );
  const metrics = [
    { label: "CPU time", value: executionMetrics?.cpuTime ? formatSeconds(executionMetrics.cpuTime) : "—" },
    { label: "Wall time", value: executionMetrics?.wallTime ? formatSeconds(executionMetrics.wallTime) : "—" },
    { label: "CPU/wall", value: cpuWall ? (Number.isFinite(Number(cpuWall)) ? Number(cpuWall).toFixed(3) : cpuWall) : "—" },
    { label: "Peak memory", value: executionMetrics?.memoryPeak ? formatBytes(executionMetrics.memoryPeak) : "—" },
    { label: "Memory limit", value: executionMetrics?.memoryLimit ? formatBytes(executionMetrics.memoryLimit) : "—" },
  ];

  const copyOutput = async () => {
    if (!hasOutput) return;
    await navigator.clipboard.writeText(output.join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/90 shadow-xl" style={{ height }}>
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-zinc-800/80 bg-zinc-900/60 px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {isLoading ? (
                <>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                </>
              ) : hasFault ? (
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
              ) : hasOutput || htmlContent ? (
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              ) : (
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-zinc-600" />
              )}
            </span>
            <span className="font-mono text-xs font-semibold text-zinc-300">
              {htmlContent ? "Preview Output" : "Terminal Console"}
            </span>
          </div>
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[0.65rem] font-medium text-zinc-400">
            {isLoading ? "Running..." : hasFault ? "Execution Error" : hasOutput || htmlContent ? "Completed" : "Standby"}
          </span>
        </div>

        {hasOutput && !htmlContent && (
          <button
            type="button"
            onClick={copyOutput}
            className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            {copied ? (
              <>
                <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 00-2-2h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy for AI</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="relative flex-1 overflow-hidden bg-zinc-950">
        {htmlContent ? (
          <iframe
            srcDoc={htmlContent}
            title="Interactive Preview"
            className="h-full min-h-[380px] w-full border-none bg-white"
            sandbox="allow-scripts"
          />
        ) : (
          <div className="h-full overflow-auto p-4 font-mono text-sm leading-6 text-zinc-100">
            {isLoading ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 text-center">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" style={{ animationDelay: "300ms" }} />
                </div>
                <p className="font-sans text-sm font-semibold text-zinc-300">Compiling & Executing Code</p>
                <p className="font-sans text-xs text-zinc-500">Connecting to runtime engine...</p>
              </div>
            ) : hasOutput ? (
              <div className="space-y-1 font-mono">
                {output.map((line, index) => {
                  const isError = line.toLowerCase().includes("error") || line.toLowerCase().includes("exception");

                  return (
                    <div key={index} className="flex items-start gap-2.5 py-0.5">
                      <span className="w-5 shrink-0 select-none pt-0.5 text-right font-sans text-[0.68rem] font-medium text-zinc-600">
                        {index + 1}
                      </span>
                      <pre className={`flex-1 whitespace-pre-wrap break-words font-mono ${isError ? "font-semibold text-rose-400" : "text-emerald-300"}`}>
                        {line}
                      </pre>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-500">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="mt-4 font-sans text-base font-semibold text-zinc-200">Terminal Ready</h3>
                <p className="mt-1.5 max-w-xs font-sans text-xs text-zinc-400">
                  Select a starter, make changes in the editor, and click <strong className="text-emerald-400">Run Code</strong> (or press <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[0.65rem] text-zinc-300">⌘ + Enter</kbd>).
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <section aria-label="Execution metrics" className="shrink-0 border-t border-zinc-800/80 bg-zinc-900/40 px-4 py-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-px w-4 bg-emerald-500/70" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Execution metrics</h3>
          </div>
          <dl className="grid grid-cols-2 divide-x divide-y divide-zinc-800/80 overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-950/80 sm:grid-cols-5 sm:divide-y-0">
            {metrics.map((metric) => (
              <div key={metric.label} className="min-w-0 px-3 py-2">
                <dt className="text-[0.62rem] font-medium uppercase tracking-wide text-zinc-500">{metric.label}</dt>
                <dd className={`mt-0.5 truncate font-mono text-xs font-semibold ${metric.value === "—" ? "text-zinc-600" : "text-emerald-300"}`}>
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
    </div>
  );
};

export default OutputWindow;
