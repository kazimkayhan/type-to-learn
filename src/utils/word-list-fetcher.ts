import type { Word } from "@/typings";
import { PUBLIC_BASE } from "@/utils";
import { getCustomList, parseCustomListUrl } from "@/utils/db/custom-lists";

export async function wordListFetcher(url: string): Promise<Word[]> {
  const customId = parseCustomListUrl(url);
  if (customId) {
    const list = await getCustomList(customId);
    return list?.words ?? [];
  }

  const response = await fetch(PUBLIC_BASE + url);
  const words: Word[] = await response.json();
  return words;
}
