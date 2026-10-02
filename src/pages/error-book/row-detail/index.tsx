import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import WordStudySheet from "@/components/word-study-sheet";
import { customDictionariesAtom } from "@/store";
import { findDictionary } from "@/utils/dictionary-lookup";
import IconX from "~icons/tabler/x";
import useGetWord from "../hooks/use-get-word";
import { LoadingWordUI } from "../loading-word-ui";
import { currentRowDetailAtom } from "../store";
import type { groupedWordRecords } from "../type";
import RowPagination from "./row-pagination";

interface RowDetailProps {
  allRecords: groupedWordRecords[];
  currentRowDetail: groupedWordRecords;
}

const RowDetail: React.FC<RowDetailProps> = ({
  currentRowDetail,
  allRecords,
}) => {
  const setCurrentRowDetail = useSetAtom(currentRowDetailAtom);
  const customDictionaries = useAtomValue(customDictionariesAtom);

  const dictInfo = findDictionary(currentRowDetail.dict, customDictionaries);
  const { word, isLoading, hasError } = useGetWord(
    currentRowDetail.word,
    dictInfo
  );

  const stats = useMemo(() => {
    const time =
      currentRowDetail.records.length > 0
        ? currentRowDetail.records.reduce(
            (acc, cur) => acc + cur.totalTime,
            0
          ) / currentRowDetail.records.length
        : 0;
    return {
      avgTimeSec: (time / 1000).toFixed(2),
      correctCount: currentRowDetail.records.length,
      sessionCount:
        currentRowDetail.records.length + currentRowDetail.wrongCount,
      wrongCount: currentRowDetail.wrongCount,
    };
  }, [currentRowDetail.records, currentRowDetail.wrongCount]);

  const onClose = useCallback(() => {
    setCurrentRowDetail(null);
  }, [setCurrentRowDetail]);

  useHotkeys(
    "esc",
    (e) => {
      onClose();
      e.stopPropagation();
    },
    { preventDefault: true }
  );

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-3">
      <div className="relative z-10 my-card flex h-auto max-h-[90dvh] w-[min(26rem,calc(100vw-1.5rem))] min-w-0 select-text flex-col items-center overflow-y-auto rounded-2xl bg-card px-4 pt-10 pb-16">
        <button
          aria-label="Close word detail"
          className="absolute top-3 right-3 inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          onClick={onClose}
          type="button"
        >
          <IconX className="size-6" />
        </button>

        {word ? (
          <WordStudySheet
            dictId={currentRowDetail.dict}
            onClose={onClose}
            stats={stats}
            word={word}
          />
        ) : (
          <div className="flex min-h-40 items-center justify-center">
            <LoadingWordUI hasError={hasError} isLoading={isLoading} />
          </div>
        )}

        <RowPagination
          allRecords={allRecords}
          className="absolute bottom-4 mt-6"
        />
      </div>
      <button
        aria-label="Dismiss word detail"
        className="absolute inset-0 z-0 cursor-pointer bg-transparent"
        onClick={onClose}
        type="button"
      />
    </div>
  );
};

export default RowDetail;
