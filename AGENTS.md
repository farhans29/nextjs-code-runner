# AGENTS.md

## Project

CodeLab is a Next.js App Router learning lab. Users select a language and starter or practice case, edit code in Monaco, run it, and inspect output.

- UI entry point: `app/page.tsx`
- Shared components: `components/`
- Execution API routes: `app/api/`
- Language templates and snippets: `lib/constants.ts`
- Rustbox client logic: `lib/api.ts`
- Global theme and UI styles: `app/globals.css`

## Tooling

Use `rtk` by default for every shell command to reduce command output and token usage. Use the matching wrapper when available, such as `rtk npm run lint`, `rtk npx tsc --noEmit`, `rtk git status`, `rtk next build`, `rtk ls`, `rtk read <file>`, and `rtk rg <pattern>`. Use `rtk run -- <command>` only when no specialized wrapper applies. Confirm unfamiliar syntax with `rtk --help` or `rtk <command> --help` before first use. Only run a command directly when `rtk` cannot support it or is unavailable, and state why.

Prefer targeted project tools over broad output:

- Search code before changing behavior.
- Read the relevant component, route, and surrounding conventions before edits.
- Do not add comments unless requested.
- Do not expose, log, or commit secrets.

## Development and verification

- Local development: `npm run dev`
- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`
- Next.js build: `npm run build`
- Cloudflare Worker bundle: `npm run cf:build`
- Workers preview: `npm run preview`
- Workers deployment: `npm run deploy`

After code changes, run lint and TypeScript checks. For Cloudflare or server changes, also run `npm run cf:build`.

## Cloudflare Workers

The app deploys as a Cloudflare Worker through `@opennextjs/cloudflare`.

- Worker configuration is `wrangler.json`.
- OpenNext configuration is `open-next.config.ts`.
- Generated Worker output is `.open-next/`; never edit or commit it.
- Do not add `export const runtime = "edge"`; OpenNext Cloudflare does not support the Next.js Edge runtime setting.
- `RUSTBOX_SUBMISSION_KEY` is a Worker secret. Keep it server-side in API routes and configure it in Cloudflare, never in client code or tracked files.

## UI and accessibility

Preserve the CodeLab light/dark theme tokens in `app/globals.css`. Interactive controls must retain visible focus, keyboard behavior, disabled/loading states, and sufficient contrast. Custom dropdown menus must layer above the workspace and not be clipped.

## Git

Do not commit or deploy unless explicitly requested. Do not use destructive Git commands. Keep user changes intact.
