# Type to Learn

English vocabulary + typing trainer. Ships both as a web app (Vite, deployed to
GitHub Pages) and a desktop app (Tauri/Rust shell around the same web build).

## Stack

React 19 + TypeScript, Vite, Tailwind CSS v4, Jotai (state), Dexie (IndexedDB
persistence), Base UI + shadcn-style primitives in `src/components/ui`.
Formatting/linting is Biome via Ultracite (see below) — don't hand-fix style
issues it already covers.

React Compiler (`babel-plugin-react-compiler`, stable) is wired into
`vite.config.ts` via `@rolldown/plugin-babel`'s `reactCompilerPreset()` — the
official Babel-based integration, not the experimental `oxc-transform-react`
native path `@vitejs/plugin-react` also exposes. Don't add manual
`useMemo`/`useCallback` to compensate for re-renders; let the compiler handle
it, and only reach for them if profiling shows the compiler skipped that
specific component (see below). Known gaps as of `babel-plugin-react-compiler`
1.0.0, verified by direct compilation with its diagnostic `logger` (not
`eslint-plugin-react-compiler` — this project's TypeScript 7 beta isn't
supported by `@typescript-eslint/parser` yet):

- **Default values in destructured function params** (e.g.
  `({ variant = "default", ...props }) => ...`) hit an unimplemented
  compiler path (`BuildHIR::lowerAssignment`, category `Todo`) and silently
  skip that component. This hits ~24 files, mostly `src/components/ui/*`
  (the shadcn/Base UI primitives, which all use this idiom for prop
  defaults). Not a bug in this codebase — an upstream gap — and not
  currently worth a mass refactor to work around.
- `try/finally` and dynamic `import()` inside a component also aren't
  supported yet (`dropdown-export.tsx`, `result-screen/index.tsx`,
  `share-pic-dialog.tsx`).
- `src/pages/gallery-n/error-table/index.tsx` is skipped as "incompatible
  library" (`@tanstack/react-table` internals) — respect that, don't force it.
- Three hooks (`use-intersection-observer.ts`,
  `use-chapter-stats.ts`/`useChapterStats`, `use-dict-stats.ts`) carry a
  `// eslint-disable-next-line react-hooks/exhaustive-deps` on a legitimate
  "fetch once, guard on own state" effect pattern; the compiler skips these
  too. Leave them - they're correct as written, just unoptimized.

A skip is always safe (the compiler only adds memoization, never changes
behavior) - it just means that component gets zero benefit, not that
anything is wrong.

## Commands (pnpm)

- `pnpm dev` — start Vite dev server. Served under `/type-to-learn/` (the
  GitHub Pages base path is baked into `vite.config.ts`), so local URLs are
  `http://localhost:5173/type-to-learn/...`, not bare `/`.
- `pnpm build` — production build (`vite build --base=/type-to-learn/`).
- `pnpm check` / `pnpm fix` — Ultracite (Biome) lint check / autofix.
- `pnpm knip` — find unused files/exports/deps.
- `pnpm test` — currently a no-op; there is no test suite yet.
- Desktop shell lives in `src-tauri/` (Rust); most work happens in `src/`.

Editor/agent hooks (`.claude/settings.json`, `.cursor/hooks.json`) already run
`pnpm run fix` after every file edit, so formatting is handled automatically —
no need to run it manually mid-task.

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
- `.claude/CLAUDE.md` carries the same code-standards detail below for
  Claude Code specifically; keep the two in sync if you change either.
- See `CONTRIBUTING.md` for PR workflow, branch naming, and dictionary
  contribution guidelines — this file is about working in the codebase, not
  submitting changes.

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
