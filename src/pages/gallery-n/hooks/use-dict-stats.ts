import { useEffect, useState } from "react";
import { db } from "@/utils/db";
import type { IChapterRecord } from "@/utils/db/record";

export function useDictStats(dictID: string, isStartLoad: boolean) {
  const [dictStats, setDictStats] = useState<IDictStats | null>(null);

  useEffect(() => {
    const fetchDictStats = async () => {
      const stats = await getDictStats(dictID);
      setDictStats(stats);
    };

    if (isStartLoad && !dictStats) {
      fetchDictStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictID, isStartLoad, dictStats]);

  return dictStats;
}

interface IDictStats {
  exercisedChapterCount: number;
}

async function getDictStats(dict: string): Promise<IDictStats> {
  const records: IChapterRecord[] = await db.chapterRecords
    .where({ dict })
    .toArray();
  const uniqueChapter = new Set(
    records
      .map(({ chapter }) => chapter)
      .filter((item): item is number => item !== null && item >= 0)
  );
  const exercisedChapterCount = uniqueChapter.size;

  return { exercisedChapterCount };
}
