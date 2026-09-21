import { useAtomValue } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useImmer } from "use-immer";
import Tooltip from "@/components/tooltip";
import type { WordPronunciationIconRef } from "@/components/word-pronunciation-icon";
import { WordPronunciationIcon } from "@/components/word-pronunciation-icon";
import { EXPLICIT_SPACE } from "@/constants";
import useKeySounds from "@/hooks/use-key-sounds";
import { TypingStateActionType, useTypingContext } from "@/pages/typing/store";
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
import type { WordUpdateAction } from "../input-handler";
import InputHandler from "../input-handler";
import style from "./index.module.css";
import Letter from "./letter";
import Notation from "./notation";
import { TipAlert } from "./tip-alert";
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
  const { state, dispatch } = useTypingContext();
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
  const handledInputLengthRef = useRef(0);

  useEffect(() => {
    // run only when word changes
    let headword = "";
    try {
      headword = word.name.replace(/ /g, EXPLICIT_SPACE);
      headword = headword.replace(/…/g, "..");
    } catch {
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
    handledInputLengthRef.current = 0;
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
            setWordState((draft) => {
              draft.inputWord += EXPLICIT_SPACE;
            });
          } else {
            setWordState((draft) => {
              draft.inputWord += updateAction.value;
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
        wordPronunciationIconRef.current.play();
      }
    },
    [state.isTyping],
    { enableOnFormTags: true, preventDefault: true }
  );

  useEffect(() => {
    if (wordState.inputWord.length === 0 && state.isTyping) {
      wordPronunciationIconRef.current.play();
    }
  }, [state.isTyping, wordState.inputWord.length]);

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
          return !vowelLetters.includes(letter.toUpperCase());
        }
        if (wordDictationConfig.type === "hideConsonant") {
          return !!vowelLetters.includes(letter.toUpperCase());
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
    if (inputLength === 0) {
      handledInputLengthRef.current = 0;
    }

    if (
      wordState.hasWrong ||
      inputLength === 0 ||
      wordState.displayWord.length === 0 ||
      inputLength === handledInputLengthRef.current
    ) {
      return;
    }

    handledInputLengthRef.current = inputLength;

    const inputChar = wordState.inputWord[inputLength - 1];
    const correctChar = wordState.displayWord[inputLength - 1];
    let isEqual = false;
    if (inputChar !== undefined && correctChar !== undefined) {
      isEqual = isIgnoreCase
        ? inputChar.toLowerCase() === correctChar.toLowerCase()
        : inputChar === correctChar;
    }

    if (isEqual) {
      setWordState((draft) => {
        draft.letterTimeArray.push(Date.now());
        draft.correctCount += 1;
        draft.letterStates[inputLength - 1] = "correct";
        if (inputLength >= draft.displayWord.length) {
          draft.isFinished = true;
          draft.endTime = getUtcStringForMixpanel();
        }
      });

      if (inputLength >= wordState.displayWord.length) {
        playHintSound();
      } else {
        playKeySound();
      }

      dispatch({ type: TypingStateActionType.REPORT_CORRECT_WORD });
      return;
    }

    playBeepSound();
    const letterMistake = {
      ...wordState.letterMistake,
      [inputLength - 1]: [
        ...(wordState.letterMistake[inputLength - 1] ?? []),
        inputChar,
      ],
    };

    setWordState((draft) => {
      draft.letterStates[inputLength - 1] = "wrong";
      draft.hasWrong = true;
      draft.hasMadeInputWrong = true;
      draft.wrongCount += 1;
      draft.letterTimeArray = [];
      draft.letterMistake = letterMistake;
    });

    dispatch({
      payload: { letterMistake },
      type: TypingStateActionType.REPORT_WRONG_WORD,
    });

    if (
      currentChapter === 0 &&
      state.chapterData.index === 0 &&
      wordState.wrongCount >= 3
    ) {
      setShowTipAlert(true);
    }
  }, [
    wordState.inputWord,
    wordState.displayWord,
    wordState.hasWrong,
    wordState.wrongCount,
    playKeySound,
    playBeepSound,
    playHintSound,
    currentChapter,
    setWordState,
    isIgnoreCase,
    dispatch,
    state.chapterData.index,
  ]);

  useEffect(() => {
    if (wordState.hasWrong) {
      const timer = setTimeout(() => {
        setWordState((draft) => {
          draft.inputWord = "";
          draft.letterStates = new Array(draft.letterStates.length).fill(
            "normal"
          );
          draft.hasWrong = false;
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
  }, [
    wordState.isFinished,
    wordState.letterMistake,
    word.name, // wordLogUploader({
    //   headword: word.name,
    //   timeStart: wordState.startTime,
    //   timeEnd: wordState.endTime,
    //   countInput: wordState.correctCount + wordState.wrongCount,
    //   countCorrect: wordState.correctCount,
    //   countTypo: wordState.wrongCount,
    // })
    saveWordRecord,
    onFinish,
    wordState.wrongCount,
    wordState.letterTimeArray,
    dispatch,
  ]);

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
          {Boolean(pronunciationIsOpen) && (
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
