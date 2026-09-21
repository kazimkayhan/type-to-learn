import { useAtomValue } from "jotai";
import { useCallback, useContext } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import Tooltip from "@/components/Tooltip";
import { randomConfigAtom } from "@/store";
import { TypingContext, TypingStateActionType } from "../../store";

export default function StartButton({ isLoading }: { isLoading: boolean }) {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state, dispatch } = useContext(TypingContext)!;
  const randomConfig = useAtomValue(randomConfigAtom);

  const onToggleIsTyping = useCallback(() => {
    !isLoading && dispatch({ type: TypingStateActionType.TOGGLE_IS_TYPING });
  }, [isLoading, dispatch]);

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
    <div className="flex items-center gap-1.5">
      <Tooltip content={`${state.isTyping ? "Pause" : "Start"} (Enter)`}>
        <button
          aria-label={state.isTyping ? "Pause" : "Start"}
          className={`${
            state.isTyping
              ? "bg-gray-400 shadow-gray-200 dark:bg-gray-600 dark:shadow-none dark:hover:bg-gray-500"
              : "bg-indigo-500 shadow-indigo-300 dark:shadow-indigo-500/60"
          } my-btn-primary min-h-11 min-w-[4.5rem] px-4 text-sm shadow sm:min-h-8 sm:w-20 sm:text-lg`}
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
          className={`${
            state.isTyping
              ? "bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-500"
              : "bg-indigo-400"
          } my-btn-primary min-h-11 min-w-[4.5rem] px-3 text-sm sm:min-h-8 sm:w-18 sm:text-lg`}
          onClick={onClickRestart}
          type="button"
        >
          Restart
        </button>
      </Tooltip>
    </div>
  );
}
