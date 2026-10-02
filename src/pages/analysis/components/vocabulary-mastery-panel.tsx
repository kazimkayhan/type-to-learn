import { useCallback, useState } from "react";
import WordStudyDialog from "@/components/word-study-dialog";
import type { IWordMastery } from "@/utils/db/record";
import type { VocabularyAnalytics } from "@/utils/db/word-mastery";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="font-bold text-2xl text-foreground tabular-nums">{value}</p>
      <p className="mt-0.5 text-muted-foreground text-xs">{label}</p>
    </div>
  );
}

export default function VocabularyMasteryPanel({
  data,
  onDataChange,
}: {
  data: VocabularyAnalytics;
  onDataChange?: () => void;
}) {
  const isEmpty = data.tracked === 0;
  const [selected, setSelected] = useState<IWordMastery | null>(null);

  const onMasteryChange = useCallback(
    (updated: IWordMastery) => {
      setSelected(updated);
      onDataChange?.();
    },
    [onDataChange]
  );

  return (
    <div className="mx-0 my-6 space-y-6 rounded-lg bg-card/50 p-4 shadow-[var(--shadow-card)] sm:mx-4 sm:my-8 sm:p-8">
      <div>
        <h2 className="font-semibold text-foreground text-lg sm:text-xl">
          Vocabulary mastery
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Spaced-repetition states from your typing practice (local only).
        </p>
      </div>

      {isEmpty ? (
        <p className="text-muted-foreground text-sm">
          No mastery data yet. Finish a few words in practice or Today&apos;s
          review to start tracking retention.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard label="Tracked" value={data.tracked} />
            <StatCard label="Mastered" value={data.mastered} />
            <StatCard label="Review" value={data.review} />
            <StatCard label="Learning" value={data.learning} />
            <StatCard label="New" value={data.new} />
            <StatCard label="Due today" value={data.due} />
          </div>

          <div>
            <h3 className="font-medium text-base text-foreground">
              Leech words
            </h3>
            <p className="mt-1 text-muted-foreground text-xs">
              Words with repeated failed reviews (2+ lapses). Tap a word to
              study, snooze, or mark mastered.
            </p>
            {data.leeches.length === 0 ? (
              <p className="mt-3 text-muted-foreground text-sm">
                No leeches yet — keep practicing.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
                {data.leeches.map((row) => (
                  <li key={`${row.dict}-${row.word}`}>
                    <button
                      className="flex w-full cursor-pointer flex-wrap items-baseline justify-between gap-2 px-3 py-2.5 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                      onClick={() => setSelected(row)}
                      type="button"
                    >
                      <div className="min-w-0">
                        <span className="font-medium font-mono text-foreground text-sm">
                          {row.word}
                        </span>
                        <span className="ml-2 text-muted-foreground text-xs">
                          {row.dict}
                        </span>
                      </div>
                      <span className="shrink-0 text-muted-foreground text-xs tabular-nums">
                        {row.lapses} lapses · {row.totalWrong} mistakes
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {selected ? (
        <WordStudyDialog
          mastery={selected}
          onClose={() => setSelected(null)}
          onMasteryChange={onMasteryChange}
        />
      ) : null}
    </div>
  );
}
