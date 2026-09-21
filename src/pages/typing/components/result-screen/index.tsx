import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router-dom";
import Tooltip from "@/components/tooltip";
import { SITE } from "@/constants";
import {
  currentChapterAtom,
  currentDictInfoAtom,
  isReviewModeAtom,
  randomConfigAtom,
  reviewModeInfoAtom,
  wordDictationConfigAtom,
} from "@/store";
import IexportWords from "~icons/icon-park-outline/excel";
import IconGithub from "~icons/simple-icons/github";
import IconX from "~icons/tabler/x";
import { TypingStateActionType, useTypingContext } from "../../store";
import ShareButton from "../share-button";
import { AuthorButton } from "./author-button";
import ConclusionBar from "./conclusion-bar";
import RemarkRing from "./remark-ring";
import WordChip from "./word-chip";

const ResultScreen = () => {
  const { state, dispatch } = useTypingContext();

  const setWordDictationConfig = useSetAtom(wordDictationConfigAtom);
  const currentDictInfo = useAtomValue(currentDictInfoAtom);
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom);
  const randomConfig = useAtomValue(randomConfigAtom);
  const navigate = useNavigate();

  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom);
  const isReviewMode = useAtomValue(isReviewModeAtom);

  useEffect(() => {
    // tick a zero timer to calc the stats
    dispatch({ addTime: 0, type: TypingStateActionType.TICK_TIMER });
  }, [dispatch]);

  const exportWords = useCallback(() => {
    const { words, userInputLogs } = state.chapterData;
    const exportData = userInputLogs.map((log) => {
      const word = words[log.index];
      const wordName = word.name;
      return {
        ...word,
        correctCount: log.correctCount,
        trans: word.trans.join(";"),
        wrongCount: log.wrongCount,
        wrongLetters: Object.entries(log.LetterMistakes)
          .map(
            ([key, mistakes]) => `${wordName[Number(key)]}:${mistakes.length}`
          )
          .join(";"),
      };
    });

    import("xlsx")
      .then(({ utils, writeFileXLSX }) => {
        const ws = utils.json_to_sheet(exportData);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Data");
        writeFileXLSX(
          wb,
          `${currentDictInfo.name} Chapter ${currentChapter + 1}.xlsx`
        );
      })
      .catch(() => {
        console.log("Failed to import xlsx module");
      });
  }, [currentChapter, currentDictInfo.name, state.chapterData]);

  const wrongWords = useMemo(
    () =>
      state.chapterData.userInputLogs
        .filter((log) => log.wrongCount > 0)
        .map((log) => state.chapterData.words[log.index])
        .filter((word) => word !== undefined),
    [state.chapterData.userInputLogs, state.chapterData.words]
  );

  const isLastChapter = useMemo(
    () => currentChapter >= currentDictInfo.chapterCount - 1,
    [currentChapter, currentDictInfo]
  );

  const correctRate = useMemo(() => {
    const chapterLength = state.chapterData.words.length;
    const correctCount = chapterLength - wrongWords.length;
    return Math.floor((correctCount / chapterLength) * 100);
  }, [state.chapterData.words.length, wrongWords.length]);

  const mistakeLevel = useMemo(() => {
    if (correctRate >= 85) {
      return 0;
    }
    if (correctRate >= 70) {
      return 1;
    }
    return 2;
  }, [correctRate]);

  const timeString = useMemo(() => {
    const seconds = state.timerData.time;
    const minutes = Math.floor(seconds / 60);
    const minuteString = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const restSeconds = seconds % 60;
    const secondString =
      restSeconds < 10 ? `0${restSeconds}` : `${restSeconds}`;
    return `${minuteString}:${secondString}`;
  }, [state.timerData.time]);

  const repeatButtonHandler = useCallback(async () => {
    if (isReviewMode) {
      return;
    }

    setWordDictationConfig((old) => {
      if (old.isOpen && old.openBy === "auto") {
        return { ...old, isOpen: false };
      }
      return old;
    });
    dispatch({
      shouldShuffle: randomConfig.isOpen,
      type: TypingStateActionType.REPEAT_CHAPTER,
    });
  }, [isReviewMode, setWordDictationConfig, dispatch, randomConfig.isOpen]);

  const dictationButtonHandler = useCallback(async () => {
    if (isReviewMode) {
      return;
    }

    setWordDictationConfig((old) => ({ ...old, isOpen: true, openBy: "auto" }));
    dispatch({
      shouldShuffle: randomConfig.isOpen,
      type: TypingStateActionType.REPEAT_CHAPTER,
    });
  }, [isReviewMode, setWordDictationConfig, dispatch, randomConfig.isOpen]);

  const nextButtonHandler = useCallback(() => {
    if (isReviewMode) {
      return;
    }

    setWordDictationConfig((old) => {
      if (old.isOpen && old.openBy === "auto") {
        return { ...old, isOpen: false };
      }
      return old;
    });
    if (!isLastChapter) {
      setCurrentChapter((old) => old + 1);
      dispatch({ type: TypingStateActionType.NEXT_CHAPTER });
    }
  }, [
    dispatch,
    isLastChapter,
    isReviewMode,
    setCurrentChapter,
    setWordDictationConfig,
  ]);

  const exitButtonHandler = useCallback(() => {
    if (isReviewMode) {
      setCurrentChapter(0);
      setReviewModeInfo((old) => ({ ...old, isReviewMode: false }));
    } else {
      dispatch({
        shouldShuffle: false,
        type: TypingStateActionType.REPEAT_CHAPTER,
      });
    }
  }, [dispatch, isReviewMode, setCurrentChapter, setReviewModeInfo]);

  const onNavigateToGallery = useCallback(() => {
    setCurrentChapter(0);
    setReviewModeInfo((old) => ({ ...old, isReviewMode: false }));
    navigate("/gallery");
  }, [navigate, setCurrentChapter, setReviewModeInfo]);

  useHotkeys(
    "enter",
    () => {
      nextButtonHandler();
    },
    { preventDefault: true }
  );

  useHotkeys(
    "space",
    (e) => {
      // 火狐浏览器的阻止事件无效，会导致按空格键后 再次输入正确的第一个字母会报错
      e.stopPropagation();
      repeatButtonHandler();
    },
    { preventDefault: true }
  );

  useHotkeys(
    "shift+enter",
    () => {
      dictationButtonHandler();
    },
    { preventDefault: true }
  );

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto">
      <div className="absolute inset-0 bg-gray-300 opacity-80 dark:bg-gray-600" />
      <div className="flex min-h-dvh items-center justify-center p-3 sm:p-4">
        <div className="relative my-card flex max-h-[92dvh] w-[min(90vw,72rem)] max-w-6xl flex-col overflow-y-auto rounded-3xl bg-white px-4 pt-8 pb-8 shadow-lg sm:pt-10 sm:pr-5 sm:pb-14 sm:pl-10 md:w-4/5 lg:w-3/5 dark:bg-gray-800">
          <div className="text-center font-normal font-sans text-gray-900 text-xl md:text-2xl dark:text-gray-400">
            {`${currentDictInfo.name} ${isReviewMode ? "Error Review" : `Chapter ${currentChapter + 1}`}`}
          </div>
          <button
            aria-label="Close result"
            className="absolute top-5 right-7 rounded p-1 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-indigo-400 dark:hover:bg-gray-700"
            onClick={exitButtonHandler}
            type="button"
          >
            <IconX className="text-gray-400" />
          </button>
          <div className="mt-6 flex flex-col gap-4 overflow-hidden sm:mt-10 sm:flex-row sm:gap-2">
            <div className="flex flex-shrink-0 flex-grow-0 flex-row justify-center gap-3 px-2 sm:flex-col sm:px-4 md:px-2 lg:px-4">
              <RemarkRing
                caption="Accuracy"
                percentage={state.timerData.accuracy}
                remark={`${state.timerData.accuracy}%`}
              />
              <RemarkRing caption="Chapter time" remark={timeString} />
              <RemarkRing caption="WPM" remark={`${state.timerData.wpm}`} />
            </div>
            <div className="z-10 flex-1 overflow-visible rounded-xl bg-indigo-50 sm:ml-6 dark:bg-gray-700">
              <div className="customized-scrollbar z-20 mr-1 ml-3 flex max-h-56 flex-row flex-wrap content-start gap-3 overflow-y-auto overflow-x-hidden pt-6 pr-4 sm:ml-8 sm:h-80 sm:max-h-none sm:gap-4 sm:pt-9 sm:pr-7">
                {wrongWords.map((word, index) => (
                  <WordChip key={`${index}-${word.name}`} word={word} />
                ))}
              </div>
              <div className="flex w-full flex-row items-center justify-start rounded-b-xl bg-indigo-200 px-4 dark:bg-indigo-400">
                <ConclusionBar
                  mistakeCount={wrongWords.length}
                  mistakeLevel={mistakeLevel}
                />
              </div>
            </div>
            <div className="mt-2 flex flex-row flex-wrap items-center justify-center gap-3 text-xl sm:mt-0 sm:ml-2 sm:flex-col sm:items-center sm:justify-end">
              <AuthorButton />
              {!isReviewMode && (
                <>
                  <ShareButton />
                  <button
                    aria-label="Export chapter words to Excel"
                    className="rounded p-1 text-gray-500 hover:text-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400"
                    onClick={exportWords}
                    type="button"
                  >
                    <IexportWords fontSize={18} />
                  </button>
                </>
              )}
              <a
                aria-label="GitHub"
                className="leading-[0px]"
                href={SITE.github}
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconGithub
                  className="text-gray-500 hover:text-green-800 focus:outline-none"
                  fontSize={16}
                />
              </a>
            </div>
          </div>
          <div className="mt-6 flex w-full flex-col justify-center gap-3 px-2 text-xl sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-5 sm:px-5">
            {!isReviewMode && (
              <>
                <Tooltip content="Shortcut: shift + enter">
                  <button
                    className="my-btn-primary h-12 w-full border-2 border-gray-300 border-solid bg-white text-base text-gray-700 sm:w-auto dark:border-gray-700 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
                    onClick={dictationButtonHandler}
                    title="Dictate this chapter"
                    type="button"
                  >
                    Dictate this chapter
                  </button>
                </Tooltip>
                <Tooltip content="Shortcut: space">
                  <button
                    className="my-btn-primary h-12 w-full border-2 border-gray-300 border-solid bg-white text-base text-gray-700 sm:w-auto dark:border-gray-700 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
                    onClick={repeatButtonHandler}
                    title="Repeat this chapter"
                    type="button"
                  >
                    Repeat this chapter
                  </button>
                </Tooltip>
              </>
            )}
            {!(isLastChapter || isReviewMode) && (
              <Tooltip content="Shortcut: enter">
                <button
                  className={
                    "my-btn-primary h-12 w-full font-bold text-base sm:w-auto"
                  }
                  onClick={nextButtonHandler}
                  title="Next chapter"
                  type="button"
                >
                  Next chapter
                </button>
              </Tooltip>
            )}

            {Boolean(isReviewMode) && (
              <button
                className="my-btn-primary h-12 w-full font-bold text-base sm:w-auto"
                onClick={onNavigateToGallery}
                title="Practice other chapters"
                type="button"
              >
                Practice other chapters
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
