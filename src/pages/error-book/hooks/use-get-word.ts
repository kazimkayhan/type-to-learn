import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import type { Dictionary, Word } from "@/typings";
import { wordListFetcher } from "@/utils/word-list-fetcher";

export default function useGetWord(name: string, dict: Dictionary | undefined) {
  const {
    data: wordList,
    error,
    isLoading,
  } = useSWR(dict?.url ?? null, wordListFetcher);
  const [hasError, setHasError] = useState(false);

  const word: Word | undefined = useMemo(() => {
    if (!(dict && wordList)) {
      return;
    }
    return wordList.find((w) => w.name === name);
  }, [dict, wordList, name]);

  useEffect(() => {
    setHasError(Boolean(error) || !dict || (Boolean(wordList) && !word));
  }, [error, dict, wordList, word]);

  return { hasError, isLoading: Boolean(dict) && isLoading, word };
}
