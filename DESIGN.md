---
name: Obsidian Code Studio
description: An ultra-sleek, modern dark-mode playground for interactive code execution, learning, and feedback.
colors:
  obsidian-bg: "#09090b"
  panel-bg: "#121215"
  card-bg: "#18181b"
  border-subtle: "#27272a"
  border-accent: "#3f3f46"
  text-primary: "#f4f4f5"
  text-secondary: "#a1a1aa"
  text-muted: "#71717a"
  accent-emerald: "#10b981"
  accent-amber: "#f59e0b"
  accent-indigo: "#6366f1"
  accent-rose: "#f43f5e"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "JetBrains Mono, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  control: "0.5rem"
  card: "0.75rem"
  panel: "1rem"
---

# Design System: Obsidian Code Studio

## Overview

**Creative North Star: "Obsidian Code Studio"**

A sleek, high-contrast, modern dark-mode playground designed specifically for software students and developers. It provides instant visual clarity for code editing, execution signals, stdout/stderr reading, and sandboxed iframe previews.

The system replaces legacy retro test-bench styling with precision UI design: crisp zinc neutrals, subtle glass paneling, glowing accent LEDs, smooth micro-interactions, and clear keyboard affordances (`⌘↵`).

## Colors

- **Surface Base:** Obsidian Black (`#09090b` / `bg-zinc-950`)
- **Panel Surface:** Dark Zinc (`#121215` / `bg-zinc-900/80`)
- **Card & Well Surface:** Recessed Dark (`#18181b` / `bg-zinc-900`)
- **Borders:** Zinc Edge (`#27272a` / `border-zinc-800`), Focus Accent (`#3f3f46` / `border-zinc-700`)
- **Text:** Primary (`#f4f4f5`), Muted (`#a1a1aa`), Subtle (`#71717a`)
- **Accents:**
  - **Emerald (`#10b981`):** Primary action (Run Switch), successful state, console stdout.
  - **Amber (`#f59e0b`):** Warning, pending state, live signal movement.
  - **Indigo (`#6366f1`):** Brand accents, language badges, system tags.
  - **Rose (`#f43f5e`):** Error/fault notifications and stderr outputs.

## Typography

- **Headings & Controls:** Modern sans-serif (`Inter`, `system-ui`).
- **Code & Console Outputs:** Monospace (`JetBrains Mono`, `SFMono-Regular`, `Menlo`, `Monaco`).

## Layout & Components

- **Masthead Header:** Modern top navigation featuring logo badge, active status pill, and keyboard shortcut pill (`⌘ + Enter`).
- **Workspace Toolbar:** High-efficiency bar containing language selector, code template switcher, reset button, and primary **Run Code** switch.
- **Editor & Output Grid:** Side-by-side balanced 50/50 responsive split (or vertical stack on mobile) featuring Monaco editor and interactive output window.
- **Learning Experiments:** 3 interactive challenge tabs allowing students to switch contexts instantly.
