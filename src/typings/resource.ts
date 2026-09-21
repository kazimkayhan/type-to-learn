import type { LanguageCategoryType, LanguageType, PronunciationType } from ".";

export interface DictionaryResource {
  category: string;
  //override default pronunciation when not undefined
  defaultPronIndex?: number;
  description: string;
  id: string;
  language: LanguageType;
  languageCategory: LanguageCategoryType;
  length: number;
  name: string;
  tags: string[];
  url: string;
}

export interface Dictionary {
  category: string;
  // calculated in the store
  chapterCount: number;
  //override default pronunciation when not undefined
  defaultPronIndex?: number;
  description: string;
  id: string;
  language: LanguageType;
  languageCategory: LanguageCategoryType;
  length: number;
  name: string;
  tags: string[];
  url: string;
}

interface PronunciationConfig {
  name: string;
  pron: PronunciationType;
}

interface LanguagePronunciationMapConfig {
  defaultPronIndex: number;
  pronunciation: PronunciationConfig[];
}

export type LanguagePronunciationMap = {
  [key in LanguageType]: LanguagePronunciationMapConfig;
};

export interface SoundResource {
  filename: string;
  key: string;
  name: string;
}
