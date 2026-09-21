import type { LanguagePronunciationMap, SoundResource } from "@/typings";

export const SOUND_URL_PREFIX = `${import.meta.env.BASE_URL}sounds/`;
export const KEY_SOUND_URL_PREFIX = `${SOUND_URL_PREFIX}key-sound/`;

/**
 * the Mechanical keyboard sound from https://github.com/tplai/kbsim
 *
 * Static list of sound files in public/sounds/key-sound/
 * Using a static list instead of import.meta.glob because glob doesn't work
 * for files in public/ during production builds (they're not in the module graph)
 */
export const keySoundResources: SoundResource[] = [
  { filename: "Default.wav", key: "Default", name: "Default" },
  { filename: "Alpacas.mp3", key: "Alpacas", name: "Alpacas" },
  {
    filename: "Buckling Spring.mp3",
    key: "Buckling Spring",
    name: "Buckling Spring",
  },
  {
    filename: "Cherry MX Blacks.mp3",
    key: "Cherry MX Blacks",
    name: "Cherry MX Blacks",
  },
  {
    filename: "Cherry MX Blues.mp3",
    key: "Cherry MX Blues",
    name: "Cherry MX Blues",
  },
  {
    filename: "Cherry MX Browns.mp3",
    key: "Cherry MX Browns",
    name: "Cherry MX Browns",
  },
  {
    filename: "Gateron Black Inks.mp3",
    key: "Gateron Black Inks",
    name: "Gateron Black Inks",
  },
  {
    filename: "Gateron Red Inks.mp3",
    key: "Gateron Red Inks",
    name: "Gateron Red Inks",
  },
  { filename: "Holy Pandas.mp3", key: "Holy Pandas", name: "Holy Pandas" },
  {
    filename: "Kailh Box Navies.mp3",
    key: "Kailh Box Navies",
    name: "Kailh Box Navies",
  },
  {
    filename: "NovelKeys Creams.mp3",
    key: "NovelKeys Creams",
    name: "NovelKeys Creams",
  },
  {
    filename: "SKCM Blue Alps.mp3",
    key: "SKCM Blue Alps",
    name: "SKCM Blue Alps",
  },
  { filename: "Topre.mp3", key: "Topre", name: "Topre" },
  {
    filename: "Turquoise Tealios.mp3",
    key: "Turquoise Tealios",
    name: "Turquoise Tealios",
  },
];

export const wrongSoundResources: SoundResource[] = [
  { filename: "beep.wav", key: "1", name: "Sound 1" },
];

export const correctSoundResources: SoundResource[] = [
  { filename: "correct.wav", key: "1", name: "Sound 1" },
];

export const LANG_PRON_MAP: LanguagePronunciationMap = {
  code: {
    defaultPronIndex: 0,
    pronunciation: [
      {
        name: "US",
        pron: "us",
      },
      {
        name: "UK",
        pron: "uk",
      },
    ],
  },
  de: {
    defaultPronIndex: 0,
    pronunciation: [
      {
        name: "German",
        pron: "de",
      },
    ],
  },
  en: {
    defaultPronIndex: 0,
    pronunciation: [
      {
        name: "US",
        pron: "us",
      },
      {
        name: "UK",
        pron: "uk",
      },
    ],
  },
  hapin: {
    defaultPronIndex: 0,
    pronunciation: [
      {
        name: "Hapin",
        pron: "hapin",
      },
    ],
  },
  id: {
    defaultPronIndex: 0,
    pronunciation: [
      {
        name: "Indonesian",
        pron: "id",
      },
    ],
  },
  ja: {
    defaultPronIndex: 0,
    pronunciation: [
      {
        name: "Japanese",
        pron: "ja",
      },
    ],
  },
  kk: {
    defaultPronIndex: 0,
    pronunciation: [
      {
        name: "Kazakh",
        pron: "kk",
      },
    ],
  },
  romaji: {
    defaultPronIndex: 0,
    pronunciation: [
      {
        name: "Romaji",
        pron: "romaji",
      },
    ],
  },
  zh: {
    defaultPronIndex: 0,
    pronunciation: [
      {
        name: "Mandarin",
        pron: "zh",
      },
    ],
  },
};
