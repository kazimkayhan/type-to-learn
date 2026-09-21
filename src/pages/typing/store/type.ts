import type { WordWithIndex } from "@/typings";
import type { LetterMistakes } from "@/utils/db/record";

interface ChapterData {
  // 输入正确的单词数
  correctCount: number;
  // chapter index
  index: number;
  // 每个单词的输入记录
  userInputLogs: UserInputLog[];
  // 输入的单词数
  wordCount: number;
  // 本章节用户输入的单词的 record id 列表
  wordRecordIds: number[];
  // warning: 因为有章节内随机的存在，所有记录 index 的场景都应该使用 WordWithIndex.index
  words: WordWithIndex[];
  // 输入错误的单词数
  wrongCount: number;
}

export interface UserInputLog {
  correctCount: number;
  // the index in ChapterData.words, not the index in WordWithIndex
  index: number;
  LetterMistakes: LetterMistakes;
  wrongCount: number;
}

interface TimerData {
  accuracy: number;
  time: number;
  wpm: number;
}

// Note: WrongWordData interface was unused and removed

export interface TypingState {
  chapterData: ChapterData;
  isFinished: boolean;
  isLoopSingleWord: boolean;
  // 是否正在保存数据
  isSavingRecord: boolean;
  isShowSkip: boolean;
  isTransVisible: boolean;
  isTyping: boolean;
  timerData: TimerData;
}
