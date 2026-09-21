import type { WordRecord } from "@/utils/db/record";

export interface groupedWordRecords {
  dict: string;
  records: WordRecord[];
  word: string;
  wrongCount: number;
}
