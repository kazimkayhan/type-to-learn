import { useAtom } from "jotai";
import { useContext } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import Tooltip from "@/components/tooltip";
import { isOpenDarkModeAtom } from "@/store";
import { CTRL } from "@/utils";
import IconMoon from "~icons/heroicons/moon-solid";
import IconSun from "~icons/heroicons/sun-solid";
import IconLanguage from "~icons/tabler/language";
import IconLanguageOff from "~icons/tabler/language-off";
import { TypingContext, TypingStateActionType } from "../../store";
import AnalysisButton from "../analysis-button";
import ErrorBookButton from "../error-book-button";
import HandPositionIllustration from "../hand-position-illustration";
import LoopWordSwitcher from "../loop-word-switcher";
import Setting from "../setting";
import SoundSwitcher from "../sound-switcher";
import WordDictationSwitcher from "../word-dictation-switcher";

export default function Switcher() {
  const [isOpenDarkMode, setIsOpenDarkMode] = useAtom(isOpenDarkModeAtom);
  const { state, dispatch } = useContext(TypingContext) ?? {};

  const changeDarkModeState = () => {
    setIsOpenDarkMode((old) => !old);
  };

  const changeTransVisibleState = () => {
    if (dispatch) {
      dispatch({ type: TypingStateActionType.TOGGLE_TRANS_VISIBLE });
    }
  };

  useHotkeys(
    "ctrl+shift+v",
    () => {
      changeTransVisibleState();
    },
    { enableOnFormTags: true, preventDefault: true },
    []
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 [&_button]:min-h-10 [&_button]:min-w-10 lg:[&_button]:min-h-0 lg:[&_button]:min-w-0">
      <Tooltip content="Sound settings">
        <SoundSwitcher />
      </Tooltip>

      <Tooltip className="h-7 w-7" content="Set word loop count">
        <LoopWordSwitcher />
      </Tooltip>

      <Tooltip
        className="h-7 w-7"
        content={`Toggle dictation mode (${CTRL} + V)`}
      >
        <WordDictationSwitcher />
      </Tooltip>
      <Tooltip
        className="h-7 w-7"
        content={`Toggle definition display (${CTRL} + Shift + V)`}
      >
        <button
          aria-label={`Toggle definition display (${CTRL} + Shift + V)`}
          className={`rounded p-[2px] ${state?.isTransVisible ? "text-primary" : "text-muted-foreground"} text-lg focus-visible:ring-2 focus-visible:ring-ring`}
          onClick={(e) => {
            changeTransVisibleState();
            e.currentTarget.blur();
          }}
          type="button"
        >
          {state?.isTransVisible ? <IconLanguage /> : <IconLanguageOff />}
        </button>
      </Tooltip>

      <Tooltip content="Error Book">
        <ErrorBookButton />
      </Tooltip>

      <Tooltip className="h-7 w-7" content="View statistics">
        <AnalysisButton />
      </Tooltip>

      <Tooltip className="h-7 w-7" content="Toggle dark mode">
        <button
          aria-label="Toggle dark mode"
          className="rounded p-[2px] text-lg text-primary focus-visible:ring-2 focus-visible:ring-ring"
          onClick={(e) => {
            changeDarkModeState();
            e.currentTarget.blur();
          }}
          type="button"
        >
          {isOpenDarkMode ? (
            <IconMoon className="icon" />
          ) : (
            <IconSun className="icon" />
          )}
        </button>
      </Tooltip>
      <Tooltip className="h-7 w-7" content="Hand position guide">
        <HandPositionIllustration />
      </Tooltip>
      <Tooltip content="Settings">
        <Setting />
      </Tooltip>
    </div>
  );
}
