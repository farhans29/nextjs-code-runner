---
name: CodeLab Learning Desk
description: A tactile, violet-led learning lab with an approachable light desk and focused dark console.
colors:
  canvas-light: "#f5f5ff"
  canvas-dark: "#0c0a1b"
  violet-action: "#6d4aff"
  violet-dark: "#a789ff"
  ink-light: "#1a1834"
  ink-dark: "#f7f5ff"
  code-well: "#17152b"
typography:
  display:
    fontFamily: "Google Sans, Arial, Helvetica, sans-serif"
    fontSize: "clamp(3.3rem, 7.2vw, 6.15rem)"
    fontWeight: 800
    lineHeight: 0.89
    letterSpacing: "-0.065em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
rounded:
  control: "0.6875rem"
  panel: "1.0625rem"
---

# Design System: CodeLab Learning Desk

## North star

A beginner's learning desk, not a professional IDE. Violet light fields make the lab feel inviting while the editor and output stay quiet, legible, and task-first.

## Theme model

- **Light desk:** pale lilac canvas, deep ink, white work surfaces. Used for approachable first experiments.
- **Dark focus:** black-violet canvas, bright text, and the same violet action hierarchy. Used for longer coding sessions.
- Both themes preserve the information architecture, action position, execution colors, and dark code wells so state never relies on a theme alone.

## Components

- Editorial hero with an offset four-step learning loop.
- Compact control deck: language, starter, practice, reset, run.
- Paired editor and result panels use practical window headers and visible execution state.
- Practices are selectable learning prompts, not dashboard metrics.