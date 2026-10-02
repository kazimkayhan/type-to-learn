import { useCallback, useEffect, useState } from "react";
import type { VocabularyAnalytics } from "@/utils/db/word-mastery";
import { getVocabularyAnalytics } from "@/utils/db/word-mastery";

export function useVocabularyAnalytics() {
  const [data, setData] = useState<VocabularyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  const refresh = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

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
  }, [reloadToken]);

  return { data, loading, refresh };
}
