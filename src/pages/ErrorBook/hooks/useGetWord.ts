import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import type { Dictionary, Word } from "@/typings";
import { wordListFetcher } from "@/utils/wordListFetcher";

export default function useGetWord(name: string, dict: Dictionary) {
  const {
    data: wordList,
    error,
    isLoading,
  } = useSWR(dict?.url, wordListFetcher);
  const [hasError, setHasError] = useState(false);

  const word: Word | undefined = useMemo(() => {
    if (!wordList) {
      return;
    }

    const word = wordList.find((word) => word.name === name);
    if (word) {
      return word;
    }
    setHasError(true);
  }, [wordList, name]);

  useEffect(() => {
    if (error) {
      setHasError(true);
    }
  }, [error]);

  return { hasError, isLoading, word };
}
