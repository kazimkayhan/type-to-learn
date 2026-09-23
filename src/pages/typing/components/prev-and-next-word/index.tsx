import { useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import Tooltip from "@/components/tooltip";
import { currentDictInfoAtom, wordDictationConfigAtom } from "@/store";
import { CTRL } from "@/utils";
import IconPrev from "~icons/tabler/arrow-narrow-left";
import IconNext from "~icons/tabler/arrow-narrow-right";
import { TypingStateActionType, useTypingContext } from "../../store";

export default function PrevAndNextWord({ type }: LastAndNextWordProps) {
  const { state, dispatch } = useTypingContext();

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
          <button
            aria-label={`${type === "prev" ? "Previous" : "Next"} word${headWord ? `: ${headWord}` : ""}`}
            className="flex max-h-16 max-w-[38vw] cursor-pointer select-none items-center overflow-hidden text-foreground opacity-60 duration-200 ease-in-out hover:opacity-100 sm:max-w-xs"
            onClick={onClickWord}
            type="button"
          >
            {type === "prev" && (
              <IconPrev className="mr-4 shrink-0 grow-0 text-2xl" />
            )}

            <div
              className={`flex w-full grow-1 flex-col ${type === "next" ? "items-end text-right" : ""}`}
            >
              <p
                className={`font-mono font-normal text-base text-foreground sm:text-2xl ${
                  wordDictationConfig.isOpen
                    ? "tracking-wider"
                    : "tracking-normal"
                }`}
              >
                {headWord}
              </p>
              {Boolean(state.isTransVisible) && (
                <p className="mt-0.5 hidden max-w-full truncate font-normal text-muted-foreground text-sm sm:block">
                  {word.trans.join("; ")}
                </p>
              )}
            </div>
            {type === "next" && (
              <IconNext className="ml-4 shrink-0 grow-0 text-2xl" />
            )}
          </button>
        </Tooltip>
      ) : (
        <div />
      )}
    </>
  );
}

export interface LastAndNextWordProps {
  /** 上一个单词还是下一个单词 */
  type: "prev" | "next";
}
