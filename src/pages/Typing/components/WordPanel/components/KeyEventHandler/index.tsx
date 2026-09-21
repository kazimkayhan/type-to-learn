import { useCallback, useContext, useEffect } from "react";
import { TypingContext } from "@/pages/Typing/store";
import { isChineseSymbol, isLegal } from "@/utils";
import type { WordUpdateAction } from "../InputHandler";

export default function KeyEventHandler({
  updateInput,
}: {
  updateInput: (updateObj: WordUpdateAction) => void;
}) {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state } = useContext(TypingContext)!;

  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      const char = e.key;

      if (isChineseSymbol(char)) {
        alert("You are using an input method editor. Please disable it.");
        return;
      }

      if (isLegal(char) && !e.altKey && !e.ctrlKey && !e.metaKey) {
        updateInput({ event: e, type: "add", value: char });
      }
    },
    [updateInput]
  );

  useEffect(() => {
    if (!state.isTyping) {
      return;
    }

    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, [onKeydown, state.isTyping]);

  return <></>;
}
