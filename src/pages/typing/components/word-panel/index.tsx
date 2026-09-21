import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { usePrefetchPronunciationSound } from "@/hooks/use-pronunciation";
import {
  isReviewModeAtom,
  isShowPrevAndNextWordAtom,
  loopWordConfigAtom,
  phoneticConfigAtom,
  reviewModeInfoAtom,
} from "@/store";
import type { Word } from "@/typings";
import { TypingStateActionType, useTypingContext } from "../../store";
import type { TypingState } from "../../store/type";
import PrevAndNextWord from "../prev-and-next-word";
import Progress from "../progress";
import Phonetic from "./components/phonetic";
import Translation from "./components/translation";
import WordComponent from "./components/word";

export default function WordPanel() {
  const { state, dispatch } = useTypingContext();
  const phoneticConfig = useAtomValue(phoneticConfigAtom);
  const isShowPrevAndNextWord = useAtomValue(isShowPrevAndNextWordAtom);
  const [wordComponentKey, setWordComponentKey] = useState(0);
  const [currentWordExerciseCount, setCurrentWordExerciseCount] = useState(0);
  const { times: loopWordTimes } = useAtomValue(loopWordConfigAtom);
  const currentWord = state.chapterData.words[state.chapterData.index];
  const nextWord = state.chapterData.words[state.chapterData.index + 1] as
    | Word
    | undefined;

  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom);
  const isReviewMode = useAtomValue(isReviewModeAtom);

  const prevIndex = useMemo(() => {
    const newIndex = state.chapterData.index - 1;
    return newIndex < 0 ? 0 : newIndex;
  }, [state.chapterData.index]);
  const nextIndex = useMemo(() => {
    const newIndex = state.chapterData.index + 1;
    return newIndex > state.chapterData.words.length - 1
      ? state.chapterData.words.length - 1
      : newIndex;
  }, [state.chapterData.index, state.chapterData.words.length]);

  usePrefetchPronunciationSound(nextWord?.name);

  const reloadCurrentWordComponent = useCallback(() => {
    setWordComponentKey((old) => old + 1);
  }, []);

  const updateReviewRecord = useCallback(
    (state: TypingState) => {
      setReviewModeInfo((old) => ({
        ...old,
        reviewRecord: old.reviewRecord
          ? { ...old.reviewRecord, index: state.chapterData.index }
          : undefined,
      }));
    },
    [setReviewModeInfo]
  );

  const onFinish = useCallback(() => {
    if (
      state.chapterData.index < state.chapterData.words.length - 1 ||
      currentWordExerciseCount < loopWordTimes - 1
    ) {
      // 用户完成当前单词
      if (currentWordExerciseCount < loopWordTimes - 1) {
        setCurrentWordExerciseCount((old) => old + 1);
        dispatch({ type: TypingStateActionType.LOOP_CURRENT_WORD });
        reloadCurrentWordComponent();
      } else {
        setCurrentWordExerciseCount(0);
        if (isReviewMode) {
          dispatch({
            payload: {
              updateReviewRecord,
            },
            type: TypingStateActionType.NEXT_WORD,
          });
        } else {
          dispatch({ type: TypingStateActionType.NEXT_WORD });
        }
      }
    } else {
      // 用户完成当前章节
      dispatch({ type: TypingStateActionType.FINISH_CHAPTER });
      if (isReviewMode) {
        setReviewModeInfo((old) => ({
          ...old,
          reviewRecord: old.reviewRecord
            ? { ...old.reviewRecord, isFinished: true }
            : undefined,
        }));
      }
    }
  }, [
    state.chapterData.index,
    state.chapterData.words.length,
    currentWordExerciseCount,
    loopWordTimes,
    dispatch,
    reloadCurrentWordComponent,
    isReviewMode,
    updateReviewRecord,
    setReviewModeInfo,
  ]);

  const onSkipWord = useCallback(
    (type: "prev" | "next") => {
      if (type === "prev") {
        dispatch({
          newIndex: prevIndex,
          type: TypingStateActionType.SKIP_2_WORD_INDEX,
        });
      }

      if (type === "next") {
        dispatch({
          newIndex: nextIndex,
          type: TypingStateActionType.SKIP_2_WORD_INDEX,
        });
      }
    },
    [dispatch, prevIndex, nextIndex]
  );

  useHotkeys(
    "Ctrl + Shift + ArrowLeft",
    (e) => {
      e.preventDefault();
      onSkipWord("prev");
    },
    { preventDefault: true }
  );

  useHotkeys(
    "Ctrl + Shift + ArrowRight",
    (e) => {
      e.preventDefault();
      onSkipWord("next");
    },
    { preventDefault: true }
  );
  const [isShowTranslation, setIsHoveringTranslation] = useState(false);

  const handleShowTranslation = useCallback((checked: boolean) => {
    setIsHoveringTranslation(checked);
  }, []);

  useHotkeys(
    "tab",
    () => {
      handleShowTranslation(true);
    },
    { enableOnFormTags: true, preventDefault: true },
    []
  );

  useHotkeys(
    "tab",
    () => {
      handleShowTranslation(false);
    },
    { enableOnFormTags: true, keyup: true, preventDefault: true },
    []
  );

  const shouldShowTranslation = useMemo(
    () => isShowTranslation || state.isTransVisible,
    [isShowTranslation, state.isTransVisible]
  );

  const startTyping = useCallback(() => {
    if (!state.isTyping) {
      dispatch({ payload: true, type: TypingStateActionType.SET_IS_TYPING });
    }
  }, [dispatch, state.isTyping]);

  return (
    <div className="container flex h-full w-full min-w-0 flex-col items-center justify-center px-2 sm:px-4">
      <div className="container flex h-14 w-full max-w-full shrink-0 grow-0 justify-between gap-2 px-1 pt-2 sm:h-24 sm:px-12 sm:pt-10">
        {isShowPrevAndNextWord && state.isTyping && (
          <>
            <PrevAndNextWord type="prev" />
            <PrevAndNextWord type="next" />
          </>
        )}
      </div>
      <div className="container flex min-h-0 max-w-full flex-grow flex-col items-center justify-center px-0 sm:px-2">
        {Boolean(currentWord) && (
          <div className="relative flex w-full min-w-0 max-w-full justify-center px-1 sm:px-2">
            {!state.isTyping && (
              <div
                className="absolute z-10 flex h-full w-full cursor-pointer justify-center"
                onClick={startTyping}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    startTyping();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="z-10 flex w-full items-center backdrop-blur-sm">
                  <p className="w-full select-none px-4 text-center text-gray-600 text-lg sm:text-xl dark:text-gray-50">
                    <span className="md:hidden">
                      Tap to {state.timerData.time ? "continue" : "start"}
                    </span>
                    <span className="hidden md:inline">
                      Press any key to{" "}
                      {state.timerData.time ? "continue" : "start"}
                    </span>
                  </p>
                </div>
              </div>
            )}
            <div className="relative max-w-full">
              <WordComponent
                key={wordComponentKey}
                onFinish={onFinish}
                word={currentWord}
              />
              {phoneticConfig.isOpen && <Phonetic word={currentWord} />}
              <Translation
                onMouseEnter={() => handleShowTranslation(true)}
                onMouseLeave={() => handleShowTranslation(false)}
                showTrans={shouldShowTranslation}
                trans={currentWord.trans.join("; ")}
              />
            </div>
          </div>
        )}
      </div>
      <Progress
        className={`mt-auto mb-4 w-3/4 sm:mb-10 sm:w-1/4 ${state.isTyping ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
