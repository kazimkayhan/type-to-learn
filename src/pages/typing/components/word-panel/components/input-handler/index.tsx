import { useAtomValue } from "jotai";
import type { FormEvent } from "react";
import { useMemo } from "react";
import { useIsTouch } from "@/hooks/use-media-query";
import { currentDictInfoAtom } from "@/store";
import KeyEventHandler from "../key-event-handler";
import TextAreaHandler from "../text-area-handler";

export default function InputHandler({
  updateInput,
}: {
  updateInput: (updateObj: WordUpdateAction) => void;
}) {
  const dictInfo = useAtomValue(currentDictInfoAtom);
  const isTouch = useIsTouch();

  const handler = useMemo(() => {
    const needsTextArea =
      isTouch || !["en", "de", "romaji"].includes(dictInfo.language);
    if (needsTextArea) {
      return <TextAreaHandler updateInput={updateInput} />;
    }

    return <KeyEventHandler updateInput={updateInput} />;
  }, [dictInfo.language, isTouch, updateInput]);

  return <>{handler}</>;
}
export type WordUpdateAction =
  | WordAddAction
  | WordDeleteAction
  | WordCompositionAction;

interface WordAddAction {
  event: FormEvent<HTMLTextAreaElement> | KeyboardEvent;
  type: "add";
  value: string;
}

interface WordDeleteAction {
  length: number;
  type: "delete";
}

// composition api is not ready yet
interface WordCompositionAction {
  type: "composition";
  value: string;
}
