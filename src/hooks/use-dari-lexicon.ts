import { useAtomValue } from "jotai";
import useSWRImmutable from "swr/immutable";
import { isDariTransVisibleAtom } from "@/store";
import { PUBLIC_BASE } from "@/utils";

const LEXICON_URL = "/dari/lexicon.json";

interface DariLexicon {
  lang: string;
  version: number;
  words: Record<string, string[]>;
}

async function lexiconFetcher(url: string): Promise<DariLexicon> {
  const response = await fetch(PUBLIC_BASE + url);
  if (!response.ok) {
    throw new Error(`Failed to load Dari lexicon: ${response.status}`);
  }
  return response.json();
}

/**
 * Shared English→Dari lexicon. One entry per English word, reused by every
 * dictionary, so a word only has to be translated once for the whole app.
 * Nothing is fetched while the Dari setting is off.
 */
export default function useDariLexicon() {
  const isDariTransVisible = useAtomValue(isDariTransVisibleAtom);
  const { data } = useSWRImmutable(
    isDariTransVisible ? LEXICON_URL : null,
    lexiconFetcher
  );

  const lookup = (word: string): string[] | undefined =>
    data?.words[word.toLowerCase().trim()];

  return { isDariTransVisible, lookup };
}
