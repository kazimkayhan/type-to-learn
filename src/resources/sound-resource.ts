import type { LanguagePronunciationMap, SoundResource } from "@/typings";

export const SOUND_URL_PREFIX = `${import.meta.env.BASE_URL}sounds/`;
export const KEY_SOUND_URL_PREFIX = `${SOUND_URL_PREFIX}key-sound/`;

// will add more sound resource and add config ui in the future
const videoList = import.meta.glob(
  ["../../public/sounds/key-sound/*.(wav|mp3)"],
  {
    eager: false,
  }
);

/**
 * the Mechanical keyboard sound from https://github.com/tplai/kbsim
 */
export const keySoundResources: SoundResource[] = Object.keys(videoList)
  .map((k) => {
    const name = k.replace(/(.*\/)*([^.]+).*/gi, "$2");
    const suffix = k.slice(k.lastIndexOf("."));
    return {
      filename: `${name}${suffix}`,
      key: name,
      name: `${name}`,
    };
  })
  .sort((a, b) => {
    // default key should be the first one
    if (a.key === "Default") {
      return -1;
    }
    if (b.key === "Default") {
      return 1;
    }

    return a.key.localeCompare(b.key);
  });

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
