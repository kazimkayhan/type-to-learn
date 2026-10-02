import useWordEnrichment, {
  buildClozePrompt,
} from "@/hooks/use-word-enrichment";
import type { EffectiveRecallMode } from "@/utils/srs/recall-mode";
import { recallModeLabel } from "@/utils/srs/recall-mode";

export function useClozePrompt(
  wordName: string | undefined,
  recallMode: EffectiveRecallMode,
  isEnglishDict: boolean
) {
  const clozeEnabled = recallMode === "cloze" && isEnglishDict;
  const { enrichment, isLoading } = useWordEnrichment(
    wordName ?? "",
    clozeEnabled
  );
  const clozePrompt = clozeEnabled
    ? buildClozePrompt(wordName ?? "", enrichment?.example)
    : null;
  const clozeFallbackToDefinition = clozeEnabled && !isLoading && !clozePrompt;

  return {
    clozeEnabled,
    clozeFallbackToDefinition,
    clozeLoading: isLoading,
    clozePrompt,
    displayRecallMode: clozeFallbackToDefinition
      ? ("definition" as const)
      : recallMode,
  };
}

export function ClozeRecallChrome({
  clozeEnabled,
  clozeFallbackToDefinition,
  clozeLoading,
  clozePrompt,
  displayRecallMode,
}: {
  clozeEnabled: boolean;
  clozeFallbackToDefinition: boolean;
  clozeLoading: boolean;
  clozePrompt: string | null;
  displayRecallMode: EffectiveRecallMode;
}) {
  return (
    <>
      {displayRecallMode !== "classic" && (
        <p className="mb-2 rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground text-xs">
          {clozeFallbackToDefinition
            ? "Definition → type (no example)"
            : recallModeLabel(displayRecallMode)}
        </p>
      )}
      {clozeEnabled && !clozeFallbackToDefinition && (
        <p
          aria-live="polite"
          className="mb-3 max-w-xl text-center text-base text-foreground italic leading-relaxed sm:text-lg"
        >
          {clozeLoading && !clozePrompt
            ? "Loading example sentence…"
            : clozePrompt}
        </p>
      )}
      {clozeEnabled && clozeLoading && !clozePrompt ? (
        <p className="mb-2 text-center text-muted-foreground text-xs">
          Looking up an example for this word…
        </p>
      ) : null}
    </>
  );
}
