# Bug Audit — 2026-09-24

Full-codebase correctness review (not a diff review — the whole app was read
end to end: `src/pages/typing`, `src/pages/analysis`, `src/pages/error-book`,
`src/pages/gallery-n`, `src/pages/mobile`, `src/pages/friend-links`,
`src/store`, `src/utils` (incl. `src/utils/db`), `src/hooks`,
`src/components`). 144 files, ~17.8k lines.

Style/formatting issues are excluded — Biome/Ultracite already covers those.
Every item below was verified by reading the actual code path, not inferred.

Check items off as they're fixed. Findings are grouped by severity tier, and
within a tier, roughly in the order found.

---

## Tier 1 — Data loss / core feature broken

- [x] **Failed data import can permanently wipe all local progress**
  `src/utils/db/data-export.ts:71-80`
  `db.import()` runs with `clearTablesBeforeImport: true` and no try/catch.
  `dexie-export-import` clears every table *before* the transaction that
  repopulates them, so a throw partway through (corrupt file, quota
  exceeded) leaves all tables permanently empty with no error shown.
  **Fix:** wrap in try/catch; drop `clearTablesBeforeImport` in favor of
  `overwriteValues: true` (per-row replace), or snapshot-export before
  clearing so a failed import is recoverable.

- [x] **"Repeat/Next/Dictate chapter" buttons silently cancel auto-start typing**
  `src/pages/typing/index.tsx:83-106`
  The `SETUP_CHAPTER` effect depends on `state.isFinished` and only guards
  while it's `true`. The moment it flips `true → false` (exactly what
  Repeat/Next/Dictate do), the effect re-fires and clobbers the reducer's
  `isTyping = true` with a freshly reset state — every chapter transition
  drops back to the idle "press any key" screen instead of continuing.
  **Fix:** drop `state.isFinished` from this effect's dependency array.

- [x] **Dead-key/compose keystrokes corrupt the word being typed**
  `src/pages/typing/components/word-panel/components/key-event-handler/index.tsx`
  via `isLegal()` in `src/utils/index.ts:22-60`
  Doesn't exclude `"Dead"` (what browsers report for the first key of an
  accent-compose sequence on non-US layouts). It gets appended literally as
  the 4-char string `"Dead"` into the input, corrupting the current word.
  **Fix:** require `char.length === 1` (already done in `text-area-handler`)
  or explicitly exclude `"Dead"`/`"Unidentified"`/`"Process"`.

- [x] **Chapter-record saves are fire-and-forget — session results can vanish**
  `src/utils/db/index.ts:86`
  `db.chapterRecords.add(chapterRecord)` has no `await`/catch (contrast with
  the correctly-handled sibling `useSaveWordRecord`). A rejected write
  (IndexedDB quota, blocked upgrade) is silently swallowed; the result
  screen still renders normally but the session was never saved.
  **Fix:** `await` + try/catch, mirroring `useSaveWordRecord`.

- [x] **Review-record writes are also fire-and-forget**
  `src/utils/db/review-record.ts:83-85`
  `putWordReviewRecord` doesn't await/return `db.reviewRecords.put(...)`.
  Same failure mode as above, for review-mode progress.
  **Fix:** `return await db.reviewRecords.put(record)`; handle rejection at
  call sites.

- [x] **Config defaults never actually persist to storage** (this rewrite
  also fixes the Tier 3 "`atomForConfig` can throw on a `null` stored value"
  item below — same code path)
  `src/store/atom-for-config.ts:16-46`
  The atom's *read* function merges in missing default keys and writes to
  `localStorage` directly as a side effect, but never updates Jotai's own
  `baseAtom`. The next functional update (`setX(prev => ({...prev, y}))` —
  used throughout the app) spreads the still-stale `prev` and overwrites the
  fix. Affects every config atom built with this helper (loop-word,
  key-sounds, hint-sounds, pronunciation, font-size, random, phonetic,
  word-dictation configs).
  **Fix:** don't side-effect localStorage from a read function — merge
  defaults inside a custom `storage.getItem`, or `set(storageAtom, merged)`
  once via `onMount`.

## Tier 2 — Wrong behavior / wrong feedback

- [x] **Extra keystrokes right after finishing a word register as phantom mistakes**
  `src/pages/typing/components/word-panel/components/word/index.tsx:89-114`
  `updateInput`'s `"add"` branch checks `hasWrong` but not `isFinished`; fast
  typists can trigger a false wrong-word report between word-finish and the
  next-word swap.
  **Fix:** also bail when `wordState.isFinished`.

- [x] **Tag filter in the gallery resets itself while typing in the search box**
  `src/pages/gallery-n/category-dicts.tsx:39-50`
  Effect deps on `tagList` (a new array identity every keystroke)
  unconditionally overwrite a manually-selected tag.
  **Fix:** only react to `currentDictInfo.tags` changing, not `tagList`
  identity.

- [x] **Error Book pagination goes stale after deleting the last item on a page**
  `src/pages/error-book/index.tsx`
  `currentPage` isn't clamped after delete shrinks `totalPages`; shows "No
  missed words" with data still sitting on page 1.
  **Fix:** clamp `currentPage` to the new `totalPages` after refetch.

- [x] **Analysis charts never resize after first render**
  `src/pages/analysis/components/line-charts.tsx`,
  `src/pages/analysis/components/keyboard-with-bar-charts.tsx`
  The resize `useEffect` has `[]` deps so `chart.resize()` only fires once
  at mount; charts don't reflow on window resize.
  **Fix:** add `width`/`height` to that effect's dependency array.

- [x] **Dictionary lookup cache poisons itself on rate-limits/server errors**
  `src/hooks/use-word-enrichment.ts:128-131`
  Any non-OK response (429/500) is cached as `null` forever, same as a real
  "not found".
  **Fix:** only cache `null` on `status === 404`.

- [x] **Orphaned Howl instance leak in the pronunciation cache**
  `src/hooks/use-pronunciation.ts:81-92`
  The LRU cache deletes the currently-playing entry from its map without
  unloading it when it's the active sound, leaking it and forcing a
  redundant re-fetch next time.
  **Fix:** skip evicting the active entry instead of just skipping its
  `.stop()`.

- [x] **Garbled curly-quote characters around example sentences**
  `src/pages/typing/components/word-panel/components/translation/index.tsx:170`
  `“`/`”` written as bare JSX text render literally instead of as quote
  glyphs.
  **Fix:** wrap as `{"“"}...{"”"}`.

## Tier 3 — Low-severity / edge cases

- [x] **`NEXT_CHAPTER` reducer doesn't set `chapterData.words` itself**
  `src/pages/typing/store/index.ts:219-227`
  Relies on an external effect to patch it up — currently masked, becomes
  load-bearing once the Tier 1 auto-start bug is fixed.
  **Fix:** set `newState.chapterData.words` directly, mirroring
  `REPEAT_CHAPTER`.

- [x] **Skipping the last word of a chapter under-counts `wordCount`**
  `src/pages/typing/store/index.ts:187-197` (`SKIP_WORD` case)
  Throws off saved records and displayed WPM by one word.
  **Fix:** increment `chapterData.wordCount` in this branch too.

- [x] **Tab key is globally hijacked during practice**
  `src/pages/typing/components/word-panel/index.tsx:157-173`,
  `.../word-panel/components/word/index.tsx:120-136`
  Used to reveal the translation, but unscoped — breaks keyboard focus
  navigation out of the practice screen for the entire session.
  **Fix:** scope the hotkey to the typing surface (react-hotkeys-hook
  `scopes`, or condition on focus).

- [x] **WPM can render as `Infinity` in the trend chart**
  `src/pages/analysis/hooks/use-word-stats.ts:144-149`
  Happens if `totalTime` sums to 0 for a day that still has word data.
  **Fix:** filter with `Number.isFinite(d[1]) && d[1] !== 0`.

- [x] **`setHasError(true)` called inside a `useMemo`, never reset**
  `src/pages/error-book/hooks/use-get-word.ts:14-27`
  Render-time side effect inside a memo factory; `hasError` never clears
  back to `false` on success.
  **Fix:** move into a `useEffect`, reset to `false` on success.

- [x] **Dexie `.between()` excludes the upper bound by default**
  `src/pages/analysis/hooks/use-word-stats.ts:73-76`
  Drops any record timestamped exactly at query end.
  **Fix:** `.between(start, end, true, true)`.

- [x] **`ChapterRecord.inputAccuracy` has an operator-precedence bug**
  `src/utils/db/record.ts:116-120`
  Produces nonsense (e.g. "600%"). Currently dead code — unused anywhere in
  the app today — but a landmine for future consumers.
  **Fix:** `Math.round((correctCount / (correctCount + wrongCount)) * 100)`,
  guard the zero-division case.

- [x] **`atomForConfig` can throw on a `null` stored value** (fixed
  incidentally by the Tier 1 persistence rewrite above)
  `src/store/atom-for-config.ts:22-38`
  `for...in` on `null` throws `TypeError`, crashing every render that reads
  the affected config atom.
  **Fix:** treat `config === null` as a mismatch, fall back to
  `defaultValue`.

- [ ] **`wordRecords` index renamed (`errorCount` → `wrongCount`) without a Dexie migration**
  `src/utils/db/index.ts:31-43`
  No `.upgrade()` callback to rename the underlying stored field. Only
  affects pre-v2 local data, likely negligible impact at this point.
  **Fix:** add an `.upgrade()` migration if this is worth backfilling, or
  document it as a known gap.
  **Status:** left unfixed - only affects local data from before the
  app's second schema version, and an untested historical migration for
  that carries more risk than value. Revisit if it turns out to matter.

- [x] **Tooltip content isn't linked via `aria-describedby`**
  `src/components/tooltip/index.tsx:22-48`
  `role="tooltip"` is set on the content div but never associated with the
  trigger, so it's invisible to screen readers.
  **Fix:** generate a stable `id` on the content, set
  `aria-describedby={id}` on the trigger.

- [x] **Footer's blur handler is a no-op for 2 of 4 links**
  `src/components/footer/index.tsx:9-17`
  `currentTarget` in the footer-level handler is the `<footer>` itself, not
  the clicked link.
  **Fix:** attach the blur handler directly on each `<a>` instead of on the
  footer.

- [x] **`DropdownMenuShortcut`'s focus styling never applies**
  `src/components/ui/dropdown-menu.tsx:239-253`
  Uses a Tailwind named-group variant (`group-focus/dropdown-menu-item:...`)
  but the parent `DropdownMenuItem` never applies the matching
  `group/dropdown-menu-item` class.
  **Fix:** add `group/dropdown-menu-item` to `DropdownMenuItem`'s
  className.

- [x] **Pronunciation can resolve to `undefined` for short `trans` arrays**
  `src/components/word-pronunciation-icon/index.tsx:72-80`
  Hapin words with fewer than 3 translations silently fail to play audio.
  **Fix:** fall back to `word.name` when `word.trans[2]` is undefined, same
  as the non-hapin branch already does.

---

**Suggested fix order:** Tier 1 first (#1 threatens all local user data,
#4/#5 threaten it silently, #2/#3 break the core typing loop), then Tier 2,
then Tier 3 as time allows.

## Found via live browser testing (2026-09-24)

- [x] **"Next chapter" still fell back to the idle "press any key" screen**
  `src/pages/typing/store/index.ts` (`SETUP_CHAPTER` case)
  The original Tier 1 fix (#2 above) stopped `SETUP_CHAPTER` from re-firing
  spuriously when `isFinished` flipped, but missed a second, legitimate
  trigger: `words` genuinely changes identity when `currentChapter` advances
  (see `useWordList`'s `useMemo` deps), and `SETUP_CHAPTER` always rebuilt
  state from `structuredClone(initialState)` - whose `isTyping` is `false` -
  discarding the `isTyping: true` that `NEXT_CHAPTER`'s own reducer case had
  just set moments earlier in the same commit. Caught by actually driving
  the app through a full chapter → Next chapter transition in a browser, not
  by reading the code - the effect and reducer looked correct in isolation.
  **Fix:** `SETUP_CHAPTER` now sets `newState.isTyping = state.isTyping`
  instead of always defaulting to `false`, so it preserves whatever the
  reducer's incoming state already had (true right after a deliberate
  Next/Repeat/Dictate continuation, false on a genuine fresh/idle load).
  Verified end-to-end: typed through two full chapters via a scripted
  browser session, confirmed "Next chapter" and "Repeat this chapter" both
  now drop straight into active typing (timer running, first keystroke
  registers immediately) with zero console errors from the app itself.
