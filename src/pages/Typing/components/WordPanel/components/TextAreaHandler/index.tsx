import type { FormEvent } from "react";
import { useCallback, useContext, useEffect, useRef } from "react";
import { TypingContext } from "@/pages/Typing/store";
import type { WordUpdateAction } from "../InputHandler";

export default function TextAreaHandler({
  updateInput,
}: {
  updateInput: (updateObj: WordUpdateAction) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state } = useContext(TypingContext)!;

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
        alert("You are using an input method editor. Please disable it.");
      }}
      onInput={onInput}
      ref={textareaRef}
      spellCheck={false}
      style={{ fontSize: 16 }}
    />
  );
}
