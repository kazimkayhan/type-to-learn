import type { Table } from "dexie";
import Dexie from "dexie";
import { useAtomValue } from "jotai";
import { useCallback, useContext } from "react";
import { TypingContext, TypingStateActionType } from "@/pages/typing/store";
import type { TypingState } from "@/pages/typing/store/type";
import {
  currentChapterAtom,
  currentDictIdAtom,
  isSessionPracticeAtom,
} from "@/store";
import type {
  IChapterRecord,
  IReviewRecord,
  IRevisionDictRecord,
  IWordMastery,
  IWordRecord,
  LetterMistakes,
} from "./record";
import { ChapterRecord, ReviewRecord, WordRecord } from "./record";
import { applyWordReview } from "./word-mastery";

class RecordDB extends Dexie {
  wordRecords!: Table<IWordRecord, number>;
  chapterRecords!: Table<IChapterRecord, number>;
  reviewRecords!: Table<IReviewRecord, number>;

  revisionDictRecords!: Table<IRevisionDictRecord, number>;
  revisionWordRecords!: Table<IWordRecord, number>;
  wordMastery!: Table<IWordMastery, number>;

  constructor() {
    super("RecordDB");
    this.version(1).stores({
      chapterRecords: "++id,timeStamp,dict,chapter,time,[dict+chapter]",
      wordRecords: "++id,word,timeStamp,dict,chapter,errorCount,[dict+chapter]",
    });
    this.version(2).stores({
      chapterRecords: "++id,timeStamp,dict,chapter,time,[dict+chapter]",
      wordRecords: "++id,word,timeStamp,dict,chapter,wrongCount,[dict+chapter]",
    });
    this.version(3).stores({
      chapterRecords: "++id,timeStamp,dict,chapter,time,[dict+chapter]",
      reviewRecords: "++id,dict,createTime,isFinished",
      wordRecords: "++id,word,timeStamp,dict,chapter,wrongCount,[dict+chapter]",
    });
    this.version(4).stores({
      chapterRecords: "++id,timeStamp,dict,chapter,time,[dict+chapter]",
      reviewRecords: "++id,dict,createTime,isFinished",
      wordMastery: "++id,dict,word,due,state,lapses,[dict+word]",
      wordRecords: "++id,word,timeStamp,dict,chapter,wrongCount,[dict+chapter]",
    });
  }
}

export const db = new RecordDB();

db.wordRecords.mapToClass(WordRecord);
db.chapterRecords.mapToClass(ChapterRecord);
db.reviewRecords.mapToClass(ReviewRecord);

export function useSaveChapterRecord() {
  const currentChapter = useAtomValue(currentChapterAtom);
  const isRevision = useAtomValue(isSessionPracticeAtom);
  const dictID = useAtomValue(currentDictIdAtom);

  const saveChapterRecord = useCallback(
    async (typingState: TypingState) => {
      const {
        chapterData: {
          correctCount,
          wrongCount,
          userInputLogs,
          wordCount,
          words,
          wordRecordIds,
        },
        timerData: { time },
      } = typingState;
      const correctWordIndexes = userInputLogs
        .filter((log) => log.correctCount > 0 && log.wrongCount === 0)
        .map((log) => log.index);

      const chapterRecord = new ChapterRecord(
        dictID,
        isRevision ? -1 : currentChapter,
        time,
        correctCount,
        wrongCount,
        wordCount,
        correctWordIndexes,
        words.length,
        wordRecordIds
      );
      try {
        await db.chapterRecords.add(chapterRecord);
      } catch (e) {
        console.error("Failed to save chapter record:", e);
      }
    },
    [currentChapter, dictID, isRevision]
  );

  return saveChapterRecord;
}

// Note: WordKeyLogger interface was unused and removed

export function useSaveWordRecord() {
  const isRevision = useAtomValue(isSessionPracticeAtom);
  const currentChapter = useAtomValue(currentChapterAtom);
  const dictID = useAtomValue(currentDictIdAtom);

  const { dispatch } = useContext(TypingContext) ?? {};

  const saveWordRecord = useCallback(
    async ({
      word,
      wrongCount,
      letterTimeArray,
      letterMistake,
    }: {
      word: string;
      wrongCount: number;
      letterTimeArray: number[];
      letterMistake: LetterMistakes;
    }) => {
      const timing = [];
      for (let i = 1; i < letterTimeArray.length; i += 1) {
        const diff = letterTimeArray[i] - letterTimeArray[i - 1];
        timing.push(diff);
      }

      const wordRecord = new WordRecord(
        word,
        dictID,
        isRevision ? -1 : currentChapter,
        timing,
        wrongCount,
        letterMistake
      );

      let dbID = -1;
      try {
        dbID = await db.wordRecords.add(wordRecord);
        await applyWordReview(dictID, word, wrongCount);
      } catch (e) {
        console.error(e);
      }
      if (dispatch) {
        dbID > 0 &&
          dispatch({
            payload: dbID,
            type: TypingStateActionType.ADD_WORD_RECORD_ID,
          });
        dispatch({
          payload: false,
          type: TypingStateActionType.SET_IS_SAVING_RECORD,
        });
      }
    },
    [currentChapter, dictID, dispatch, isRevision]
  );

  return saveWordRecord;
}

export function useDeleteWordRecord() {
  const deleteWordRecord = useCallback(async (word: string, dict: string) => {
    try {
      const deletedCount = await db.wordRecords.where({ dict, word }).delete();
      return deletedCount;
    } catch (error) {
      console.error("Error deleting word record:", error);
    }
  }, []);

  return { deleteWordRecord };
}
