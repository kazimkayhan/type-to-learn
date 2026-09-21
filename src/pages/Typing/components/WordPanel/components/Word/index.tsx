import { useAtomValue } from "jotai";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useImmer } from "use-immer";
import Tooltip from "@/components/Tooltip";
import type { WordPronunciationIconRef } from "@/components/WordPronunciationIcon";
import { WordPronunciationIcon } from "@/components/WordPronunciationIcon";
import { EXPLICIT_SPACE } from "@/constants";
import useKeySounds from "@/hooks/useKeySounds";
import { TypingContext, TypingStateActionType } from "@/pages/Typing/store";
import {
  currentChapterAtom,
  currentDictInfoAtom,
  isIgnoreCaseAtom,
  isShowAnswerOnHoverAtom,
  isTextSelectableAtom,
  pronunciationIsOpenAtom,
  wordDictationConfigAtom,
} from "@/store";
import type { Word } from "@/typings";
import { CTRL, getUtcStringForMixpanel } from "@/utils";
import { useSaveWordRecord } from "@/utils/db";
import type { WordUpdateAction } from "../InputHandler";
import InputHandler from "../InputHandler";
import style from "./index.module.css";
import Letter from "./Letter";
import Notation from "./Notation";
import { TipAlert } from "./TipAlert";
import type { WordState } from "./type";
import { initialWordState } from "./type";

const vowelLetters = ["A", "E", "I", "O", "U"];

export default function WordComponent({
  word,
  onFinish,
}: {
  word: Word;
  onFinish: () => void;
}) {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state, dispatch } = useContext(TypingContext)!;
  const [wordState, setWordState] = useImmer<WordState>(
    structuredClone(initialWordState)
  );

  const wordDictationConfig = useAtomValue(wordDictationConfigAtom);
  const isTextSelectable = useAtomValue(isTextSelectableAtom);
  const isIgnoreCase = useAtomValue(isIgnoreCaseAtom);
  const isShowAnswerOnHover = useAtomValue(isShowAnswerOnHoverAtom);
  const saveWordRecord = useSaveWordRecord();
  // const wordLogUploader = useMixPanelWordLogUploader(state)
  const [playKeySound, playBeepSound, playHintSound] = useKeySounds();
  const pronunciationIsOpen = useAtomValue(pronunciationIsOpenAtom);
  const [isHoveringWord, setIsHoveringWord] = useState(false);
  const currentLanguage = useAtomValue(currentDictInfoAtom).language;
  const currentLanguageCategory =
    useAtomValue(currentDictInfoAtom).languageCategory;
  const currentChapter = useAtomValue(currentChapterAtom);

  const [showTipAlert, setShowTipAlert] = useState(false);
  const wordPronunciationIconRef = useRef<WordPronunciationIconRef>(null);

  useEffect(() => {
    // run only when word changes
    let headword = "";
    try {
      headword = word.name.replace(/ /g, EXPLICIT_SPACE);
      headword = headword.replace(/…/g, "..");
    } catch (e) {
      console.error("word.name is not a string", word);
      headword = "";
    }

    const newWordState = structuredClone(initialWordState);
    newWordState.displayWord = headword;
    newWordState.letterStates = new Array(headword.length).fill("normal");
    newWordState.startTime = getUtcStringForMixpanel();
    newWordState.randomLetterVisible = headword
      .split("")
      .map(() => Math.random() > 0.4);
    setWordState(newWordState);
  }, [word, setWordState]);

  const updateInput = useCallback(
    (updateAction: WordUpdateAction) => {
      switch (updateAction.type) {
        case "add":
          if (wordState.hasWrong) {
            return;
          }

          if (updateAction.value === " ") {
            updateAction.event.preventDefault();
            setWordState((state) => {
              state.inputWord = state.inputWord + EXPLICIT_SPACE;
            });
          } else {
            setWordState((state) => {
              state.inputWord = state.inputWord + updateAction.value;
            });
          }
          break;

        default:
          console.warn("unknown update type", updateAction);
      }
    },
    [wordState.hasWrong, setWordState]
  );

  const handleHoverWord = useCallback((checked: boolean) => {
    setIsHoveringWord(checked);
  }, []);

  useHotkeys(
    "tab",
    () => {
      handleHoverWord(true);
    },
    { enableOnFormTags: true, preventDefault: true },
    []
  );

  useHotkeys(
    "tab",
    () => {
      handleHoverWord(false);
    },
    { enableOnFormTags: true, keyup: true, preventDefault: true },
    []
  );
  useHotkeys(
    "ctrl+j",
    () => {
      if (state.isTyping) {
        wordPronunciationIconRef.current?.play();
      }
    },
    [state.isTyping],
    { enableOnFormTags: true, preventDefault: true }
  );

  useEffect(() => {
    if (wordState.inputWord.length === 0 && state.isTyping) {
      wordPronunciationIconRef.current?.play &&
        wordPronunciationIconRef.current?.play();
    }
  }, [
    state.isTyping,
    wordState.inputWord.length,
    wordPronunciationIconRef.current?.play,
  ]);

  const getLetterVisible = useCallback(
    (index: number) => {
      if (
        wordState.letterStates[index] === "correct" ||
        (isShowAnswerOnHover && isHoveringWord)
      ) {
        return true;
      }

      if (wordDictationConfig.isOpen) {
        if (wordDictationConfig.type === "hideAll") {
          return false;
        }

        const letter = wordState.displayWord[index];
        if (wordDictationConfig.type === "hideVowel") {
          return vowelLetters.includes(letter.toUpperCase()) ? false : true;
        }
        if (wordDictationConfig.type === "hideConsonant") {
          return vowelLetters.includes(letter.toUpperCase()) ? true : false;
        }
        if (wordDictationConfig.type === "randomHide") {
          return wordState.randomLetterVisible[index];
        }
      }
      return true;
    },
    [
      isHoveringWord,
      isShowAnswerOnHover,
      wordDictationConfig.isOpen,
      wordDictationConfig.type,
      wordState.displayWord,
      wordState.letterStates,
      wordState.randomLetterVisible,
    ]
  );

  useEffect(() => {
    const inputLength = wordState.inputWord.length;
    /**
     * TODO: 当用户输入错误时，会报错
     * Cannot update a component (`App`) while rendering a different component (`WordComponent`). To locate the bad setState() call inside `WordComponent`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render
     * 目前不影响生产环境，猜测是因为开发环境下 react 会两次调用 useEffect 从而展示了这个 warning
     * 但这终究是一个 bug，需要修复
     */
    if (
      wordState.hasWrong ||
      inputLength === 0 ||
      wordState.displayWord.length === 0
    ) {
      return;
    }

    const inputChar = wordState.inputWord[inputLength - 1];
    const correctChar = wordState.displayWord[inputLength - 1];
    let isEqual = false;
    if (inputChar != undefined && correctChar != undefined) {
      isEqual = isIgnoreCase
        ? inputChar.toLowerCase() === correctChar.toLowerCase()
        : inputChar === correctChar;
    }

    if (isEqual) {
      // 输入正确时
      setWordState((state) => {
        state.letterTimeArray.push(Date.now());
        state.correctCount += 1;
      });

      if (inputLength >= wordState.displayWord.length) {
        // 完成输入时
        setWordState((state) => {
          state.letterStates[inputLength - 1] = "correct";
          state.isFinished = true;
          state.endTime = getUtcStringForMixpanel();
        });
        playHintSound();
      } else {
        setWordState((state) => {
          state.letterStates[inputLength - 1] = "correct";
        });
        playKeySound();
      }

      dispatch({ type: TypingStateActionType.REPORT_CORRECT_WORD });
    } else {
      // 出错时
      playBeepSound();
      setWordState((state) => {
        state.letterStates[inputLength - 1] = "wrong";
        state.hasWrong = true;
        state.hasMadeInputWrong = true;
        state.wrongCount += 1;
        state.letterTimeArray = [];

        if (state.letterMistake[inputLength - 1]) {
          state.letterMistake[inputLength - 1].push(inputChar);
        } else {
          state.letterMistake[inputLength - 1] = [inputChar];
        }

        const currentState = JSON.parse(JSON.stringify(state));
        dispatch({
          payload: { letterMistake: currentState.letterMistake },
          type: TypingStateActionType.REPORT_WRONG_WORD,
        });
      });

      if (
        currentChapter === 0 &&
        state.chapterData.index === 0 &&
        wordState.wrongCount >= 3
      ) {
        setShowTipAlert(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordState.inputWord]);

  useEffect(() => {
    if (wordState.hasWrong) {
      const timer = setTimeout(() => {
        setWordState((state) => {
          state.inputWord = "";
          state.letterStates = new Array(state.letterStates.length).fill(
            "normal"
          );
          state.hasWrong = false;
        });
      }, 300);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [wordState.hasWrong, setWordState]);

  useEffect(() => {
    if (wordState.isFinished) {
      dispatch({
        payload: true,
        type: TypingStateActionType.SET_IS_SAVING_RECORD,
      });

      // wordLogUploader({
      //   headword: word.name,
      //   timeStart: wordState.startTime,
      //   timeEnd: wordState.endTime,
      //   countInput: wordState.correctCount + wordState.wrongCount,
      //   countCorrect: wordState.correctCount,
      //   countTypo: wordState.wrongCount,
      // })
      saveWordRecord({
        letterMistake: wordState.letterMistake,
        letterTimeArray: wordState.letterTimeArray,
        word: word.name,
        wrongCount: wordState.wrongCount,
      });

      onFinish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordState.isFinished]);

  useEffect(() => {
    if (wordState.wrongCount >= 4) {
      dispatch({ payload: true, type: TypingStateActionType.SET_IS_SKIP });
    }
  }, [wordState.wrongCount, dispatch]);

  return (
    <>
      <div
        className="flex flex-col items-center justify-center pt-4 pb-1"
        lang={
          currentLanguageCategory === "code" ? "en" : currentLanguageCategory
        }
      >
        {["romaji", "hapin"].includes(currentLanguage) && word.notation && (
          <Notation notation={word.notation} />
        )}
        <div
          className={`tooltip-info relative w-fit max-w-full bg-transparent p-0 pr-8 leading-normal shadow-none sm:pr-10 dark:bg-transparent ${
            wordDictationConfig.isOpen ? "tooltip" : ""
          }`}
          data-tip="Press Tab to show the full word"
        >
          <div
            className={`relative flex max-w-full flex-wrap items-center justify-center ${isTextSelectable && "select-all"} ${
              wordState.hasWrong ? style.wrong : ""
            }`}
            onMouseEnter={() => handleHoverWord(true)}
            onMouseLeave={() => handleHoverWord(false)}
          >
            <InputHandler updateInput={updateInput} />
            {wordState.displayWord.split("").map((t, index) => (
              <Letter
                key={`${index}-${t}`}
                letter={t}
                state={wordState.letterStates[index]}
                visible={getLetterVisible(index)}
              />
            ))}
          </div>
          {pronunciationIsOpen && (
            <div className="absolute top-1/2 right-0 h-9 w-9 -translate-y-1/2 transform">
              <Tooltip content={`Shortcut ${CTRL} + J`}>
                <WordPronunciationIcon
                  className="h-full w-full"
                  lang={currentLanguage}
                  ref={wordPronunciationIconRef}
                  word={word}
                />
              </Tooltip>
            </div>
          )}
        </div>
      </div>
      <TipAlert
        className="fixed right-3 bottom-10 left-3 sm:right-3 sm:left-auto"
        setShow={setShowTipAlert}
        show={showTipAlert}
      />
    </>
  );
}
