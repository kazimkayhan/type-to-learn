import { useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import { SoundIcon } from "@/components/WordPronunciationIcon/SoundIcon";
import useSpeech from "@/hooks/useSpeech";
import {
  fontSizeConfigAtom,
  isTextSelectableAtom,
  pronunciationConfigAtom,
} from "@/store";

export type TranslationProps = {
  trans: string;
  showTrans?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export default function Translation({
  trans,
  showTrans = true,
  onMouseEnter,
  onMouseLeave,
}: TranslationProps) {
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom);
  const fontSizeConfig = useAtomValue(fontSizeConfigAtom);
  const isShowTransRead =
    window.speechSynthesis && pronunciationConfig.isTransRead;
  const speechOptions = useMemo(
    () => ({ lang: "en-US", volume: pronunciationConfig.transVolume }),
    [pronunciationConfig.transVolume]
  );
  const { speak, speaking } = useSpeech(trans, speechOptions);

  const handleClickSoundIcon = useCallback(() => {
    speak(true);
  }, [speak]);

  const isTextSelectable = useAtomValue(isTextSelectableAtom);
  return (
    <div
      className={
        "flex items-center justify-center px-3 pt-3 pb-3 sm:pt-5 sm:pb-4"
      }
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span
        className={`max-w-4xl px-2 text-center font-sans transition-colors duration-300 dark:text-white dark:text-opacity-80 ${
          isShowTransRead && "pl-8"
        } ${isTextSelectable && "select-text"}`}
        style={{ fontSize: `min(${fontSizeConfig.translateFont}px, 4.6vw)` }}
      >
        {showTrans ? trans : "\u00A0"}
      </span>
      {isShowTransRead && showTrans && (
        <Tooltip
          className="ml-3 h-5 w-5 cursor-pointer leading-7"
          content="Read definition aloud"
        >
          <SoundIcon
            animated={speaking}
            className="h-5 w-5"
            onClick={handleClickSoundIcon}
          />
        </Tooltip>
      )}
    </div>
  );
}
