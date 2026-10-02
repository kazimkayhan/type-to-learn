import { useEffect, useState } from "react";
import { getDictMasteryStats } from "@/utils/db/word-mastery";

export function useDictMasteryStats(dictId: string, dictWordLength: number) {
  const [stats, setStats] = useState<{
    mastered: number;
    total: number;
    tracked: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDictMasteryStats(dictId, dictWordLength).then((result) => {
      if (!cancelled) {
        setStats(result);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [dictId, dictWordLength]);

  return stats;
}
