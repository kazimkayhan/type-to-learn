import type { FormEvent } from "react";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useTypingContext } from "@/pages/typing/store";
import type { WordUpdateAction } from "../input-handler";

export default function TextAreaHandler({
  updateInput,
}: {
  updateInput: (updateObj: WordUpdateAction) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { state } = useTypingContext();

  useEffect(() => {
    if (!textareaRef.current) {
      return;
    }

    if (state.isTyping) {
      textareaRef.current.focus();
    } else {
      textareaRef.current.blur();
    }
  }, [state.isTyping]);

  const onInput = (e: FormEvent<HTMLTextAreaElement>) => {
    const nativeEvent = e.nativeEvent as InputEvent;
    if (!nativeEvent.isComposing && nativeEvent.data !== null) {
      updateInput({ event: e, type: "add", value: nativeEvent.data });

      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
    }
  };

  const onBlur = useCallback(() => {
    if (!textareaRef.current) {
      return;
    }

    if (state.isTyping) {
      textareaRef.current.focus();
    }
  }, [state.isTyping]);

  return (
    <textarea
      aria-label="Type the current word"
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect="off"
      autoFocus
      className="absolute inset-0 z-[1] h-full w-full resize-none overflow-hidden border-0 bg-transparent p-0 caret-transparent opacity-0 focus:outline-none"
      enterKeyHint="done"
      inputMode="text"
      onBlur={onBlur}
      onCompositionStart={() => {
        toast.error("You are using an input method editor. Please disable it.");
      }}
      onInput={onInput}
      ref={textareaRef}
      spellCheck={false}
      style={{ fontSize: 16 }}
    />
  );
}
