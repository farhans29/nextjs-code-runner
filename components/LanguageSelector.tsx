"use client";

import React from "react";
import { LANGUAGE_VERSIONS } from "@/lib/constants";

interface LanguageSelectorProps {
  language: string;
  onSelect: (language: string) => void;
}

const languages = Object.entries(LANGUAGE_VERSIONS);

const labelLanguage = (lang: string) => {
  if (lang === "c") return "C";
  if (lang === "cpp") return "C++";
  if (lang === "csharp") return "C#";
  if (lang === "go") return "Go";
  if (lang === "rust") return "Rust";
  if (lang === "javascript") return "JavaScript";
  if (lang === "typescript") return "TypeScript";
  if (lang === "html") return "HTML";
  return lang.charAt(0).toUpperCase() + lang.slice(1);
};

const getTargetBadge = (target: string) => {
  if (target === "local") return { label: "Browser Runtime", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
  if (target === "preview") return { label: "HTML Preview", bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" };
  return { label: "Rustbox API", bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" };
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onSelect }) => {
  const currentTarget = LANGUAGE_VERSIONS[language] || "rustbox";
  const badge = getTargetBadge(currentTarget);

  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center justify-between">
        <label htmlFor="language-select" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Language
        </label>
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-medium ${badge.bg}`}>
          {badge.label}
        </span>
      </div>

      <div className="relative">
        <select
          id="language-select"
          value={language}
          onChange={(event) => onSelect(event.target.value)}
          className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-zinc-800 bg-zinc-900/90 pl-3.5 pr-9 text-sm font-semibold text-zinc-100 shadow-sm outline-none transition hover:border-zinc-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        >
          {languages.map(([lang, version]) => (
            <option key={lang} value={lang} className="bg-zinc-900 text-zinc-100">
              {labelLanguage(lang)} ({version})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
