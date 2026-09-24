# Type to Learn

English vocabulary + typing trainer. Ships both as a web app (Vite, deployed to
GitHub Pages) and a desktop app (Tauri/Rust shell around the same web build).

## Stack

React 19 + TypeScript, Vite, Tailwind CSS v4, Jotai (state), Dexie (IndexedDB
persistence), Base UI + shadcn-style primitives in `src/components/ui`.
Formatting/linting is Biome via Ultracite (see below) — don't hand-fix style
issues it already covers.

## Commands (pnpm)

- `pnpm dev` — start Vite dev server. Served under `/type-to-learn/` (the
  GitHub Pages base path is baked into `vite.config.ts`), so local URLs are
  `http://localhost:5173/type-to-learn/...`, not bare `/`.
- `pnpm build` — production build (`vite build --base=/type-to-learn/`).
- `pnpm check` / `pnpm fix` — Ultracite (Biome) lint check / autofix.
- `pnpm knip` — find unused files/exports/deps.
- `pnpm test` — currently a no-op; there is no test suite yet.
- Desktop shell lives in `src-tauri/` (Rust); most work happens in `src/`.

A Claude Code hook already runs `pnpm run fix` after every Write/Edit, so
formatting is handled automatically — no need to run it manually mid-task.

## Layout

- `src/pages/` — route-level features: `typing` (core practice flow),
  `analysis`, `gallery-n`, `error-book`, `mobile`, `friend-links`. Each owns
  its `components/`, `hooks/`, `store/` as needed.
- `src/store/` — global Jotai atoms (config, review info).
- `src/utils/db/` — Dexie (IndexedDB) wrappers for local persistence/export.
- `src/components/ui/` — shared low-level UI primitives.
- `src/hooks/`, `src/resources/`, `src/typings/` — shared hooks, static
  resources (sounds etc.), shared types.

## Notes

- No `.env`/backend — this is a client-only app; persistence is IndexedDB via
  Dexie, no server API beyond the public dictionary lookup in
  `src/hooks/use-word-enrichment.ts` and word-list fetches in
  `src/utils/word-list-fetcher.ts`.
- `AGENTS.md` (repo root) carries the same Ultracite/Biome code-standards
  detail below for non-Claude tools; keep the two in sync if you change
  either.

---

## Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict
code quality standards through automated formatting and linting. Biome (the
underlying engine) auto-fixes most issues — focus your attention on what it
*can't* check:

1. **Business logic correctness** — Biome can't validate algorithms.
2. **Meaningful naming** — descriptive names for functions, variables, types.
3. **Architecture decisions** — component structure, data flow, API design.
4. **Edge cases** — boundary conditions and error states.
5. **UX** — accessibility, performance, usability.
6. **Documentation** — comment complex logic; prefer self-documenting code.

A few conventions Biome doesn't fully enforce but this codebase follows:

- `for...of` over `.forEach()`/indexed loops; hooks called unconditionally at
  top level; early returns over nested conditionals; `Error` objects (not
  strings) when throwing.
- Accessibility: real `<button>`/`<nav>` etc. over div+role, alt text, labeled
  inputs, keyboard handlers alongside mouse handlers.
- `rel="noopener"` on `target="_blank"` links; no `eval`/`document.cookie`
  writes; sanitize user input.

Run `pnpm check` to see what's flagged, `pnpm fix` to autofix.
