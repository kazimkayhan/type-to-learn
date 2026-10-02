import type { Dictionary, LanguageType, Word } from "@/typings";
import { calcChapterCount, getUTCUnixTimestamp } from "@/utils";
import { db } from ".";

export const CUSTOM_DICT_PREFIX = "custom:";
export const CUSTOM_LIST_URL_PREFIX = "custom://";

const CSV_LINE_SPLIT_REGEX = /\r?\n/;
const CSV_ESCAPE_NEEDED_REGEX = /[",\n\r]/;
const CSV_EXT_REGEX = /\.csv$/i;
const CSV_EDGE_QUOTES_REGEX = /^"|"$/g;
const NON_WORD_FILENAME_REGEX = /[^\w-]+/g;

export interface ICustomList {
  createdAt: number;
  description: string;
  id: string;
  language: LanguageType;
  name: string;
  updatedAt: number;
  words: Word[];
}

export function isCustomDictId(id: string): boolean {
  return id.startsWith(CUSTOM_DICT_PREFIX);
}

export function customListUrl(id: string): string {
  return `${CUSTOM_LIST_URL_PREFIX}${encodeURIComponent(id)}`;
}

export function parseCustomListUrl(url: string): string | null {
  if (!url.startsWith(CUSTOM_LIST_URL_PREFIX)) {
    return null;
  }
  return decodeURIComponent(url.slice(CUSTOM_LIST_URL_PREFIX.length));
}

export function customListToDictionary(list: ICustomList): Dictionary {
  return {
    category: "My lists",
    chapterCount: Math.max(1, calcChapterCount(list.words.length)),
    description: list.description || list.name,
    id: list.id,
    language: list.language,
    languageCategory: "en",
    length: list.words.length,
    name: list.name,
    tags: ["Custom"],
    url: customListUrl(list.id),
  };
}

function newCustomListId(): string {
  return `${CUSTOM_DICT_PREFIX}${crypto.randomUUID()}`;
}

export async function listCustomLists(): Promise<ICustomList[]> {
  const rows = await db.customLists.toArray();
  return rows.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function listCustomDictionaries(): Promise<Dictionary[]> {
  const lists = await listCustomLists();
  return lists.map(customListToDictionary);
}

export async function getCustomList(
  id: string
): Promise<ICustomList | undefined> {
  return db.customLists.get(id);
}

export async function createCustomList(input: {
  description?: string;
  language?: LanguageType;
  name: string;
  words?: Word[];
}): Promise<ICustomList> {
  const now = getUTCUnixTimestamp();
  const list: ICustomList = {
    createdAt: now,
    description: input.description?.trim() || "",
    id: newCustomListId(),
    language: input.language ?? "en",
    name: input.name.trim() || "Untitled list",
    updatedAt: now,
    words: dedupeWords(input.words ?? []),
  };
  await db.customLists.put(list);
  return list;
}

export async function updateCustomList(
  id: string,
  patch: Partial<Pick<ICustomList, "description" | "name" | "words">>
): Promise<ICustomList> {
  const existing = await getCustomList(id);
  if (!existing) {
    throw new Error(`Custom list not found: ${id}`);
  }
  const updated: ICustomList = {
    ...existing,
    description:
      patch.description === undefined
        ? existing.description
        : patch.description.trim(),
    name: patch.name === undefined ? existing.name : patch.name.trim(),
    updatedAt: getUTCUnixTimestamp(),
    words:
      patch.words === undefined ? existing.words : dedupeWords(patch.words),
  };
  await db.customLists.put(updated);
  return updated;
}

export async function deleteCustomList(id: string): Promise<void> {
  await db.customLists.delete(id);
}

export async function addWordToCustomList(
  id: string,
  word: Word
): Promise<ICustomList> {
  const existing = await getCustomList(id);
  if (!existing) {
    throw new Error(`Custom list not found: ${id}`);
  }
  const nextWords = dedupeWords([...existing.words, word]);
  return updateCustomList(id, { words: nextWords });
}

function dedupeWords(words: Word[]): Word[] {
  const seen = new Set<string>();
  const result: Word[] = [];
  for (const word of words) {
    const name = word.name.trim();
    if (!name || seen.has(name)) {
      continue;
    }
    seen.add(name);
    result.push({
      ...word,
      name,
      trans: Array.isArray(word.trans)
        ? word.trans.filter((item) => typeof item === "string")
        : [],
    });
  }
  return result;
}

/** Parse a simple CSV (`word,translation`) into Word[]. Header row optional. */
export function parseWordCsv(text: string): Word[] {
  const lines = text
    .split(CSV_LINE_SPLIT_REGEX)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (lines.length === 0) {
    return [];
  }

  let start = 0;
  const header = parseCsvLine(lines[0]);
  const firstCol = header[0]?.toLowerCase() ?? "";
  if (firstCol === "word" || firstCol === "name") {
    start = 1;
  }

  const words: Word[] = [];
  for (let i = start; i < lines.length; i += 1) {
    const cols = parseCsvLine(lines[i]);
    const name = cols[0]?.trim();
    if (!name) {
      continue;
    }
    const translation = cols
      .slice(1)
      .join(",")
      .trim()
      .replace(CSV_EDGE_QUOTES_REGEX, "");
    words.push({
      name,
      trans: translation ? [translation] : [],
    });
  }
  return dedupeWords(words);
}

export function wordsToCsv(words: Word[]): string {
  const rows = ["word,translation"];
  for (const word of words) {
    const translation = word.trans.join("; ");
    rows.push(`${escapeCsvField(word.name)},${escapeCsvField(translation)}`);
  }
  return `${rows.join("\n")}\n`;
}

export function sanitizeListFilename(name: string): string {
  return name.replace(NON_WORD_FILENAME_REGEX, "_") || "list";
}

export function stripCsvExtension(filename: string): string {
  return filename.replace(CSV_EXT_REGEX, "").trim();
}

function escapeCsvField(value: string): string {
  if (CSV_ESCAPE_NEEDED_REGEX.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
      continue;
    }
    if (char === ",") {
      result.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  result.push(current);
  return result;
}
