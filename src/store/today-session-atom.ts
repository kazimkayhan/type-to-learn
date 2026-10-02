import { atom } from "jotai";
import type { Word } from "@/typings";

export interface TodaySessionState {
  active: boolean;
  words: Word[];
}

export const todaySessionAtom = atom<TodaySessionState>({
  active: false,
  words: [],
});

export const isTodayModeAtom = atom((get) => get(todaySessionAtom).active);
