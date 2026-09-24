import type { WordWithIndex } from "@/typings";
import type { LetterMistakes } from "@/utils/db/record";
import type { TypingState, UserInputLog } from "./type";
import "@/utils/db/review-record";
import { createContext, useContext } from "react";
import { mergeLetterMistake } from "@/utils/db/utils";
import shuffle from "@/utils/shuffle";

export const initialState: TypingState = {
  chapterData: {
    correctCount: 0,
    index: 0,
    userInputLogs: [],
    wordCount: 0,
    wordRecordIds: [],
    words: [],
    wrongCount: 0,
  },
  isFinished: false,
  isLoopSingleWord: false,
  isSavingRecord: false,
  isShowSkip: false,
  isTransVisible: true,
  isTyping: false,
  timerData: {
    accuracy: 0,
    time: 0,
    wpm: 0,
  },
};

const initialUserInputLog: UserInputLog = {
  correctCount: 0,
  index: 0,
  LetterMistakes: {},
  wrongCount: 0,
};

export const TypingStateActionType = {
  ADD_WORD_RECORD_ID: "ADD_WORD_RECORD_ID",
  FINISH_CHAPTER: "FINISH_CHAPTER",
  INCREASE_WRONG_WORD: "INCREASE_WRONG_WORD",
  LOOP_CURRENT_WORD: "LOOP_CURRENT_WORD",
  NEXT_CHAPTER: "NEXT_CHAPTER",
  NEXT_WORD: "NEXT_WORD",
  REPEAT_CHAPTER: "REPEAT_CHAPTER",
  REPORT_CORRECT_WORD: "REPORT_CORRECT_WORD",
  REPORT_WRONG_WORD: "REPORT_WRONG_WORD",
  SET_IS_LOOP_SINGLE_WORD: "SET_IS_LOOP_SINGLE_WORD",
  SET_IS_SAVING_RECORD: "SET_IS_SAVING_RECORD",
  SET_IS_SKIP: "SET_IS_SKIP",
  SET_IS_TYPING: "SET_IS_TYPING",
  SET_REVISION_INDEX: "SET_REVISION_INDEX",
  SETUP_CHAPTER: "SETUP_CHAPTER",
  SKIP_2_WORD_INDEX: "SKIP_2_WORD_INDEX",
  SKIP_WORD: "SKIP_WORD",
  TICK_TIMER: "TICK_TIMER",
  TOGGLE_IS_LOOP_SINGLE_WORD: "TOGGLE_IS_LOOP_SINGLE_WORD",
  TOGGLE_IS_TYPING: "TOGGLE_IS_TYPING",
  TOGGLE_TRANS_VISIBLE: "TOGGLE_TRANS_VISIBLE",
  TOGGLE_WORD_VISIBLE: "TOGGLE_WORD_VISIBLE",
} as const;

export type TypingStateAction =
  | {
      type: TypingStateActionType.SETUP_CHAPTER;
      payload: {
        words: WordWithIndex[];
        shouldShuffle: boolean;
        initialIndex?: number;
      };
    }
  | { type: TypingStateActionType.SET_IS_SKIP; payload: boolean }
  | { type: TypingStateActionType.SET_IS_TYPING; payload: boolean }
  | { type: TypingStateActionType.TOGGLE_IS_TYPING }
  | {
      type: TypingStateActionType.REPORT_WRONG_WORD;
      payload: { letterMistake: LetterMistakes };
    }
  | { type: TypingStateActionType.REPORT_CORRECT_WORD }
  | {
      type: TypingStateActionType.NEXT_WORD;
      payload?: {
        updateReviewRecord?: (state: TypingState) => void;
      };
    }
  | { type: TypingStateActionType.LOOP_CURRENT_WORD }
  | { type: TypingStateActionType.FINISH_CHAPTER }
  | { type: TypingStateActionType.SKIP_WORD }
  | { type: TypingStateActionType.SKIP_2_WORD_INDEX; newIndex: number }
  | { type: TypingStateActionType.REPEAT_CHAPTER; shouldShuffle: boolean }
  | { type: TypingStateActionType.NEXT_CHAPTER }
  | { type: TypingStateActionType.TOGGLE_TRANS_VISIBLE }
  | { type: TypingStateActionType.TICK_TIMER; addTime?: number }
  | { type: TypingStateActionType.ADD_WORD_RECORD_ID; payload: number }
  | { type: TypingStateActionType.SET_IS_SAVING_RECORD; payload: boolean }
  | { type: TypingStateActionType.SET_IS_LOOP_SINGLE_WORD; payload: boolean }
  | { type: TypingStateActionType.TOGGLE_IS_LOOP_SINGLE_WORD };

type Dispatch = (action: TypingStateAction) => void;

function refreshTimerStats(state: TypingState) {
  const inputSum =
    state.chapterData.correctCount + state.chapterData.wrongCount;
  state.timerData.accuracy = Math.round(
    (state.chapterData.correctCount / (inputSum === 0 ? 1 : inputSum)) * 100
  );
  if (state.timerData.time > 0) {
    state.timerData.wpm = Math.round(
      (state.chapterData.wordCount / state.timerData.time) * 60
    );
  }
}

export const typingReducer = (
  state: TypingState,
  action: TypingStateAction
) => {
  switch (action.type) {
    case TypingStateActionType.SETUP_CHAPTER: {
      const newState = structuredClone(initialState);
      const words = action.payload.shouldShuffle
        ? shuffle(action.payload.words)
        : action.payload.words;
      let initialIndex = action.payload.initialIndex ?? 0;
      if (initialIndex >= words.length) {
        initialIndex = 0;
      }
      newState.chapterData.index = initialIndex;
      newState.chapterData.words = words;
      newState.chapterData.userInputLogs = words.map((_, index) => ({
        ...structuredClone(initialUserInputLog),
        index,
      }));
      // This effect also re-fires when `words` changes because the user
      // advanced to the next chapter (Next/Repeat/Dictate), not just on a
      // fresh dictionary/page load. Preserve isTyping instead of always
      // resetting to idle, so a deliberate "keep typing" continuation isn't
      // silently interrupted once the new chapter's word list lands.
      newState.isTyping = state.isTyping;

      return newState;
    }
    case TypingStateActionType.SET_IS_SKIP:
      state.isShowSkip = action.payload;
      break;
    case TypingStateActionType.SET_IS_TYPING:
      state.isTyping = action.payload;
      break;

    case TypingStateActionType.TOGGLE_IS_TYPING:
      state.isTyping = !state.isTyping;
      break;
    case TypingStateActionType.REPORT_CORRECT_WORD: {
      state.chapterData.correctCount += 1;

      const wordLog = state.chapterData.userInputLogs[state.chapterData.index];
      wordLog.correctCount += 1;
      refreshTimerStats(state);
      break;
    }
    case TypingStateActionType.REPORT_WRONG_WORD: {
      state.chapterData.wrongCount += 1;

      const { letterMistake } = action.payload;
      const wordLog = state.chapterData.userInputLogs[state.chapterData.index];
      wordLog.wrongCount += 1;
      wordLog.LetterMistakes = mergeLetterMistake(
        wordLog.LetterMistakes,
        letterMistake
      );
      refreshTimerStats(state);
      break;
    }
    case TypingStateActionType.NEXT_WORD: {
      state.chapterData.index += 1;
      state.chapterData.wordCount += 1;
      state.isShowSkip = false;

      action.payload?.updateReviewRecord?.(state);
      break;
    }
    case TypingStateActionType.LOOP_CURRENT_WORD:
      state.isShowSkip = false;
      state.chapterData.wordCount += 1;
      break;
    case TypingStateActionType.FINISH_CHAPTER:
      state.chapterData.wordCount += 1;
      state.isTyping = false;
      state.isFinished = true;
      state.isShowSkip = false;
      break;
    case TypingStateActionType.SKIP_WORD: {
      const newIndex = state.chapterData.index + 1;
      state.chapterData.wordCount += 1;
      if (newIndex >= state.chapterData.words.length) {
        state.isTyping = false;
        state.isFinished = true;
      } else {
        state.chapterData.index = newIndex;
      }
      state.isShowSkip = false;
      break;
    }
    case TypingStateActionType.SKIP_2_WORD_INDEX: {
      const { newIndex } = action;
      if (newIndex >= state.chapterData.words.length) {
        state.isTyping = false;
        state.isFinished = true;
      }
      state.chapterData.index = newIndex;
      break;
    }
    case TypingStateActionType.REPEAT_CHAPTER: {
      const newState = structuredClone(initialState);
      newState.chapterData.userInputLogs = state.chapterData.words.map(
        (_, index) => ({ ...structuredClone(initialUserInputLog), index })
      );
      newState.isTyping = true;
      newState.chapterData.words = action.shouldShuffle
        ? shuffle(state.chapterData.words)
        : state.chapterData.words;
      newState.isTransVisible = state.isTransVisible;
      return newState;
    }
    case TypingStateActionType.NEXT_CHAPTER: {
      const newState = structuredClone(initialState);
      newState.chapterData.words = state.chapterData.words;
      newState.chapterData.userInputLogs = state.chapterData.words.map(
        (_, index) => ({ ...structuredClone(initialUserInputLog), index })
      );
      newState.isTyping = true;
      newState.isTransVisible = state.isTransVisible;
      return newState;
    }
    case TypingStateActionType.TOGGLE_TRANS_VISIBLE:
      state.isTransVisible = !state.isTransVisible;
      break;
    case TypingStateActionType.TICK_TIMER: {
      const increment = action.addTime === undefined ? 1 : action.addTime;
      state.timerData.time += increment;
      refreshTimerStats(state);
      break;
    }
    case TypingStateActionType.ADD_WORD_RECORD_ID: {
      state.chapterData.wordRecordIds.push(action.payload);
      break;
    }
    case TypingStateActionType.SET_IS_SAVING_RECORD: {
      state.isSavingRecord = action.payload;
      break;
    }
    case TypingStateActionType.SET_IS_LOOP_SINGLE_WORD: {
      state.isLoopSingleWord = action.payload;
      break;
    }
    case TypingStateActionType.TOGGLE_IS_LOOP_SINGLE_WORD: {
      state.isLoopSingleWord = !state.isLoopSingleWord;
      break;
    }
    default: {
      return state;
    }
  }
};

export const TypingContext = createContext<{
  state: TypingState;
  dispatch: Dispatch;
} | null>(null);

export function useTypingContext() {
  const context = useContext(TypingContext);
  if (!context) {
    throw new Error(
      "useTypingContext must be used within a TypingContext.Provider"
    );
  }
  return context;
}
