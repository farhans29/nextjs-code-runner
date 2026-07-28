"use client";

import CustomSelect from "@/components/CustomSelect";
import { LANGUAGE_VERSIONS } from "@/lib/constants";

interface LanguageSelectorProps { language: string; onSelect: (language: string) => void; }
const labels: Record<string, string> = { c: "C", cpp: "C++", csharp: "C#", go: "Go", rust: "Rust", javascript: "JavaScript", typescript: "TypeScript", html: "HTML", python: "Python", java: "Java" };

export default function LanguageSelector({ language, onSelect }: LanguageSelectorProps) {
  const options = Object.entries(LANGUAGE_VERSIONS).map(([value, target]) => ({ value, label: labels[value] ?? value, detail: target === "rustbox" ? "Cloud runner" : "Live preview" }));
  return <CustomSelect id="language-select" value={language} options={options} onChange={onSelect} />;
}