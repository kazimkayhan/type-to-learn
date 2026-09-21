import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTypingContext } from "@/pages/typing/store";
import { isChineseSymbol, isLegal } from "@/utils";
import type { WordUpdateAction } from "../input-handler";

export default function KeyEventHandler({
  updateInput,
}: {
  updateInput: (updateObj: WordUpdateAction) => void;
}) {
  const { state } = useTypingContext();

  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      const char = e.key;

      if (isChineseSymbol(char)) {
        toast.error("You are using an input method editor. Please disable it.");
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

  return null;
}
