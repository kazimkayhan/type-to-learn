import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { usePrefetchPronunciationSounds } from "@/hooks/use-pronunciation";
import {
  isReviewModeAtom,
  isShowPrevAndNextWordAtom,
  loopWordConfigAtom,
  phoneticConfigAtom,
  reviewModeInfoAtom,
} from "@/store";
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
  const isLastWordInChapter =
    state.chapterData.index >= state.chapterData.words.length - 1;
  const nextWordName = isLastWordInChapter
    ? undefined
    : state.chapterData.words[state.chapterData.index + 1]?.name;

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

  usePrefetchPronunciationSounds(currentWord?.name, nextWordName);

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
      <div className="container flex h-14 w-full max-w-full shrink-0 grow-0 items-center justify-between gap-2 overflow-hidden px-1 pt-2 sm:h-20 sm:px-12 sm:pt-6">
        {isShowPrevAndNextWord && state.isTyping && (
          <>
            <PrevAndNextWord type="prev" />
            <PrevAndNextWord type="next" />
          </>
        )}
      </div>
      <div className="container flex min-h-0 max-w-full flex-grow flex-col items-center justify-center px-0 sm:px-2">
        {Boolean(currentWord) && (
          <div className="relative flex w-full min-w-0 max-w-full flex-col items-center px-1 sm:px-2">
            <div className="relative max-w-full">
              {!state.isTyping && (
                <button
                  aria-label={
                    state.timerData.time
                      ? "Press any key to continue"
                      : "Press any key to start"
                  }
                  className="absolute inset-0 z-10 cursor-pointer rounded-lg pr-10"
                  onClick={startTyping}
                  tabIndex={-1}
                  type="button"
                />
              )}
              <WordComponent
                key={`${state.chapterData.index}-${wordComponentKey}`}
                onFinish={onFinish}
                word={currentWord}
              />
              {phoneticConfig.isOpen && <Phonetic word={currentWord} />}
              <Translation
                onMouseEnter={() => handleShowTranslation(true)}
                onMouseLeave={() => handleShowTranslation(false)}
                senses={currentWord.trans}
                showTrans={shouldShowTranslation}
              />
            </div>
            {!state.isTyping && (
              <p className="pointer-events-none mt-4 rounded-full bg-white px-5 py-2 text-center font-medium text-base text-gray-800 shadow-md sm:text-lg dark:bg-indigo-500 dark:text-white">
                {state.timerData.time
                  ? "Press any key to continue"
                  : "Press any key to start"}
              </p>
            )}
          </div>
        )}
      </div>
      <Progress
        className={`mt-auto mb-4 w-3/4 sm:mb-10 sm:w-1/4 ${state.isTyping ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
