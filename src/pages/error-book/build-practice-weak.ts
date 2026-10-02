import type { Dictionary, Word } from "@/typings";
import { findDictionary } from "@/utils/dictionary-lookup";
import { wordListFetcher } from "@/utils/word-list-fetcher";
import type { groupedWordRecords } from "./type";

export const PRACTICE_TOP_N = 20;

export interface PracticeWordKey {
  dict: string;
  word: string;
}

export interface PracticeWeakResult {
  dictId: string;
  words: Word[];
}

/**
 * Resolve word keys into a practice session from one dictionary.
 * Uses the first item's dict and keeps only keys from that dict
 * (so mastery attribution stays consistent).
 */
export async function buildPracticeFromWordKeys(
  items: PracticeWordKey[],
  customDictionaries: Dictionary[]
): Promise<PracticeWeakResult | null> {
  if (items.length === 0) {
    return null;
  }

  const primaryDict = items[0]?.dict;
  if (!primaryDict) {
    return null;
  }

  const sameDict = items.filter((item) => item.dict === primaryDict);
  const dictInfo = findDictionary(primaryDict, customDictionaries);

  if (!dictInfo) {
    // Dict may have been removed; still allow typing the headwords.
    const bareWords: Word[] = [];
    const seen = new Set<string>();
    for (const item of sameDict) {
      const key = item.word.toLowerCase();
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      bareWords.push({ name: item.word, trans: [] });
    }
    if (bareWords.length === 0) {
      return null;
    }
    return { dictId: primaryDict, words: bareWords };
  }

  const wordList = await wordListFetcher(dictInfo.url);
  const byName = new Map(
    wordList.map((word) => [word.name.toLowerCase(), word] as const)
  );

  const words: Word[] = [];
  const seen = new Set<string>();
  for (const item of sameDict) {
    const key = item.word.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    const found = byName.get(key);
    words.push(found ?? { name: item.word, trans: [] });
  }

  if (words.length === 0) {
    return null;
  }

  return { dictId: primaryDict, words };
}

/**
 * Build a practice session from the weakest error-book entries.
 * Uses the dictionary of the #1 weakest word and only includes other
 * top-N words from that same dictionary (so mastery stays consistent).
 */
export async function buildPracticeWeakWords(
  records: groupedWordRecords[],
  customDictionaries: Dictionary[],
  limit = PRACTICE_TOP_N
): Promise<PracticeWeakResult | null> {
  if (records.length === 0) {
    return null;
  }

  const ranked = [...records].sort((a, b) => b.wrongCount - a.wrongCount);
  const top = ranked.slice(0, limit);
  return buildPracticeFromWordKeys(top, customDictionaries);
}

/** Practice an explicit selection (order preserved; same-dict filter applies). */
export async function buildPracticeFromRecords(
  records: groupedWordRecords[],
  customDictionaries: Dictionary[]
): Promise<PracticeWeakResult | null> {
  return buildPracticeFromWordKeys(records, customDictionaries);
}
