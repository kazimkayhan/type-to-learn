import type { LetterMistakes } from "@/utils/db/record";
import type { LetterState } from "./letter";

export interface WordState {
  correctCount: number;
  displayWord: string;
  endTime: string;
  // 记录是否已经出现过输入错误
  hasMadeInputWrong: boolean;
  // 是否出现输入错误
  hasWrong: boolean;
  inputCount: number;
  inputWord: string;
  isFinished: boolean;
  letterMistake: LetterMistakes;
  letterStates: LetterState[];
  letterTimeArray: number[];
  // 用于随机隐藏字母功能
  randomLetterVisible: boolean[];
  startTime: string;
  // 用户输入错误的次数
  wrongCount: number;
}

export const initialWordState: WordState = {
  correctCount: 0,
  displayWord: "",
  endTime: "",
  hasMadeInputWrong: false,
  hasWrong: false,
  inputCount: 0,
  inputWord: "",
  isFinished: false,
  letterMistake: {},
  letterStates: [],
  letterTimeArray: [],
  randomLetterVisible: [],
  startTime: "",
  wrongCount: 0,
};
