/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import { useState, useEffect, useCallback } from "react";
import CodeEditor from "@/components/CodeEditor";
import OutputWindow from "@/components/OutputWindow";
import LanguageSelector from "@/components/LanguageSelector";
import { executeRustbox, type ExecutionMetrics } from "@/lib/api";
import {
  CODE_SNIPPETS,
  CODE_TEMPLATES,
  DEFAULT_TEMPLATE,
  STUDY_CASE_TEMPLATES,
} from "@/lib/constants";

const experiments = [
  {
    name: "Predict & Verify",
    tagline: "CH 01",
    instruction:
      "Change a number or message in the editor. State your prediction out loud before hitting Run.",
  },
  {
    name: "Personalize Output",
    tagline: "CH 02",
    instruction:
      "Modify the code to print your name. Observe which part is data and which part is logic.",
  },
  {
    name: "Diagnose Faults",
    tagline: "CH 03",
    instruction:
      "Introduce an intentional typo or syntax error. Read the stderr output to locate the clue.",
  },
];

const signalSteps = ["Edit Code", "Run Program", "Inspect Output", "Ask AI"];

const getLanguageNames = (payload: unknown): string[] => {
  const record =
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : {};
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(record.languages)
      ? record.languages
      : [];

  return items
    .map((item) => {
      if (typeof item === "string") return item;
      if (typeof item !== "object" || item === null) return "";

      const language = item as Record<string, unknown>;
      const name = language.name || language.language || language.id;
      const version = language.version;

      if (typeof name !== "string") return "";
      return typeof version === "string" ? `${name} ${version}` : name;
    })
    .filter((name): name is string => Boolean(name));
};

export default function Home() {
  const [language, setLanguage] = useState<string>("javascript");
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [code, setCode] = useState<string>(CODE_SNIPPETS.javascript);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [executionMetrics, setExecutionMetrics] = useState<ExecutionMetrics | undefined>();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingLanguages, setIsCheckingLanguages] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>([]);
  const [languageError, setLanguageError] = useState("");
  const [showSupportedLanguages, setShowSupportedLanguages] = useState(false);
  const [activeExperiment, setActiveExperiment] = useState(0);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);

  const hasResponse = output.length > 0 || Boolean(htmlContent);

  const loadTemplate = useCallback(
    (selectedLanguage: string, selectedTemplate: string) => {
      const nextTemplate =
        CODE_TEMPLATES[selectedLanguage]?.[selectedTemplate] ||
        CODE_TEMPLATES[selectedLanguage]?.[DEFAULT_TEMPLATE];

      setTemplate(selectedTemplate);
      setCode(nextTemplate?.code || "");
      setStdin(nextTemplate?.stdin || "");
      setOutput([]);
      setExecutionMetrics(undefined);
      setHtmlContent(null);
    },
    [],
  );

  const handleLanguageChange = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    loadTemplate(selectedLanguage, DEFAULT_TEMPLATE);
  };

  const handleTemplateChange = (selectedTemplate: string) => {
    loadTemplate(language, selectedTemplate);
  };

  const resetCode = () => {
    loadTemplate(language, template);
  };

  const applyStudyCase = useCallback(
    (experimentIndex: number) => {
      setActiveExperiment(experimentIndex);
      const studyCase =
        STUDY_CASE_TEMPLATES[experimentIndex]?.[language] ||
        STUDY_CASE_TEMPLATES[experimentIndex]?.javascript;
      if (studyCase) {
        setCode(studyCase.code);
        setStdin(studyCase.stdin);
        setOutput([]);
        setExecutionMetrics(undefined);
        setHtmlContent(null);
      }
      scrollToSegment("code-segment");
    },
    [language],
  );

  const checkSupportedLanguages = async () => {
    if (supportedLanguages.length > 0) {
      setShowSupportedLanguages((visible) => !visible);
      return;
    }

    setIsCheckingLanguages(true);
    setLanguageError("");

    try {
      const response = await fetch("/api/languages", { cache: "no-store" });
      const result: unknown = await response.json();

      if (!response.ok) {
        const error =
          typeof result === "object" && result !== null && "error" in result
            ? String(result.error)
            : "Failed to check supported languages.";
        throw new Error(error);
      }

      setSupportedLanguages(getLanguageNames(result));
      setShowSupportedLanguages(true);
    } catch (error: unknown) {
      setLanguageError(
        error instanceof Error
          ? error.message
          : "Failed to check supported languages.",
      );
      setShowSupportedLanguages(true);
    } finally {
      setIsCheckingLanguages(false);
    }
  };

  const runCode = useCallback(async () => {
    if (isLoading) return;
    setOutput([]);
    setExecutionMetrics(undefined);
    setHtmlContent(null);
    setIsLoading(true);

    try {
      if (language === "html") {
        const serializedStdin = JSON.stringify(stdin).replace(/</g, "\\u003c");
        setHtmlContent(
          `<script>window.STDIN = ${serializedStdin};<\/script>${code}`,
        );
      } else {
        const result = await executeRustbox(language, code, stdin);
        setOutput(result.output);
        setExecutionMetrics(result.metrics);
      }
    } catch (err: unknown) {
      setOutput([
        `Error: ${err instanceof Error ? err.message : "Execution failed"}`,
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [code, stdin, language, isLoading]);

  // Keyboard shortcut listener: Cmd + Enter / Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        runCode();
      }
      if (event.key === "Escape" && isEditorMaximized) {
        setIsEditorMaximized(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [runCode, isEditorMaximized]);

  const [activeSegment, setActiveSegment] = useState<string>("hero-segment");

  // Track active scroll segment for right-hand navigation dots
  useEffect(() => {
    const segmentIds = ["hero-segment", "code-segment", "learn-segment"];
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.4,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSegment(entry.target.id);
        }
      });
    }, observerOptions);

    segmentIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSegment = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Floating Segment Quick Nav */}
      <div className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 rounded-full border border-zinc-800 bg-zinc-900/80 p-2 backdrop-blur-md lg:flex">
        {[
          { id: "hero-segment", label: "Hero Segment" },
          { id: "code-segment", label: "Code Studio Segment" },
          { id: "learn-segment", label: "Learn Segment" },
        ].map((segment) => {
          const isActive = activeSegment === segment.id;
          return (
            <button
              key={segment.id}
              type="button"
              onClick={() => scrollToSegment(segment.id)}
              title={segment.label}
              className={`h-3 w-3 rounded-full transition-all duration-300 focus:outline-none ${
                isActive
                  ? "bg-emerald-400 scale-125 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                  : "bg-zinc-600 hover:bg-zinc-400"
              }`}
            />
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* SEGMENT 1: HERO PAGE */}
      {/* ==================================================================== */}
      <section
        id="hero-segment"
        className="relative flex h-screen w-full shrink-0 snap-start flex-col justify-between p-6 lg:p-10 max-w-7xl mx-auto"
      >
        {/* Navigation Header */}
        <header className="flex flex-col gap-4 border-b border-zinc-800/80 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-zinc-950 shadow-md shadow-emerald-500/20 font-black text-sm tracking-wider">
              CR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-sans text-base font-bold tracking-tight text-zinc-100">
                  Obsidian Code Studio
                </h1>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-400">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Interactive Student Learning Workbench
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-medium">System Ready</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 font-mono text-zinc-400">
              <span>Shortcut:</span>
              <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-[0.7rem] font-semibold text-zinc-200">
                ⌘ + Enter
              </kbd>
            </div>
          </div>
        </header>

        {/* Main Hero Content */}
        <div className="my-auto grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <span className="inline-block font-mono text-xs font-semibold uppercase tracking-widest text-emerald-400">
              // Segment 01 • Hero & Signal Flow
            </span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl">
              Write code. See output. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                Master the logic.
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400">
              Modify starter programs, predict the output, and run your code
              instantly. Compare actual stdout/stderr to hone your mental model.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={() => scrollToSegment("code-segment")}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-sans text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-95"
              >
                <span>Open Code Studio</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/50 p-6 shadow-2xl backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Signal Flow Workflow
              </p>
              <div className="mt-4 grid gap-3">
                {signalSteps.map((step, idx) => (
                  <div
                    key={step}
                    className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-950/60 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 font-mono text-xs font-bold text-emerald-400">
                        0{idx + 1}
                      </span>
                      <span className="text-sm font-semibold text-zinc-200">
                        {step}
                      </span>
                    </div>
                    <span className="text-[0.65rem] font-mono text-zinc-500">
                      Step {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Segment Footer Hint */}
        <div className="flex justify-center pb-2">
          <button
            type="button"
            onClick={() => scrollToSegment("code-segment")}
            className="flex items-center gap-2 text-xs font-medium text-zinc-500 transition hover:text-zinc-300"
          >
            <span>Scroll to Code Segment</span>
            <svg
              className="h-4 w-4 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SEGMENT 2: CODE STUDIO PAGE */}
      {/* ==================================================================== */}
      <section
        id="code-segment"
        className="relative flex h-screen w-full shrink-0 snap-start flex-col justify-between p-6 lg:p-8 max-w-7xl mx-auto"
      >
        {/* Workspace Toolbar Shell */}
        <div className="shrink-0 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 shadow-2xl backdrop-blur-md">
          <div className="grid gap-4 md:grid-cols-12 md:items-end">
            {/* Language Selector */}
            <div className="md:col-span-3">
              <div className="mb-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={checkSupportedLanguages}
                  disabled={isCheckingLanguages}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline disabled:cursor-wait disabled:text-zinc-500"
                  aria-expanded={showSupportedLanguages}
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {isCheckingLanguages
                    ? "Checking Rustbox..."
                    : showSupportedLanguages
                      ? "Hide supported languages"
                      : "Check supported languages"}
                </button>
              </div>
              <LanguageSelector
                language={language}
                onSelect={handleLanguageChange}
              />
            </div>

            {/* Starter Template */}
            <div className="md:col-span-3">
              <label
                htmlFor="template-select"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5"
              >
                Starter Template
              </label>
              <div className="relative">
                <select
                  id="template-select"
                  value={template}
                  onChange={(event) => handleTemplateChange(event.target.value)}
                  className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-zinc-800 bg-zinc-900/90 pl-3.5 pr-9 text-sm font-semibold text-zinc-100 shadow-sm outline-none transition hover:border-zinc-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  {Object.entries(CODE_TEMPLATES[language] || {}).map(
                    ([id, item]) => (
                      <option
                        key={id}
                        value={id}
                        className="bg-zinc-900 text-zinc-100"
                      >
                        {item.name}
                      </option>
                    ),
                  )}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <svg
                    className="h-4 w-4 fill-current"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Active Goal Select Dropdown */}
            <div className="md:col-span-3">
              <label
                htmlFor="goal-select"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5"
              >
                Active Goal
              </label>
              <div className="relative">
                <select
                  id="goal-select"
                  value={activeExperiment}
                  onChange={(event) => {
                    const newIndex = Number(event.target.value);
                    applyStudyCase(newIndex);
                  }}
                  className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-zinc-800 bg-zinc-900/90 pl-3.5 pr-9 text-xs font-semibold text-zinc-100 shadow-sm outline-none transition hover:border-zinc-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  {experiments.map((exp, idx) => (
                    <option
                      key={exp.name}
                      value={idx}
                      className="bg-zinc-900 text-zinc-100"
                    >
                      {exp.tagline}: {exp.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <svg
                    className="h-4 w-4 fill-current"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 md:col-span-6 lg:col-span-3 md:justify-end">
              <button
                type="button"
                onClick={resetCode}
                className="h-11 rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 text-xs font-semibold text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={runCode}
                disabled={isLoading}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 font-sans text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 md:flex-initial"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin text-zinc-950"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{hasResponse ? "Run Again" : "Run Code"}</span>
                    <kbd className="hidden rounded bg-emerald-600/50 px-1.5 py-0.5 text-[0.65rem] text-emerald-950 sm:inline">
                      ⌘↵
                    </kbd>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Supported Languages Expandable Drawer */}
          {showSupportedLanguages && (
            <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Rustbox Backend Engine Languages
                </span>
                {!languageError && (
                  <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[0.65rem] font-medium text-zinc-400">
                    {supportedLanguages.length} runtimes registered
                  </span>
                )}
              </div>
              {languageError ? (
                <p className="mt-2 text-xs text-rose-400">{languageError}</p>
              ) : supportedLanguages.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {supportedLanguages.map((supportedLang) => (
                    <span
                      key={supportedLang}
                      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-xs font-medium text-zinc-200"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {supportedLang}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-xs text-zinc-500">
                  Querying backend for language runtimes...
                </p>
              )}
            </div>
          )}
        </div>

        {/* Active Study Case Challenge Banner */}
        {STUDY_CASE_TEMPLATES[activeExperiment]?.[language] && (
          <div className="mt-2 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-emerald-400">
                {experiments[activeExperiment].tagline}:
              </span>
              <span>
                {STUDY_CASE_TEMPLATES[activeExperiment][language].instruction}
              </span>
            </div>
            <span className="font-mono text-[0.65rem] text-emerald-400/70">
              Study Case Active
            </span>
          </div>
        )}

        {/* Code & Terminal Workbench Grid */}
        <div className={`my-auto grid gap-6 py-3 ${isEditorMaximized ? "grid-cols-1" : "lg:grid-cols-2 lg:items-stretch"}`}>
          <CodeEditor
            language={language}
            value={code}
            onChange={(newCode) => setCode(newCode || "")}
            stdin={stdin}
            onStdinChange={setStdin}
            onRunCode={runCode}
            isMaximized={isEditorMaximized}
            onToggleMaximize={() => setIsEditorMaximized((maximized) => !maximized)}
            height="calc(100vh - 310px)"
          />

          {!isEditorMaximized && (
            <OutputWindow
              output={output}
              executionMetrics={executionMetrics}
              htmlContent={htmlContent}
              isLoading={isLoading}
              height="calc(100vh - 310px)"
            />
          )}
        </div>

        {/* Segment Footer Hint */}
        <div className="flex justify-between items-center shrink-0 pt-2 border-t border-zinc-800/50">
          <span className="text-xs font-mono text-zinc-500">
            // Segment 02 • Code & Terminal Studio
          </span>
          <button
            type="button"
            onClick={() => scrollToSegment("learn-segment")}
            className="flex items-center gap-2 text-xs font-medium text-zinc-500 transition hover:text-zinc-300"
          >
            <span>Scroll to Learn Segment</span>
            <svg
              className="h-4 w-4 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SEGMENT 3: LEARN PAGE */}
      {/* ==================================================================== */}
      <section
        id="learn-segment"
        className="relative flex h-screen w-full shrink-0 snap-start flex-col justify-between p-6 lg:p-10 max-w-7xl mx-auto"
      >
        <div className="my-auto">
          <div className="flex flex-col gap-2 border-b border-zinc-800/80 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-emerald-400">
                // Segment 03 • Active Learning Method
              </span>
              <h3 className="mt-2 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                Three ways to learn from every execution
              </h3>
            </div>
            <p className="max-w-md text-xs text-zinc-400">
              Pick an experiment strategy below to guide your next code
              modification.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {experiments.map((exp, idx) => {
              const isActive = activeExperiment === idx;

              return (
                <div
                  key={exp.name}
                  onClick={() => applyStudyCase(idx)}
                  className={`group relative cursor-pointer rounded-2xl border p-6 transition-all duration-200 ${
                    isActive
                      ? "border-emerald-500/60 bg-gradient-to-b from-zinc-900/90 to-zinc-900/40 shadow-xl shadow-emerald-500/5 scale-[1.02]"
                      : "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/70 hover:scale-[1.01]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-xs font-bold ${
                        isActive
                          ? "text-emerald-400"
                          : "text-zinc-500 group-hover:text-zinc-400"
                      }`}
                    >
                      {exp.tagline}
                    </span>
                    {isActive && (
                      <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                    )}
                  </div>
                  <h4 className="mt-4 text-xl font-bold text-zinc-100">
                    {exp.name}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {exp.instruction}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <span>Apply Strategy</span>
                    <svg
                      className="h-4 w-4 transition group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col gap-3 border-t border-zinc-800/80 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-400">
              Obsidian Code Studio
            </span>
            <span>•</span>
            <span>Next.js 16 + Monaco + Rustbox</span>
          </div>
          <div className="flex items-center gap-4">
            <span>
              Press{" "}
              <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-zinc-300">
                ⌘ + Enter
              </kbd>{" "}
              to run
            </span>
          </div>
        </footer>
      </section>
    </main>
  );
}
