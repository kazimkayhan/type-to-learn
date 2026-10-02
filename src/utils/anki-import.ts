import type { Word } from "@/typings";

const FIELD_SEPARATOR = "\u001f";
const HTML_TAG_REGEX = /<[^>]+>/g;
const CLOZE_REGEX = /\{\{c\d+::(.*?)(?:::(.*?))?\}\}/g;
const BR_REGEX = /<br\s*\/?>/gi;
const NBSP_REGEX = /&nbsp;/gi;
const AMP_REGEX = /&amp;/gi;
const LT_REGEX = /&lt;/gi;
const GT_REGEX = /&gt;/gi;
const QUOT_REGEX = /&quot;/gi;
const APOS_REGEX = /&#39;|&apos;/gi;
const WHITESPACE_REGEX = /\s+/g;
const APKG_EXT_REGEX = /\.apkg$/i;

const COLLECTION_CANDIDATES = [
  "collection.anki21",
  "collection.anki2",
  "collection.anki21b",
] as const;

export interface AnkiImportResult {
  deckName: string;
  words: Word[];
}

export function stripApkgExtension(filename: string): string {
  return filename.replace(APKG_EXT_REGEX, "").trim();
}

/** Strip Anki HTML / cloze markup down to plain text for typing practice. */
export function stripAnkiMarkup(raw: string): string {
  return raw
    .replace(CLOZE_REGEX, "$1")
    .replace(BR_REGEX, " ")
    .replace(HTML_TAG_REGEX, "")
    .replace(NBSP_REGEX, " ")
    .replace(AMP_REGEX, "&")
    .replace(LT_REGEX, "<")
    .replace(GT_REGEX, ">")
    .replace(QUOT_REGEX, '"')
    .replace(APOS_REGEX, "'")
    .replace(WHITESPACE_REGEX, " ")
    .trim();
}

function fieldsFromNote(flds: string): string[] {
  return flds.split(FIELD_SEPARATOR).map(stripAnkiMarkup).filter(Boolean);
}

function wordFromFields(fields: string[]): Word | null {
  const [name, ...trans] = fields;
  if (!name) {
    return null;
  }
  return { name, trans };
}

function pickDeckName(decksJson: string | undefined, fallback: string): string {
  if (!decksJson) {
    return fallback;
  }
  try {
    const decks = JSON.parse(decksJson) as Record<string, { name?: string }>;
    const names = Object.values(decks)
      .map((deck) => deck.name?.trim())
      .filter((name): name is string => Boolean(name) && name !== "Default");
    if (names.length === 0) {
      return fallback;
    }
    names.sort((a, b) => b.split("::").length - a.split("::").length);
    const [best] = names;
    const leaf = best.includes("::")
      ? best.slice(best.lastIndexOf("::") + 2)
      : best;
    return leaf || fallback;
  } catch {
    return fallback;
  }
}

async function loadSqlEngine() {
  const [{ default: initSqlJs }, wasmUrlModule] = await Promise.all([
    import("sql.js"),
    import("sql.js/dist/sql-wasm.wasm?url"),
  ]);
  const wasmUrl =
    typeof wasmUrlModule === "string"
      ? wasmUrlModule
      : (wasmUrlModule as { default: string }).default;
  return initSqlJs({
    locateFile: () => wasmUrl,
  });
}

async function readFirstCollection(
  zip: Awaited<ReturnType<typeof import("jszip")["default"]["loadAsync"]>>
): Promise<Uint8Array | null> {
  const entries = COLLECTION_CANDIDATES.map((candidate) => zip.file(candidate));
  const found = entries.find((entry) => entry !== null);
  if (!found) {
    return null;
  }
  return found.async("uint8array");
}

/**
 * Parse an Anki `.apkg` (zipped SQLite collection) into typing words.
 * Uses the front field as the word and remaining fields as translations.
 */
export async function parseAnkiApkg(
  file: File | ArrayBuffer,
  fallbackName = "Anki deck"
): Promise<AnkiImportResult> {
  const [{ default: JSZip }, SQL] = await Promise.all([
    import("jszip"),
    loadSqlEngine(),
  ]);

  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);
  const collectionBytes = await readFirstCollection(zip);

  if (!collectionBytes) {
    throw new Error(
      "No Anki collection found in this file (expected collection.anki2 / .anki21)."
    );
  }

  const db = new SQL.Database(collectionBytes);
  try {
    const noteRows = db.exec("SELECT flds FROM notes");
    const [noteTable] = noteRows;
    if (!noteTable || noteTable.values.length === 0) {
      return { deckName: fallbackName, words: [] };
    }

    const seen = new Set<string>();
    const words: Word[] = [];
    for (const row of noteTable.values) {
      const [flds] = row;
      if (typeof flds !== "string") {
        continue;
      }
      const word = wordFromFields(fieldsFromNote(flds));
      if (!word || seen.has(word.name)) {
        continue;
      }
      seen.add(word.name);
      words.push(word);
    }

    let decksJson: string | undefined;
    try {
      const colRows = db.exec("SELECT decks FROM col LIMIT 1");
      const value = colRows[0]?.values[0]?.[0];
      if (typeof value === "string") {
        decksJson = value;
      }
    } catch {
      // Schema variants are fine — fall back to filename.
    }

    return {
      deckName: pickDeckName(decksJson, fallbackName),
      words,
    };
  } finally {
    db.close();
  }
}
