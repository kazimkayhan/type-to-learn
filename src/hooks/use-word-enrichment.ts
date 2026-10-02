import { useEffect, useRef, useState } from "react";

export interface WordEnrichment {
  example: string | null;
  partOfSpeech: string | null;
  synonyms: string[];
}

interface DictionaryApiDefinition {
  definition: string;
  example?: string;
  synonyms?: string[];
}

interface DictionaryApiMeaning {
  definitions?: DictionaryApiDefinition[];
  partOfSpeech?: string;
  synonyms?: string[];
}

interface DictionaryApiEntry {
  meanings?: DictionaryApiMeaning[];
}

const DICTIONARY_API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const MAX_CACHE_SIZE = 300;
const MAX_SYNONYMS = 5;
const WORD_BOUNDARY_ESCAPE_REGEX = /[.*+?^${}()|[\]\\]/g;

const cache = new Map<string, WordEnrichment | null>();
const inflight = new Map<string, Promise<WordEnrichment | null>>();

function cacheSet(key: string, value: WordEnrichment | null) {
  cache.set(key, value);
  while (cache.size > MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey === undefined) {
      break;
    }
    cache.delete(oldestKey);
  }
}

interface EnrichmentAccumulator {
  example: string | null;
  partOfSpeech: string | null;
  synonyms: Set<string>;
}

function collectFromMeaning(
  meaning: DictionaryApiMeaning,
  acc: EnrichmentAccumulator
) {
  acc.partOfSpeech ??= meaning.partOfSpeech || null;
  for (const synonym of meaning.synonyms ?? []) {
    acc.synonyms.add(synonym);
  }
  for (const definition of meaning.definitions ?? []) {
    acc.example ??= definition.example || null;
    for (const synonym of definition.synonyms ?? []) {
      acc.synonyms.add(synonym);
    }
  }
}

function parseEntries(entries: DictionaryApiEntry[]): WordEnrichment | null {
  const acc: EnrichmentAccumulator = {
    example: null,
    partOfSpeech: null,
    synonyms: new Set<string>(),
  };

  for (const entry of entries) {
    for (const meaning of entry.meanings ?? []) {
      collectFromMeaning(meaning, acc);
    }
  }

  if (!(acc.example || acc.synonyms.size > 0)) {
    return null;
  }

  return {
    example: acc.example,
    partOfSpeech: acc.partOfSpeech,
    synonyms: [...acc.synonyms].slice(0, MAX_SYNONYMS),
  };
}

export function getCachedWordEnrichment(
  word: string
): WordEnrichment | null | undefined {
  const key = word.trim().toLowerCase();
  if (!key) {
    return null;
  }
  if (!cache.has(key)) {
    return;
  }
  return cache.get(key) ?? null;
}

/** Fetch enrichment (shared cache). Safe to call from prefetch. */
export async function fetchWordEnrichment(
  word: string,
  signal?: AbortSignal
): Promise<WordEnrichment | null> {
  const key = word.trim().toLowerCase();
  if (!key) {
    return null;
  }
  if (cache.has(key)) {
    return cache.get(key) ?? null;
  }
  const existing = inflight.get(key);
  if (existing) {
    return existing;
  }

  const request = (async () => {
    try {
      const response = await fetch(
        `${DICTIONARY_API_BASE}${encodeURIComponent(key)}`,
        { signal }
      );
      if (response.ok) {
        const data: DictionaryApiEntry[] = await response.json();
        const parsed = parseEntries(data);
        cacheSet(key, parsed);
        return parsed;
      }
      if (response.status === 404) {
        cacheSet(key, null);
      }
      return null;
    } catch {
      return null;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, request);
  return request;
}

/** Warm the cache for upcoming English words (no-op if already cached). */
export function prefetchWordEnrichments(words: string[], limit = 3) {
  let scheduled = 0;
  for (const word of words) {
    if (scheduled >= limit) {
      break;
    }
    const key = word.trim().toLowerCase();
    if (!key || cache.has(key) || inflight.has(key)) {
      continue;
    }
    scheduled += 1;
    fetchWordEnrichment(word).catch(() => {
      // Prefetch is best-effort; ignore network failures.
    });
  }
}

/**
 * Replace the target word in an example sentence with a blank.
 * Returns null when no usable example is available.
 */
export function buildClozePrompt(
  word: string,
  example: string | null | undefined
): string | null {
  if (!(example?.trim() && word.trim())) {
    return null;
  }
  const escaped = word.trim().replace(WORD_BOUNDARY_ESCAPE_REGEX, "\\$&");
  const boundary = new RegExp(`\\b${escaped}\\b`, "i");
  if (boundary.test(example)) {
    return example.replace(boundary, "____");
  }
  const loose = new RegExp(escaped, "i");
  if (!loose.test(example)) {
    return null;
  }
  return example.replace(loose, "____");
}

/**
 * Looks up example sentences and synonyms for `word` from the free,
 * keyless dictionaryapi.dev service. Results are cached in-memory
 * (module scope) since the same words recur often across loops/chapters.
 */
export default function useWordEnrichment(word: string, enabled: boolean) {
  const [enrichment, setEnrichment] = useState<WordEnrichment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const requestedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!(enabled && word)) {
      setEnrichment(null);
      setIsLoading(false);
      return;
    }

    const key = word.trim().toLowerCase();
    if (!key) {
      setEnrichment(null);
      setIsLoading(false);
      return;
    }

    if (cache.has(key)) {
      requestedKeyRef.current = key;
      setEnrichment(cache.get(key) ?? null);
      setIsLoading(false);
      return;
    }

    requestedKeyRef.current = key;
    setEnrichment(null);
    setIsLoading(true);

    const controller = new AbortController();
    let cancelled = false;

    fetchWordEnrichment(word, controller.signal)
      .then((parsed) => {
        if (cancelled || requestedKeyRef.current !== key) {
          return;
        }
        setEnrichment(parsed);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled || requestedKeyRef.current !== key) {
          return;
        }
        setEnrichment(null);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [word, enabled]);

  return { enrichment, isLoading };
}
