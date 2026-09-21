import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import useSWR from "swr";
import { CHAPTER_LENGTH } from "@/constants";
import {
  currentChapterAtom,
  currentDictInfoAtom,
  reviewModeInfoAtom,
} from "@/store";
import type { Word, WordWithIndex } from "@/typings/index";
import { wordListFetcher } from "@/utils/word-list-fetcher";

export interface UseWordListResult {
  error: Error | undefined;
  isLoading: boolean;
  words: WordWithIndex[];
}

/**
 * Use word lists from the current selected dictionary.
 */
export function useWordList(): UseWordListResult {
  const currentDictInfo = useAtomValue(currentDictInfoAtom);
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom);
  const { isReviewMode, reviewRecord } = useAtomValue(reviewModeInfoAtom);

  // Reset current chapter to 0, when currentChapter is greater than chapterCount.
  if (currentChapter >= currentDictInfo.chapterCount) {
    setCurrentChapter(0);
  }

  const {
    data: wordList,
    error,
    isLoading,
  } = useSWR(currentDictInfo.url, wordListFetcher);

  const words: WordWithIndex[] = useMemo(() => {
    let newWords: Word[];
    if (isReviewMode) {
      newWords = reviewRecord?.words ?? [];
    } else if (wordList) {
      newWords = wordList.slice(
        currentChapter * CHAPTER_LENGTH,
        (currentChapter + 1) * CHAPTER_LENGTH
      );
    } else {
      newWords = [];
    }

    // 记录原始 index, 并对 word.trans 做兜底处理
    return newWords.map((word, index) => {
      let trans: string[];
      if (Array.isArray(word.trans)) {
        trans = word.trans.filter((item) => typeof item === "string");
      } else if (
        word.trans === null ||
        word.trans === undefined ||
        typeof word.trans === "object"
      ) {
        trans = [];
      } else {
        trans = [String(word.trans)];
      }
      return {
        ...word,
        index,
        trans,
      };
    });
  }, [isReviewMode, wordList, reviewRecord?.words, currentChapter]);

  return { error, isLoading, words };
}
