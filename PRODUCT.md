# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary users are students who are new to programming, AI-assisted learning, or software engineering practice. They use the product while learning by experimentation: selecting a language, editing a small example, running it, and reading output or errors.

## Product Purpose

The product is a browser-based code learning lab that helps students learn code by watching ideas turn into output. Success means a newcomer can run a small program, understand the result, make a tiny change, and use the exact output or error as useful feedback for their next attempt or AI prompt.

## Positioning

The product should optimize for an AI learning lab rather than a generic professional IDE. Its distinct job is to make code execution, error reading, and AI-assisted debugging approachable for beginners through fast feedback and low-friction experiments.

## Operating Context

Students work in a web browser. The primary workflow is choose a language, edit starter code, run it, inspect the output panel, and repeat. The product supports local JavaScript execution, secure HTML preview, and remote execution for supported backend languages through Rustbox.

## Capabilities and Constraints

- Built with Next.js App Router, React, Tailwind CSS, Monaco Editor, and Rustbox.
- JavaScript runs locally in the browser with captured console output.
- HTML renders in a sandboxed iframe preview.
- Python, Java, C#, and C++ run through Rustbox via a server-side API route.
- Rustbox API keys must stay server-side in environment variables.
- Language support should be checked against Rustbox before remote submission.
- Output should be cleaned into beginner-readable stdout and stderr instead of raw API payloads.
- The experience should stay beginner-focused and avoid unnecessary professional IDE complexity.

## Brand Commitments

The product voice should be clear, encouraging, and practical. It should respect students' intelligence while reducing intimidation around code, errors, and AI-assisted debugging.

## Evidence on Hand

- `README.md` describes a Next.js and Monaco multi-language code execution platform.
- `app/page.tsx` implements the primary learning lab workflow and first-run guidance.
- `components/CodeEditor.tsx` provides the Monaco editing surface.
- `components/OutputWindow.tsx` provides output and HTML preview states.
- `app/api/execute/route.ts` proxies Rustbox execution and result fetching server-side.
- No testimonials, benchmarks, classroom evidence, or production usage claims are present in the repository.

## Product Principles

- Get students to first output quickly.
- Treat errors as useful feedback, not failure.
- Prefer small experiments over long explanations.
- Keep execution safe and credentials hidden.
- Use AI as a learning companion after the product gives clear runtime feedback.

## Accessibility & Inclusion

The product should remain usable for beginners with different confidence levels and technical backgrounds. Future work should preserve clear labels, visible focus states, readable contrast, and non-patronizing language.
