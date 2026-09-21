import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { TypingStateActionType, useTypingContext } from "@/pages/typing/store";
import { isChineseSymbol, isLegal } from "@/utils";
import type { WordUpdateAction } from "../input-handler";

export default function KeyEventHandler({
  updateInput,
}: {
  updateInput: (updateObj: WordUpdateAction) => void;
}) {
  const { state, dispatch } = useTypingContext();

  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      const char = e.key;

      if (isChineseSymbol(char)) {
        toast.error("You are using an input method editor. Please disable it.");
        return;
      }

      if (
        !(isLegal(char) && !e.altKey && !e.ctrlKey && !e.metaKey && !e.repeat)
      ) {
        return;
      }

      if (state.chapterData.words.length === 0) {
        return;
      }

      e.preventDefault();

      // Start typing and apply this key in the same event so the first
      // keystroke is not lost (previously only SET_IS_TYPING ran).
      if (!state.isTyping) {
        dispatch({
          payload: true,
          type: TypingStateActionType.SET_IS_TYPING,
        });
      }

      updateInput({ event: e, type: "add", value: char });
    },
    [dispatch, state.chapterData.words.length, state.isTyping, updateInput]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, [onKeydown]);

  return null;
}
