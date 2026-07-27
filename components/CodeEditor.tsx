"use client";

import React from "react";
import Editor, { OnMount } from "@monaco-editor/react";

interface CodeEditorProps {
  language?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  stdin?: string;
  onStdinChange?: (value: string) => void;
  onRunCode?: () => void;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  height?: string;
}

const getFileName = (lang: string) => {
  switch (lang) {
    case "c":
      return "main.c";
    case "cpp":
      return "main.cpp";
    case "go":
      return "main.go";
    case "rust":
      return "main.rs";
    case "typescript":
      return "main.ts";
    case "javascript":
      return "main.js";
    case "python":
      return "main.py";
    case "java":
      return "Main.java";
    case "csharp":
      return "Program.cs";
    case "html":
      return "index.html";
    default:
      return `main.${lang}`;
  }
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  language = "javascript",
  defaultValue = "// Write your code here",
  value,
  onChange,
  stdin = "",
  onStdinChange,
  onRunCode,
  isMaximized = false,
  onToggleMaximize,
  height = "520px",
}) => {
  const handleEditorMount: OnMount = (editor, monaco) => {
    if (onRunCode) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        onRunCode();
      });
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/90 shadow-xl" style={{ height }}>
      {/* Editor Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-900/60 px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 font-mono text-xs font-semibold text-zinc-300">
            {getFileName(language)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
          <kbd className="hidden rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[0.65rem] text-zinc-300 sm:inline">Ctrl/⌘ + Enter</kbd>
          <span className="hidden sm:inline">to submit</span>
          {onToggleMaximize && (
            <button
              type="button"
              onClick={onToggleMaximize}
              aria-pressed={isMaximized}
              aria-label={isMaximized ? "Restore workspace" : "Maximize editor"}
              title={isMaximized ? "Restore workspace" : "Maximize editor"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              {isMaximized ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 3H3v5m13-5h5v5M8 21H3v-5m18 0v5h-5M3 8l6-6m12 6l-6-6M3 16l6 6m12-6l-6 6" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 3H3v5m0-5l6 6m12-6h-5v5m5-5l-6 6M3 16v5h5m-5-5l6-6m12 6v5h-5m5-5l-6-6" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="relative min-h-0 flex-1 bg-[#1e1e1e]">
        <Editor
          height="100%"
          language={language}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 22,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            renderLineHighlight: "all",
            fontFamily: "JetBrains Mono, Menlo, Monaco, Consolas, monospace",
            fontLigatures: true,
            smoothScrolling: true,
            cursorBlinking: "smooth",
          }}
        />
      </div>

      {/* Always Visible Stdin Box */}
      <div className="shrink-0 border-t border-zinc-800 bg-zinc-900/80 p-3">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-mono text-xs font-semibold text-zinc-300">Standard Input (stdin):</span>
          <span className="text-[0.65rem] text-zinc-400">Provide input for scanner/sys.stdin</span>
        </div>
        <textarea
          value={stdin}
          onChange={(event) => onStdinChange?.(event.target.value)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
              event.preventDefault();
              onRunCode?.();
            }
          }}
          rows={2}
          spellCheck={false}
          placeholder="Enter standard input data here..."
          className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-200 placeholder-zinc-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
        />
      </div>
    </div>
  );
};

export default CodeEditor;
