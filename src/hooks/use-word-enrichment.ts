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

const cache = new Map<string, WordEnrichment | null>();

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

    fetch(`${DICTIONARY_API_BASE}${encodeURIComponent(key)}`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: DictionaryApiEntry[] | null) => {
        const parsed = data ? parseEntries(data) : null;
        cacheSet(key, parsed);
        if (requestedKeyRef.current === key) {
          setEnrichment(parsed);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (requestedKeyRef.current === key && !controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [word, enabled]);

  return { enrichment, isLoading };
}
