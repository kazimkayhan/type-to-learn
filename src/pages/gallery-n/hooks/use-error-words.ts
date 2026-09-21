import { useEffect, useState } from "react";
import useSWR from "swr";
import type { Dictionary, Word } from "@/typings";
import { db } from "@/utils/db";
import type { WordRecord } from "@/utils/db/record";
import { wordListFetcher } from "@/utils/word-list-fetcher";

interface groupRecord {
  records: WordRecord[];
  word: string;
}

export interface TErrorWordData {
  errorChar: string[];
  errorCount: number;
  errorLetters: Record<string, number>;
  latestErrorTime: number;
  originData: Word;
  word: string;
}

export default function useErrorWordData(dict: Dictionary, _reload: boolean) {
  const {
    data: wordList,
    error,
    isLoading,
  } = useSWR(dict.url, wordListFetcher);

  const [errorWordData] = useState<TErrorWordData[]>([]);

  useEffect(() => {
    if (!wordList) {
      return;
    }

    db.wordRecords
      .where("wrongCount")
      .above(0)
      .filter((record) => record.dict === dict.id)
      .toArray()
      .then((records) => {
        const groupRecords: groupRecord[] = [];

        for (const record of records) {
          let groupRecord = groupRecords.find((g) => g.word === record.word);
          if (!groupRecord) {
            groupRecord = { records: [], word: record.word };
            groupRecords.push(groupRecord);
          }
          groupRecord.records.push(record as WordRecord);
        }

        const res: TErrorWordData[] = [];

        for (const groupRecord of groupRecords) {
          const errorLetters = {} as Record<string, number>;
          for (const record of groupRecord.records) {
            for (const index in record.mistakes) {
              if (!Object.hasOwn(record.mistakes, index)) {
                continue;
              }
              const mistakes = record.mistakes[index];
              if (mistakes.length > 0) {
                errorLetters[index] =
                  (errorLetters[index] ?? 0) + mistakes.length;
              }
            }
          }

          const word = wordList.find((w) => w.name === groupRecord.word);
          if (!word) {
            return;
          }

          const errorData: TErrorWordData = {
            errorChar: Object.entries(errorLetters)
              .sort((a, b) => b[1] - a[1])
              .map(([index]) => groupRecord.word[Number(index)]),
            errorCount: groupRecord.records.reduce(
              (acc, cur) => acc + cur.wrongCount,
              0
            ),
            errorLetters,

            latestErrorTime: groupRecord.records.reduce(
              (acc, cur) => Math.max(acc, cur.timeStamp),
              0
            ),
            originData: word,
            word: groupRecord.word,
          };
          res.push(errorData);
        }

        setErrorData(res);
      });
  }, [dict.id, wordList]);

  return { error, errorWordData, isLoading };
}
