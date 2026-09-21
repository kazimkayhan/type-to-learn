import { atom } from "jotai";
import type { groupedWordRecords } from "../type";

export const currentRowDetailAtom = atom<groupedWordRecords | null>(null);
