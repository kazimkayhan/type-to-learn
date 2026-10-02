import { useEffect, useState } from "react";
import type { VocabularyAnalytics } from "@/utils/db/word-mastery";
import { getVocabularyAnalytics } from "@/utils/db/word-mastery";

export function useVocabularyAnalytics() {
  const [data, setData] = useState<VocabularyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getVocabularyAnalytics()
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
}
