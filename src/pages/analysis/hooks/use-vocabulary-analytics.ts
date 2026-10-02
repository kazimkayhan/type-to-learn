import { useCallback, useEffect, useState } from "react";
import type { VocabularyDeepAnalytics } from "@/utils/db/vocabulary-analytics";
import { getVocabularyDeepAnalytics } from "@/utils/db/vocabulary-analytics";

export function useVocabularyAnalytics() {
  const [data, setData] = useState<VocabularyDeepAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  const refresh = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getVocabularyDeepAnalytics()
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
