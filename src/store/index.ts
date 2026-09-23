import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import {
  DEFAULT_DICT_ID,
  DISMISS_START_CARD_DATE_KEY,
  defaultFontSizeConfig,
} from "@/constants";
import { idDictionaryMap } from "@/resources/dictionary";
import {
  correctSoundResources,
  keySoundResources,
  wrongSoundResources,
} from "@/resources/sound-resource";
import type {
  Dictionary,
  InfoPanelState,
  LoopWordTimesOption,
  PhoneticType,
  PronunciationType,
  WordDictationOpenBy,
  WordDictationType,
} from "@/typings";
import type { ReviewRecord } from "@/utils/db/record";
import atomForConfig from "./atom-for-config";
import { reviewInfoAtom } from "./review-info-atom";

export const currentDictIdAtom = atomWithStorage(
  "currentDict",
  DEFAULT_DICT_ID
);
export const currentDictInfoAtom = atom<Dictionary>((get) => {
  const id = get(currentDictIdAtom);
  let dict = idDictionaryMap[id];
  if (!dict) {
    dict = idDictionaryMap[DEFAULT_DICT_ID];
  }
  return dict;
});

export const currentChapterAtom = atomWithStorage("currentChapter", 0);

export const loopWordConfigAtom = atomForConfig<{ times: LoopWordTimesOption }>(
  "loopWordConfig",
  {
    times: 1,
  }
);

export const keySoundsConfigAtom = atomForConfig("keySoundsConfig", {
  isOpen: true,
  isOpenClickSound: true,
  resource: keySoundResources[0] ?? {
    filename: "Default.wav",
    key: "Default",
    name: "Default",
  },
  volume: 1,
});

export const hintSoundsConfigAtom = atomForConfig("hintSoundsConfig", {
  correctResource: correctSoundResources[0],
  isOpen: true,
  isOpenCorrectSound: true,
  isOpenWrongSound: true,
  volume: 1,
  wrongResource: wrongSoundResources[0],
});

export const pronunciationConfigAtom = atomForConfig("pronunciation", {
  isLoop: false,
  isOpen: true,
  isTransRead: false,
  name: "US",
  rate: 1,
  transVolume: 1,
  type: "us" as PronunciationType,
  volume: 1,
});

export const fontSizeConfigAtom = atomForConfig(
  "fontsize",
  defaultFontSizeConfig
);

export const pronunciationIsOpenAtom = atom(
  (get) => get(pronunciationConfigAtom).isOpen
);

const _pronunciationIsTransReadAtom = atom(
  (get) => get(pronunciationConfigAtom).isTransRead
);

export const randomConfigAtom = atomForConfig("randomConfig", {
  isOpen: false,
});

export const isShowPrevAndNextWordAtom = atomWithStorage(
  "isShowPrevAndNextWord",
  true
);

export const isIgnoreCaseAtom = atomWithStorage("isIgnoreCase", true);

export const isShowAnswerOnHoverAtom = atomWithStorage(
  "isShowAnswerOnHover",
  true
);

export const isTextSelectableAtom = atomWithStorage("isTextSelectable", false);

export const isWordEnrichmentEnabledAtom = atomWithStorage(
  "isWordEnrichmentEnabled",
  true
);

export const reviewModeInfoAtom = reviewInfoAtom({
  isReviewMode: false,
  reviewRecord: undefined as ReviewRecord | undefined,
});
export const isReviewModeAtom = atom(
  (get) => get(reviewModeInfoAtom).isReviewMode
);

export const phoneticConfigAtom = atomForConfig("phoneticConfig", {
  isOpen: true,
  type: "us" as PhoneticType,
});

export const isOpenDarkModeAtom = atomWithStorage(
  "isOpenDarkModeAtom",
  window.matchMedia("(prefers-color-scheme: dark)").matches
);

const _isShowSkipAtom = atom(false);

const _isInDevModeAtom = atom(false);

const _infoPanelStateAtom = atom<InfoPanelState>({
  community: false,
  donate: false,
  redBook: false,
  vsc: false,
});

export const wordDictationConfigAtom = atomForConfig("wordDictationConfig", {
  isOpen: false,
  openBy: "auto" as WordDictationOpenBy,
  type: "hideAll" as WordDictationType,
});

const _dismissStartCardDateAtom = atomWithStorage<Date | null>(
  DISMISS_START_CARD_DATE_KEY,
  null
);

// Enhanced version promotion popup state
const _hasSeenEnhancedPromotionAtom = atomWithStorage(
  "hasSeenEnhancedPromotion",
  false
);
