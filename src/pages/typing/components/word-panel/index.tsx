import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import useDariLexicon from "@/hooks/use-dari-lexicon";
import { usePrefetchPronunciationSounds } from "@/hooks/use-pronunciation";
import { prefetchWordEnrichments } from "@/hooks/use-word-enrichment";
import {
  currentDictInfoAtom,
  isReviewModeAtom,
  isShowPrevAndNextWordAtom,
  isTodayModeAtom,
  isWordEnrichmentEnabledAtom,
  loopWordConfigAtom,
  phoneticConfigAtom,
  recallModeConfigAtom,
  reviewModeInfoAtom,
  todaySessionAtom,
} from "@/store";
import { resolveRecallMode } from "@/utils/srs/recall-mode";
import { TypingStateActionType, useTypingContext } from "../../store";
import type { TypingState } from "../../store/type";
import PrevAndNextWord from "../prev-and-next-word";
import Progress from "../progress";
import { ClozeRecallChrome, useClozePrompt } from "./components/cloze-recall";
import Phonetic from "./components/phonetic";
import Translation from "./components/translation";
import WordComponent from "./components/word";

function shouldShowTranslationForMode({
  clozeFallbackToDefinition,
  effectiveRecallMode,
  isShowTranslation,
  isTransVisible,
}: {
  clozeFallbackToDefinition: boolean;
  effectiveRecallMode: ReturnType<typeof resolveRecallMode>;
  isShowTranslation: boolean;
  isTransVisible: boolean;
}): boolean {
  if (effectiveRecallMode === "definition" || clozeFallbackToDefinition) {
    return true;
  }
  if (effectiveRecallMode === "audio" || effectiveRecallMode === "cloze") {
    return isShowTranslation;
  }
  return isShowTranslation || isTransVisible;
}

export default function WordPanel() {
  const { state, dispatch } = useTypingContext();
  const phoneticConfig = useAtomValue(phoneticConfigAtom);
  const currentDictInfo = useAtomValue(currentDictInfoAtom);
  const isShowPrevAndNextWord = useAtomValue(isShowPrevAndNextWordAtom);
  const isWordEnrichmentEnabled = useAtomValue(isWordEnrichmentEnabledAtom);
  const [wordComponentKey, setWordComponentKey] = useState(0);
  const [currentWordExerciseCount, setCurrentWordExerciseCount] = useState(0);
  const { times: loopWordTimes } = useAtomValue(loopWordConfigAtom);
  const { mode: recallModeSetting } = useAtomValue(recallModeConfigAtom);
  const currentWord = state.chapterData.words[state.chapterData.index];
  const isLastWordInChapter =
    state.chapterData.index >= state.chapterData.words.length - 1;
  const nextWordName = isLastWordInChapter
    ? undefined
    : state.chapterData.words[state.chapterData.index + 1]?.name;

  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom);
  const setTodaySession = useSetAtom(todaySessionAtom);
  const isReviewMode = useAtomValue(isReviewModeAtom);
  const isTodayMode = useAtomValue(isTodayModeAtom);

  const effectiveRecallMode = useMemo(
    () => resolveRecallMode(recallModeSetting, state.chapterData.index),
    [recallModeSetting, state.chapterData.index]
  );

  const isEnglishDict = currentDictInfo.language === "en";
  const {
    clozeEnabled,
    clozeFallbackToDefinition,
    clozeLoading,
    clozePrompt,
    displayRecallMode,
  } = useClozePrompt(currentWord?.name, effectiveRecallMode, isEnglishDict);

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

  useEffect(() => {
    if (!isEnglishDict) {
      return;
    }
    if (!(isWordEnrichmentEnabled || clozeEnabled)) {
      return;
    }
    const upcoming = state.chapterData.words
      .slice(state.chapterData.index, state.chapterData.index + 4)
      .map((word) => word.name);
    prefetchWordEnrichments(upcoming);
  }, [
    clozeEnabled,
    isEnglishDict,
    isWordEnrichmentEnabled,
    state.chapterData.index,
    state.chapterData.words,
  ]);

  const reloadCurrentWordComponent = useCallback(() => {
    setWordComponentKey((old) => old + 1);
  }, []);

  const updateReviewRecord = useCallback(
    (typingState: TypingState) => {
      setReviewModeInfo((old) => ({
        ...old,
        reviewRecord: old.reviewRecord
          ? { ...old.reviewRecord, index: typingState.chapterData.index }
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
      dispatch({ type: TypingStateActionType.FINISH_CHAPTER });
      if (isReviewMode) {
        setReviewModeInfo((old) => ({
          ...old,
          reviewRecord: old.reviewRecord
            ? { ...old.reviewRecord, isFinished: true }
            : undefined,
        }));
      }
      if (isTodayMode) {
        setTodaySession({ active: false, words: [] });
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
    isTodayMode,
    updateReviewRecord,
    setReviewModeInfo,
    setTodaySession,
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
  const { lookup: dariLookup } = useDariLexicon();

  const handleShowTranslation = useCallback((checked: boolean) => {
    setIsHoveringTranslation(checked);
  }, []);

  useHotkeys(
    "tab",
    () => {
      handleShowTranslation(true);
    },
    { enabled: state.isTyping, enableOnFormTags: true, preventDefault: true },
    [state.isTyping]
  );

  useHotkeys(
    "tab",
    () => {
      handleShowTranslation(false);
    },
    {
      enabled: state.isTyping,
      enableOnFormTags: true,
      keyup: true,
      preventDefault: true,
    },
    [state.isTyping]
  );

  const shouldShowTranslation = shouldShowTranslationForMode({
    clozeFallbackToDefinition,
    effectiveRecallMode,
    isShowTranslation,
    isTransVisible: state.isTransVisible,
  });

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
            <ClozeRecallChrome
              clozeEnabled={clozeEnabled}
              clozeFallbackToDefinition={clozeFallbackToDefinition}
              clozeLoading={clozeLoading}
              clozePrompt={clozePrompt}
              displayRecallMode={displayRecallMode}
            />
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
                recallMode={effectiveRecallMode}
                word={currentWord}
              />
              {phoneticConfig.isOpen && effectiveRecallMode === "classic" && (
                <Phonetic word={currentWord} />
              )}
              <Translation
                dariSenses={dariLookup(currentWord.name)}
                enrichable={
                  isEnglishDict &&
                  isWordEnrichmentEnabled &&
                  effectiveRecallMode !== "cloze"
                }
                onMouseEnter={() => handleShowTranslation(true)}
                onMouseLeave={() => handleShowTranslation(false)}
                senses={currentWord.trans}
                showTrans={shouldShowTranslation}
                word={currentWord.name}
              />
            </div>
            {!state.isTyping && (
              <p className="pointer-events-none mt-4 rounded-full bg-card px-5 py-2 text-center font-medium text-base text-foreground shadow-md sm:text-lg">
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
