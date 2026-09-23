import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import Tooltip from "@/components/tooltip";
import { randomConfigAtom } from "@/store";
import { TypingStateActionType, useTypingContext } from "../../store";

export default function StartButton({ isLoading }: { isLoading: boolean }) {
  const { state, dispatch } = useTypingContext();
  const randomConfig = useAtomValue(randomConfigAtom);

  const onToggleIsTyping = useCallback(
    (event?: { currentTarget?: { blur?: () => void } }) => {
      if (isLoading) {
        return;
      }
      event?.currentTarget?.blur?.();
      dispatch({ type: TypingStateActionType.TOGGLE_IS_TYPING });
    },
    [isLoading, dispatch]
  );

  const onClickRestart = useCallback(() => {
    dispatch({
      shouldShuffle: randomConfig.isOpen,
      type: TypingStateActionType.REPEAT_CHAPTER,
    });
  }, [dispatch, randomConfig.isOpen]);

  useHotkeys(
    "enter",
    onToggleIsTyping,
    { enableOnFormTags: true, preventDefault: true },
    [onToggleIsTyping]
  );

  return (
    <div className="inline-flex items-center justify-center gap-1.5">
      <Tooltip content={`${state.isTyping ? "Pause" : "Start"} (Enter)`}>
        <button
          aria-label={state.isTyping ? "Pause" : "Start"}
          className={`${
            state.isTyping ? "bg-primary/80" : "bg-primary"
          } my-btn-primary inline-flex h-11 min-w-[4.5rem] items-center justify-center px-4 text-sm shadow shadow-primary/40 sm:h-8 sm:w-20 sm:text-lg`}
          onClick={onToggleIsTyping}
          type="button"
        >
          <span className="font-medium">
            {state.isTyping ? "Pause" : "Start"}
          </span>
        </button>
      </Tooltip>
      <Tooltip content="Restart this chapter">
        <button
          aria-label="Restart"
          className="my-btn-primary inline-flex h-11 min-w-[4.5rem] items-center justify-center bg-primary/80 px-3 text-sm sm:h-8 sm:w-18 sm:text-lg"
          onClick={onClickRestart}
          type="button"
        >
          Restart
        </button>
      </Tooltip>
    </div>
  );
}
