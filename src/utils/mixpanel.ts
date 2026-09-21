import { useAtomValue } from "jotai";
import { useCallback } from "react";
import type { TypingState } from "@/pages/typing/store/type";
import {
  currentChapterAtom,
  currentDictInfoAtom,
  isOpenDarkModeAtom,
  keySoundsConfigAtom,
  phoneticConfigAtom,
  pronunciationConfigAtom,
  randomConfigAtom,
} from "@/store";
import type { InfoPanelType, PronunciationType } from "@/typings";

const mixpanel = {
  track: (_event: string, _props?: Record<string, unknown>) => {
    // No-op implementation for mixpanel tracking
  },
};

type starAction = "star" | "dismiss";

function _recordStarAction(action: starAction) {
  const props = {
    action,
  };
  mixpanel.track("star", props);
}

type openInfoPanelLocation = "footer" | "resultScreen";
function _recordOpenInfoPanelAction(
  type: InfoPanelType,
  location: openInfoPanelLocation
) {
  const props = {
    location,
    type,
  };
  mixpanel.track("openInfoPanel", props);
}

export type shareType = "open" | "download";
export function recordShareAction(type: shareType) {
  mixpanel.track("share", { type });
}

export type analysisType = "open";
export function recordAnalysisAction(type: analysisType) {
  const props = {
    type,
  };

  mixpanel.track("analysis", props);
}

export type errorBookType = "open" | "detail";
export function recordErrorBookAction(type: errorBookType) {
  const props = {
    type,
  };

  mixpanel.track("error-book", props);
}

interface donateCardInfo {
  amount: number;
  chapterNumber: number;
  dayFromFirstWord: number;
  dayFromQwerty: number;
  sumWrongCount: number;
  type: "donate" | "dismiss";
  wordNumber: number;
}

function _reportDonateCard(info: donateCardInfo) {
  const props = {
    ...info,
  };

  mixpanel.track("donate-card", props);
}

/**
 * mixpanel 单词和章节统计事件
 */
interface ModeInfo {
  enabledKeyboardSound: boolean;
  enabledPhotonicsSymbol: boolean;
  enabledSingleWordLoop: boolean;
  modeDark: boolean;
  modeDictation: boolean;
  modeShuffle: boolean;

  pronunciationAuto: boolean;
  pronunciationOption: PronunciationType | "none";
}

type WordLogUpload = ModeInfo & {
  headword: string;
  timeStart: string;
  timeEnd: string;
  countInput: number;
  countCorrect: number;
  countTypo: number;
  order: number;
  chapter: string;
  wordlist: string;
};

type ChapterLogUpload = ModeInfo & {
  chapter: string;
  wordlist: string;
  timeEnd: string;
  duration: number;
  countInput: number;
  countCorrect: number;
  countTypo: number;
};

export function useMixPanelWordLogUploader(typingState: TypingState) {
  const currentChapter = useAtomValue(currentChapterAtom);
  const { name: dictName } = useAtomValue(currentDictInfoAtom);
  const isDarkMode = useAtomValue(isOpenDarkModeAtom);
  const keySoundsConfig = useAtomValue(keySoundsConfigAtom);
  const phoneticConfig = useAtomValue(phoneticConfigAtom);
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom);
  const randomConfig = useAtomValue(randomConfigAtom);

  const wordLogUploader = useCallback(
    (wordLog: {
      headword: string;
      timeStart: string;
      timeEnd: string;
      countInput: number;
      countCorrect: number;
      countTypo: number;
    }) => {
      const props: WordLogUpload = {
        ...wordLog,
        chapter: (currentChapter + 1).toString(),
        enabledKeyboardSound: keySoundsConfig.isOpen,
        enabledPhotonicsSymbol: phoneticConfig.isOpen,
        enabledSingleWordLoop: typingState.isLoopSingleWord,
        modeDark: isDarkMode,
        modeDictation: !typingState.isWordVisible,
        modeShuffle: randomConfig.isOpen,
        order: typingState.chapterData.index + 1,
        pronunciationAuto: pronunciationConfig.isOpen,
        pronunciationOption:
          pronunciationConfig.isOpen === false
            ? "none"
            : pronunciationConfig.type,
        wordlist: dictName,
      };
      mixpanel.track("Word", props);
    },
    [
      typingState,
      currentChapter,
      dictName,
      isDarkMode,
      keySoundsConfig.isOpen,
      phoneticConfig.isOpen,
      pronunciationConfig.isOpen,
      pronunciationConfig.type,
      randomConfig.isOpen,
    ]
  );

  return wordLogUploader;
}

export function useMixPanelChapterLogUploader(typingState: TypingState) {
  const currentChapter = useAtomValue(currentChapterAtom);
  const { name: dictName } = useAtomValue(currentDictInfoAtom);
  const isDarkMode = useAtomValue(isOpenDarkModeAtom);
  const keySoundsConfig = useAtomValue(keySoundsConfigAtom);
  const phoneticConfig = useAtomValue(phoneticConfigAtom);
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom);
  const randomConfig = useAtomValue(randomConfigAtom);

  const chapterLogUploader = useCallback(() => {
    const props: ChapterLogUpload = {
      chapter: (currentChapter + 1).toString(),
      countCorrect: typingState.chapterData.correctCount,
      countInput:
        typingState.chapterData.correctCount +
        typingState.chapterData.wrongCount,
      countTypo: typingState.chapterData.wrongCount,
      duration: typingState.timerData.time,
      enabledKeyboardSound: keySoundsConfig.isOpen,
      enabledPhotonicsSymbol: phoneticConfig.isOpen,
      enabledSingleWordLoop: typingState.isLoopSingleWord,
      modeDark: isDarkMode,
      modeDictation: !typingState.isWordVisible,
      modeShuffle: randomConfig.isOpen,
      pronunciationAuto: pronunciationConfig.isOpen,
      pronunciationOption:
        pronunciationConfig.isOpen === false
          ? "none"
          : pronunciationConfig.type,
      timeEnd: getUtcStringForMixpanel(),
      wordlist: dictName,
    };
    mixpanel.track("Chapter", props);
  }, [
    typingState,
    currentChapter,
    dictName,
    isDarkMode,
    keySoundsConfig.isOpen,
    phoneticConfig.isOpen,
    pronunciationConfig.isOpen,
    pronunciationConfig.type,
    randomConfig.isOpen,
  ]);
  return chapterLogUploader;
}

export function recordDataAction({
  type,
  size,
  wordCount,
  chapterCount,
}: {
  type: "export" | "import";
  size: number;
  wordCount: number;
  chapterCount: number;
}) {
  const props = {
    chapterCount,
    size,
    type,
    wordCount,
  };

  mixpanel.track("dataAction", props);
}

export function getUtcStringForMixpanel() {
  const now = new Date();
  const isoString = now.toISOString();
  const utcString = isoString.slice(0, 19).replace("T", " ");

  return utcString;
}
