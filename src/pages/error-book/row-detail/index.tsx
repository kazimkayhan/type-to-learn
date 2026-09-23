/* eslint-disable react/prop-types */

import { useSetAtom } from "jotai";
import { useCallback, useMemo, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import type { WordPronunciationIconRef } from "@/components/word-pronunciation-icon";
import { WordPronunciationIcon } from "@/components/word-pronunciation-icon";
import Phonetic from "@/pages/typing/components/word-panel/components/phonetic";
import Letter from "@/pages/typing/components/word-panel/components/word/letter";
import { idDictionaryMap } from "@/resources/dictionary";
import HashtagIcon from "~icons/heroicons/chart-pie-20-solid";
import CheckCircle from "~icons/heroicons/check-circle-20-solid";
import ClockIcon from "~icons/heroicons/clock-20-solid";
import XCircle from "~icons/heroicons/x-circle-20-solid";
import IconX from "~icons/tabler/x";
import useGetWord from "../hooks/use-get-word";
import { LoadingWordUI } from "../loading-word-ui";
import { currentRowDetailAtom } from "../store";
import type { groupedWordRecords } from "../type";
import DataTag from "./data-tag";
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

  const dictInfo = idDictionaryMap[currentRowDetail.dict];
  const { word, isLoading, hasError } = useGetWord(
    currentRowDetail.word,
    dictInfo
  );
  const wordPronunciationIconRef = useRef<WordPronunciationIconRef | null>(
    null
  );

  const rowDetailData: RowDetailData = useMemo(() => {
    const time =
      currentRowDetail.records.length > 0
        ? currentRowDetail.records.reduce(
            (acc, cur) => acc + cur.totalTime,
            0
          ) / currentRowDetail.records.length
        : 0;
    const timeStr = (time / 1000).toFixed(2);
    const correctCount = currentRowDetail.records.length;
    const { wrongCount } = currentRowDetail;
    const sumCount = correctCount + wrongCount;
    return { correctCount, sumCount, time: timeStr, wrongCount };
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

  useHotkeys(
    "ctrl+j",
    () => {
      wordPronunciationIconRef.current?.play();
    },
    [],
    { enableOnFormTags: true, preventDefault: true }
  );

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-3">
      <div className="relative z-10 my-card flex h-auto max-h-[90dvh] w-[min(26rem,calc(100vw-1.5rem))] min-w-0 select-text flex-col items-center justify-around overflow-y-auto rounded-2xl bg-card px-3 py-10 sm:h-[32rem]">
        <IconX
          className="absolute top-3 right-3 h-6 w-6 cursor-pointer text-muted-foreground"
          onClick={onClose}
        />
        <div className="flex flex-col items-center justify-start">
          <div className="flex max-w-full flex-wrap justify-center">
            {currentRowDetail.word.split("").map((t, index) => (
              <Letter key={`${index}-${t}`} letter={t} state="normal" visible />
            ))}
          </div>
          <div className="relative flex h-8 items-center">
            {word ? (
              <Phonetic word={word} />
            ) : (
              <LoadingWordUI hasError={hasError} isLoading={isLoading} />
            )}
            {word && dictInfo ? (
              <WordPronunciationIcon
                className="absolute top-1/2 -right-7 h-5 w-5 -translate-y-1/2 transform"
                lang={dictInfo.language}
                ref={wordPronunciationIconRef}
                word={word}
              />
            ) : null}
          </div>
          <div className="flex max-w-[24rem] items-center">
            <span
              className={
                "max-w-4xl text-center font-sans text-foreground transition-colors duration-300"
              }
            >
              {word ? (
                word.trans.join("; ")
              ) : (
                <LoadingWordUI hasError={hasError} isLoading={isLoading} />
              )}
            </span>
          </div>
        </div>
        <div className="item flex flex-col gap-4">
          <div className="flex gap-6">
            <DataTag
              data={rowDetailData.time}
              icon={ClockIcon}
              name="Avg. time"
            />
            <DataTag
              data={rowDetailData.sumCount}
              icon={HashtagIcon}
              name="Sessions"
            />
          </div>
          <div className="flex gap-6">
            <DataTag
              data={rowDetailData.correctCount}
              icon={CheckCircle}
              name="Correct"
            />
            <DataTag
              data={rowDetailData.wrongCount}
              icon={XCircle}
              name="Mistakes"
            />
          </div>
        </div>
        <RowPagination
          allRecords={allRecords}
          className="absolute bottom-6 mt-10"
        />
      </div>
      <div
        className="absolute inset-0 z-0 cursor-pointer bg-transparent"
        onClick={onClose}
      />
    </div>
  );
};

interface RowDetailData {
  correctCount: number;
  sumCount: number;
  time: string;
  wrongCount: number;
}

export default RowDetail;
