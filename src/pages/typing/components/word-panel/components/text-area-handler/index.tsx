import type { FormEvent } from "react";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { TypingStateActionType, useTypingContext } from "@/pages/typing/store";
import { isLegal } from "@/utils";
import type { WordUpdateAction } from "../input-handler";

export default function TextAreaHandler({
  updateInput,
}: {
  updateInput: (updateObj: WordUpdateAction) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { state, dispatch } = useTypingContext();

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

  // When paused, the textarea is blurred so the first physical key never
  // reaches onInput. Capture that keystroke here and both start + type.
  useEffect(() => {
    if (state.isTyping) {
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Enter" ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        e.repeat ||
        !isLegal(e.key) ||
        state.chapterData.words.length === 0
      ) {
        return;
      }

      e.preventDefault();
      dispatch({
        payload: true,
        type: TypingStateActionType.SET_IS_TYPING,
      });

      if (e.key.length === 1) {
        updateInput({ event: e, type: "add", value: e.key });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dispatch, state.chapterData.words.length, state.isTyping, updateInput]);

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
