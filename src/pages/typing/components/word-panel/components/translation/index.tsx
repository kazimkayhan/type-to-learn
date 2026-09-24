import { useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import Tooltip from "@/components/tooltip";
import { SoundIcon } from "@/components/word-pronunciation-icon/sound-icon";
import useSpeech from "@/hooks/use-speech";
import useWordEnrichment from "@/hooks/use-word-enrichment";
import {
  fontSizeConfigAtom,
  isTextSelectableAtom,
  isWordEnrichmentEnabledAtom,
  pronunciationConfigAtom,
} from "@/store";

export interface TranslationProps {
  /** Enables live example-sentence/synonym lookup. Only meaningful for English words. */
  enrichable?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  senses: string[];
  showTrans?: boolean;
  word?: string;
}

const SENSE_SPLIT_PATTERN = /\s*;\s*/;
const PART_OF_SPEECH_PATTERN =
  /^((?:[a-z]{1,8}\.)(?:\s*[/&]\s*[a-z]{1,8}\.)*)\s+(.+)$/i;

interface ParsedSense {
  meaning: string;
  pos: string | null;
}

function splitSenses(senses: string[]): string[] {
  const result: string[] = [];
  for (const sense of senses) {
    const parts = sense
      .split(SENSE_SPLIT_PATTERN)
      .map((part) => part.trim())
      .filter(Boolean);
    result.push(...parts);
  }
  return result;
}

function parseSense(raw: string): ParsedSense {
  const match = raw.match(PART_OF_SPEECH_PATTERN);
  if (!match) {
    return { meaning: raw, pos: null };
  }
  return {
    meaning: match[2].trim(),
    pos: match[1].replaceAll(/\s+/g, ""),
  };
}

export default function Translation({
  senses,
  showTrans = true,
  onMouseEnter,
  onMouseLeave,
  word = "",
  enrichable = false,
}: TranslationProps) {
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom);
  const fontSizeConfig = useAtomValue(fontSizeConfigAtom);
  const isWordEnrichmentEnabled = useAtomValue(isWordEnrichmentEnabledAtom);
  const isShowTransRead =
    window.speechSynthesis && pronunciationConfig.isTransRead;
  const spokenText = useMemo(() => senses.join("; "), [senses]);
  const speechOptions = useMemo(
    () => ({ lang: "en-US", volume: pronunciationConfig.transVolume }),
    [pronunciationConfig.transVolume]
  );
  const { speak, speaking } = useSpeech(spokenText, speechOptions);
  const { enrichment } = useWordEnrichment(
    word,
    enrichable && isWordEnrichmentEnabled
  );

  const handleClickSoundIcon = useCallback(() => {
    speak(true);
  }, [speak]);

  const parsedSenses = useMemo(
    () => splitSenses(senses).map(parseSense),
    [senses]
  );
  const hasPartOfSpeech = parsedSenses.some((sense) => sense.pos);

  const isTextSelectable = useAtomValue(isTextSelectableAtom);
  const fontSize = `min(${fontSizeConfig.translateFont}px, 4.6vw)`;
  const hasEnrichment =
    showTrans &&
    enrichment &&
    (enrichment.example || enrichment.synonyms.length > 0);

  return (
    <div
      className="flex flex-col items-center gap-1.5 px-3 pt-4 pb-3 sm:pt-5 sm:pb-4"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-start justify-center gap-2">
        {showTrans ? (
          <ul
            className={`grid max-w-2xl items-baseline gap-x-2.5 gap-y-1.5 ${
              hasPartOfSpeech
                ? "grid-cols-[auto_minmax(0,max-content)] justify-center"
                : "grid-cols-1 justify-items-center"
            } ${isTextSelectable ? "select-text" : ""}`}
          >
            {parsedSenses.map((sense, index) => {
              const isPrimary = index === 0;
              const meaningClassName = isPrimary
                ? "box-decoration-clone max-w-xl rounded-[0.4em] bg-accent px-2 py-0.5 text-left font-medium text-accent-foreground"
                : "max-w-xl px-2 py-0.5 text-left text-muted-foreground";

              return (
                <li
                  className={
                    hasPartOfSpeech
                      ? "col-span-full grid grid-cols-subgrid items-baseline"
                      : "max-w-full"
                  }
                  key={`${index}-${sense.meaning}`}
                >
                  {hasPartOfSpeech ? (
                    <span
                      className={
                        sense.pos
                          ? "justify-self-end rounded-md bg-muted px-1.5 py-0.5 font-semibold text-[0.7em] text-muted-foreground tracking-wide"
                          : "justify-self-end"
                      }
                      style={{ fontSize }}
                    >
                      {sense.pos ?? ""}
                    </span>
                  ) : null}
                  <span className={meaningClassName} style={{ fontSize }}>
                    {sense.meaning}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <span className="inline-block min-h-[1.5em] w-8" style={{ fontSize }}>
            {"\u00A0"}
          </span>
        )}
        {isShowTransRead && showTrans ? (
          <Tooltip
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer leading-7"
            content="Read definition aloud"
          >
            <SoundIcon
              animated={speaking}
              className="h-5 w-5"
              onClick={handleClickSoundIcon}
            />
          </Tooltip>
        ) : null}
      </div>
      {hasEnrichment && (
        <div
          className={`flex max-w-xl flex-col items-center gap-1.5 ${isTextSelectable ? "select-text" : ""}`}
        >
          {enrichment.example && (
            <p className="text-center text-muted-foreground text-sm italic">
              {"\u201C"}
              {enrichment.example}
              {"\u201D"}
            </p>
          )}
          {enrichment.synonyms.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-muted-foreground text-xs">Synonyms:</span>
              {enrichment.synonyms.map((synonym) => (
                <span
                  className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs"
                  key={synonym}
                >
                  {synonym}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
