import { useAtomValue } from "jotai";
import { useCallback, useContext, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import { currentDictInfoAtom, wordDictationConfigAtom } from "@/store";
import { CTRL } from "@/utils";
import IconPrev from "~icons/tabler/arrow-narrow-left";
import IconNext from "~icons/tabler/arrow-narrow-right";
import { TypingContext, TypingStateActionType } from "../../store";

export default function PrevAndNextWord({ type }: LastAndNextWordProps) {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state, dispatch } = useContext(TypingContext)!;

  const wordDictationConfig = useAtomValue(wordDictationConfigAtom);
  const newIndex = useMemo(
    () => state.chapterData.index + (type === "prev" ? -1 : 1),
    [state.chapterData.index, type]
  );
  const word = state.chapterData.words[newIndex];
  const shortCutKey = useMemo(
    () =>
      type === "prev"
        ? `${CTRL} + Shift + ArrowLeft`
        : `${CTRL} + Shift + ArrowRight`,
    [type]
  );
  const currentLanguage = useAtomValue(currentDictInfoAtom).language;

  const onClickWord = useCallback(() => {
    if (!word) {
      return;
    }

    if (type === "prev") {
      dispatch({ newIndex, type: TypingStateActionType.SKIP_2_WORD_INDEX });
    }
    if (type === "next") {
      dispatch({ newIndex, type: TypingStateActionType.SKIP_2_WORD_INDEX });
    }
  }, [type, dispatch, newIndex, word]);

  const headWord = useMemo(() => {
    if (!word) {
      return "";
    }

    const showWord = ["romaji", "hapin"].includes(currentLanguage)
      ? word.notation
      : word.name;

    if (type === "prev") {
      return showWord;
    }

    if (type === "next") {
      return wordDictationConfig.isOpen
        ? (showWord || "").replace(/./g, "_")
        : showWord;
    }
  }, [word, currentLanguage, type, wordDictationConfig.isOpen]);

  return (
    <>
      {word ? (
        <Tooltip content={`Shortcut: ${shortCutKey}`}>
          <div
            className="flex max-w-[42vw] cursor-pointer select-none items-center text-gray-700 opacity-60 duration-200 ease-in-out hover:opacity-100 sm:max-w-xs dark:text-gray-400"
            onClick={onClickWord}
          >
            {type === "prev" && (
              <IconPrev className="mr-4 shrink-0 grow-0 text-2xl" />
            )}

            <div
              className={`flex w-full grow-1 flex-col ${type === "next" ? "items-end text-right" : ""}`}
            >
              <p
                className={`font-mono font-normal text-base text-gray-700 sm:text-2xl dark:text-gray-400 ${
                  wordDictationConfig.isOpen
                    ? "tracking-wider"
                    : "tracking-normal"
                }`}
              >
                {headWord}
              </p>
              {state.isTransVisible && (
                <p className="line-clamp-1 hidden max-w-full font-normal text-gray-600 text-sm sm:block dark:text-gray-500">
                  {word.trans.join("; ")}
                </p>
              )}
            </div>
            {type === "next" && (
              <IconNext className="ml-4 shrink-0 grow-0 text-2xl" />
            )}
          </div>
        </Tooltip>
      ) : (
        <div />
      )}
    </>
  );
}

export type LastAndNextWordProps = {
  /** 上一个单词还是下一个单词 */
  type: "prev" | "next";
};
