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
    if (!dict) {
      return;
    }
    if (!wordList) {
      return;
    }

    const found = wordList.find((w) => w.name === name);
    if (found) {
      return found;
    }
    setHasError(true);
  }, [dict, wordList, name]);

  useEffect(() => {
    if (error || !dict) {
      setHasError(true);
    }
  }, [error, dict]);

  return { hasError, isLoading: Boolean(dict) && isLoading, word };
}
