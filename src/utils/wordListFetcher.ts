import type { Word } from "@/typings";
import { PUBLIC_BASE } from "@/utils";

export async function wordListFetcher(url: string): Promise<Word[]> {
  const response = await fetch(PUBLIC_BASE + url);
  const words: Word[] = await response.json();
  return words;
}
