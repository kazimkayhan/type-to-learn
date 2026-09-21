import { useEffect, useState } from "react";
import useSWR from "swr";
import type { Dictionary, Word } from "@/typings";
import { db } from "@/utils/db";
import type { WordRecord } from "@/utils/db/record";
import { wordListFetcher } from "@/utils/word-list-fetcher";

interface GroupRecord {
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

const groupRecordsByWord = (records: WordRecord[]): GroupRecord[] => {
  const groups = new Map<string, GroupRecord>();

  for (const record of records) {
    const existing = groups.get(record.word);
    if (existing) {
      existing.records.push(record);
      continue;
    }
    groups.set(record.word, { records: [record], word: record.word });
  }

  return [...groups.values()];
};

const collectErrorLetters = (records: WordRecord[]): Record<string, number> => {
  const errorLetters: Record<string, number> = {};

  for (const record of records) {
    for (const [index, mistakes] of Object.entries(record.mistakes)) {
      if (mistakes.length === 0) {
        continue;
      }
      errorLetters[index] = (errorLetters[index] ?? 0) + mistakes.length;
    }
  }

  return errorLetters;
};

const toErrorWordData = (
  grouped: GroupRecord,
  wordList: Word[]
): TErrorWordData | undefined => {
  const word = wordList.find((item) => item.name === grouped.word);
  if (!word) {
    return;
  }

  const errorLetters = collectErrorLetters(grouped.records);

  return {
    errorChar: Object.entries(errorLetters)
      .sort((a, b) => b[1] - a[1])
      .map(([index]) => grouped.word[Number(index)]),
    errorCount: grouped.records.reduce((acc, cur) => acc + cur.wrongCount, 0),
    errorLetters,
    latestErrorTime: grouped.records.reduce(
      (acc, cur) => Math.max(acc, cur.timeStamp),
      0
    ),
    originData: word,
    word: grouped.word,
  };
};

const buildErrorWordData = (
  records: WordRecord[],
  wordList: Word[]
): TErrorWordData[] => {
  const result: TErrorWordData[] = [];

  for (const grouped of groupRecordsByWord(records)) {
    const errorData = toErrorWordData(grouped, wordList);
    if (errorData) {
      result.push(errorData);
    }
  }

  return result;
};

export default function useErrorWordData(dict: Dictionary, reload: boolean) {
  const {
    data: wordList,
    error,
    isLoading,
  } = useSWR(dict.url, wordListFetcher);

  const [errorWordData, setErrorWordData] = useState<TErrorWordData[]>([]);

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
        setErrorWordData(buildErrorWordData(records as WordRecord[], wordList));
      });
  }, [dict.id, reload, wordList]);

  return { error, errorWordData, isLoading };
}
