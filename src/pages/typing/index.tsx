import { useAtom, useAtomValue, useSetAtom } from "jotai";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useImmerReducer } from "use-immer";
import Header from "@/components/header";
import Tooltip from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { DEFAULT_DICT_ID } from "@/constants";
import {
  currentChapterAtom,
  currentDictIdAtom,
  customDictionariesAtom,
  isReviewModeAtom,
  randomConfigAtom,
  reviewModeInfoAtom,
  timedPracticeConfigAtom,
} from "@/store";
import { useSaveChapterRecord } from "@/utils/db";
import { isKnownDictionaryId } from "@/utils/dictionary-lookup";
import { useMixPanelChapterLogUploader } from "@/utils/mixpanel";
import Layout from "../../components/layout";
import { DictChapterButton } from "./components/dict-chapter-button";
import PronunciationSwitcher from "./components/pronunciation-switcher";
import ResultScreen from "./components/result-screen";
import Speed from "./components/speed";
import StartButton from "./components/start-button";
import Switcher from "./components/switcher";
import TodayPanel from "./components/today-panel";
import WordList from "./components/word-list";
import WordPanel from "./components/word-panel";
import { useConfetti } from "./hooks/use-confetti";
import { useWordList } from "./hooks/use-word-list";
import {
  initialState,
  TypingContext,
  TypingStateActionType,
  typingReducer,
} from "./store";

const App: React.FC = () => {
  const [state, dispatch] = useImmerReducer(
    typingReducer,
    structuredClone(initialState)
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { words } = useWordList();
  const hasSavedChapterRef = useRef(false);

  const [currentDictId, setCurrentDictId] = useAtom(currentDictIdAtom);
  const customDictionaries = useAtomValue(customDictionariesAtom);
  const setCurrentChapter = useSetAtom(currentChapterAtom);
  const randomConfig = useAtomValue(randomConfigAtom);
  const chapterLogUploader = useMixPanelChapterLogUploader(state);
  const saveChapterRecord = useSaveChapterRecord();

  const reviewModeInfo = useAtomValue(reviewModeInfoAtom);
  const isReviewMode = useAtomValue(isReviewModeAtom);
  const timedPracticeConfig = useAtomValue(timedPracticeConfigAtom);
  const timedLimitSeconds =
    timedPracticeConfig.enabled && timedPracticeConfig.durationMinutes > 0
      ? timedPracticeConfig.durationMinutes * 60
      : undefined;

  useEffect(() => {
    const id = currentDictId;
    if (!isKnownDictionaryId(id, customDictionaries)) {
      setCurrentDictId(DEFAULT_DICT_ID);
      setCurrentChapter(0);
    }
  }, [currentDictId, customDictionaries, setCurrentChapter, setCurrentDictId]);

  const skipWord = useCallback(() => {
    dispatch({ type: TypingStateActionType.SKIP_WORD });
  }, [dispatch]);

  useEffect(() => {
    const onBlur = () => {
      dispatch({ payload: false, type: TypingStateActionType.SET_IS_TYPING });
    };
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("blur", onBlur);
    };
  }, [dispatch]);

  useEffect(() => {
    state.chapterData.words?.length > 0
      ? setIsLoading(false)
      : setIsLoading(true);
  }, [state.chapterData.words]);

  const isFinishedRef = useRef(state.isFinished);
  // Writing a ref during render is unsafe (React Compiler rejects it
  // outright); sync it in an effect declared before the one that reads it,
  // so it's still up to date by the time that effect runs in the same
  // commit.
  useEffect(() => {
    isFinishedRef.current = state.isFinished;
  }, [state.isFinished]);

  useEffect(() => {
    // Keep the result screen mounted: SWR/word-list identity changes must not
    // reset typing state while a chapter is finished. Read isFinished via a
    // ref (not as a dependency) so that Repeat/Next/Dictate flipping it back
    // to false doesn't re-trigger this effect and clobber the reducer's own
    // chapter transition.
    if (isFinishedRef.current) {
      return;
    }

    const initialIndex =
      isReviewMode && reviewModeInfo?.reviewRecord?.index
        ? reviewModeInfo.reviewRecord.index
        : 0;

    dispatch({
      payload: { initialIndex, shouldShuffle: randomConfig.isOpen, words },
      type: TypingStateActionType.SETUP_CHAPTER,
    });
  }, [
    words,
    isReviewMode,
    reviewModeInfo.reviewRecord?.index,
    dispatch,
    randomConfig.isOpen,
  ]);

  useEffect(() => {
    if (!state.isFinished) {
      hasSavedChapterRef.current = false;
      return;
    }
    if (state.isSavingRecord || hasSavedChapterRef.current) {
      return;
    }
    hasSavedChapterRef.current = true;
    chapterLogUploader();
    saveChapterRecord(state);
  }, [
    state.isFinished,
    state.isSavingRecord,
    state,
    saveChapterRecord,
    chapterLogUploader,
  ]);

  useEffect(() => {
    let intervalId: number;
    if (state.isTyping) {
      intervalId = window.setInterval(() => {
        dispatch({
          timeLimit: timedLimitSeconds,
          type: TypingStateActionType.TICK_TIMER,
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [state.isTyping, dispatch, timedLimitSeconds]);

  useConfetti(state.isFinished);

  return (
    <TypingContext.Provider value={{ dispatch, state }}>
      {state.isFinished && <ResultScreen />}
      <Layout>
        <Header>
          <div
            aria-label="Dictionary and chapter"
            className="inline-flex flex-wrap items-center justify-center gap-1 sm:gap-1.5"
            role="group"
          >
            <DictChapterButton />
            <PronunciationSwitcher />
          </div>
          <span aria-hidden className="toolbar-divider" />
          <Switcher />
          <span aria-hidden className="toolbar-divider" />
          <div
            aria-label="Session controls"
            className="inline-flex flex-wrap items-center justify-center gap-1.5"
            role="group"
          >
            <StartButton isLoading={isLoading} />
            <Tooltip content="Skip this word">
              <Button
                aria-hidden={!state.isShowSkip}
                aria-label="Skip this word"
                className={
                  state.isShowSkip
                    ? "h-11 min-w-[3.5rem] px-3 text-sm sm:h-8 sm:text-lg"
                    : "invisible h-11 w-0 min-w-0 px-0 opacity-0 sm:h-8"
                }
                disabled={!state.isShowSkip}
                onClick={skipWord}
                tabIndex={state.isShowSkip ? 0 : -1}
                type="button"
                variant="warning"
              >
                Skip
              </Button>
            </Tooltip>
          </div>
        </Header>
        <div className="container mx-auto flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center gap-3 px-3 pb-3 sm:gap-4 sm:px-4 sm:pb-5">
          <div className="container relative mx-auto flex h-full min-h-0 w-full max-w-4xl flex-col items-center">
            <div className="container flex min-h-0 grow items-center justify-center px-2 sm:px-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                  <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent border-solid align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  >
                    <span className="sr-only">Loading…</span>
                  </div>
                </div>
              ) : (
                !state.isFinished && <WordPanel />
              )}
            </div>
            {!state.isFinished && <TodayPanel />}
            <Speed />
          </div>
        </div>
      </Layout>
      <WordList />
    </TypingContext.Provider>
  );
};

export default App;
