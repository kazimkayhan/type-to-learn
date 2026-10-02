import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import WordStudyDialog from "@/components/word-study-dialog";
import LineCharts from "@/pages/analysis/components/line-charts";
import { buildPracticeFromWordKeys } from "@/pages/error-book/build-practice-weak";
import {
  currentChapterAtom,
  currentDictIdAtom,
  customDictionariesAtom,
  reviewModeInfoAtom,
  todaySessionAtom,
} from "@/store";
import type { IWordMastery } from "@/utils/db/record";
import type { VocabularyDeepAnalytics } from "@/utils/db/vocabulary-analytics";

function StatCard({
  label,
  value,
  hint,
}: {
  hint?: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="font-bold text-2xl text-foreground tabular-nums">{value}</p>
      <p className="mt-0.5 text-muted-foreground text-xs">{label}</p>
      {hint ? (
        <p className="mt-1 text-[11px] text-muted-foreground/80">{hint}</p>
      ) : null}
    </div>
  );
}

function formatAvgTime(ms: number): string {
  if (ms <= 0) {
    return "—";
  }
  if (ms < 1000) {
    return `${ms} ms`;
  }
  return `${(ms / 1000).toFixed(1)} s`;
}

export default function VocabularyMasteryPanel({
  data,
  onDataChange,
}: {
  data: VocabularyDeepAnalytics;
  onDataChange?: () => void;
}) {
  const navigate = useNavigate();
  const isEmpty = data.tracked === 0;
  const [selected, setSelected] = useState<IWordMastery | null>(null);
  const [practiceStarting, setPracticeStarting] = useState(false);
  const customDictionaries = useAtomValue(customDictionariesAtom);
  const setTodaySession = useSetAtom(todaySessionAtom);
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom);
  const setCurrentDictId = useSetAtom(currentDictIdAtom);
  const setCurrentChapter = useSetAtom(currentChapterAtom);
  const { weekly } = data;
  const hasPracticeWindow =
    data.firstTryByDay.some(([, value]) => value > 0) ||
    data.uniqueWordsByDay.some(([, value]) => value > 0);

  const onMasteryChange = useCallback(
    (updated: IWordMastery) => {
      setSelected(updated);
      onDataChange?.();
    },
    [onDataChange]
  );

  const onPracticeLeeches = useCallback(async () => {
    if (data.leeches.length === 0 || practiceStarting) {
      return;
    }
    setPracticeStarting(true);
    try {
      const session = await buildPracticeFromWordKeys(
        data.leeches,
        customDictionaries
      );
      if (!session) {
        toast.error("Could not build a practice session from these leeches.");
        return;
      }
      setReviewModeInfo({ isReviewMode: false, reviewRecord: undefined });
      setCurrentDictId(session.dictId);
      setCurrentChapter(-1);
      setTodaySession({ active: true, words: session.words });
      toast.success(
        `Practicing ${session.words.length} leech word${session.words.length === 1 ? "" : "s"}`
      );
      navigate("/");
    } catch {
      toast.error("Failed to start leech practice.");
    } finally {
      setPracticeStarting(false);
    }
  }, [
    customDictionaries,
    data.leeches,
    navigate,
    practiceStarting,
    setCurrentChapter,
    setCurrentDictId,
    setReviewModeInfo,
    setTodaySession,
  ]);

  const maxBucket = Math.max(
    1,
    ...data.timeBuckets.map((bucket) => bucket.count)
  );

  return (
    <div className="mx-0 my-6 space-y-6 rounded-lg bg-card/50 p-4 shadow-[var(--shadow-card)] sm:mx-4 sm:my-8 sm:p-8">
      <div>
        <h2 className="font-semibold text-foreground text-lg sm:text-xl">
          Vocabulary mastery
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Retention from spaced repetition and your recent typing practice
          (local only).
        </p>
      </div>

      <section className="space-y-3 rounded-xl border border-border/60 bg-card p-4">
        <div>
          <h3 className="font-medium text-base text-foreground">This week</h3>
          <p className="mt-0.5 text-muted-foreground text-xs">
            {weekly.startDate} → {weekly.endDate}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <StatCard label="Words practiced" value={weekly.wordsPracticed} />
          <StatCard label="Unique words" value={weekly.uniqueWords} />
          <StatCard
            hint="Correct on first try"
            label="First-try rate"
            value={`${weekly.firstTryRate}%`}
          />
          <StatCard label="Newly mastered" value={weekly.newlyMastered} />
          <StatCard label="Still due" value={weekly.dueNow} />
          <StatCard label="Leeches" value={weekly.leechCount} />
          <StatCard
            label="Avg. type time"
            value={formatAvgTime(weekly.avgTimeMs)}
          />
          <StatCard
            hint="Across tracked words"
            label="Avg. SRS interval"
            value={data.avgIntervalDays > 0 ? `${data.avgIntervalDays}d` : "—"}
          />
        </div>
      </section>

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

          {hasPracticeWindow ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="h-64 overflow-hidden rounded-xl bg-card p-3 shadow-[var(--shadow-card)] sm:h-72">
                <LineCharts
                  data={data.firstTryByDay}
                  name="First-try %"
                  suffix="%"
                  title="First-try retention (30 days)"
                />
              </div>
              <div className="h-64 overflow-hidden rounded-xl bg-card p-3 shadow-[var(--shadow-card)] sm:h-72">
                <LineCharts
                  data={data.uniqueWordsByDay}
                  name="Unique words"
                  title="Unique words practiced (30 days)"
                />
              </div>
              <div className="h-64 overflow-hidden rounded-xl bg-card p-3 shadow-[var(--shadow-card)] sm:h-72 lg:col-span-2">
                <LineCharts
                  data={data.masteredByDay}
                  name="Mastered (approx.)"
                  title="Mastered words over time (30 days)"
                />
              </div>
            </div>
          ) : null}

          <div>
            <h3 className="font-medium text-base text-foreground">
              Time to type
            </h3>
            <p className="mt-1 text-muted-foreground text-xs">
              How long correct attempts take over the past 30 days
              {data.firstTryOverall > 0
                ? ` · overall first-try ${data.firstTryOverall}%`
                : ""}
              .
            </p>
            {data.timeBuckets.every((bucket) => bucket.count === 0) ? (
              <p className="mt-3 text-muted-foreground text-sm">
                No recent timing data yet.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {data.timeBuckets.map((bucket) => (
                  <li
                    className="flex items-center gap-3 text-sm"
                    key={bucket.label}
                  >
                    <span className="w-12 shrink-0 text-muted-foreground tabular-nums">
                      {bucket.label}
                    </span>
                    <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.round((bucket.count / maxBucket) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right text-foreground tabular-nums">
                      {bucket.count}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-medium text-base text-foreground">
                  Leech words
                </h3>
                <p className="mt-1 text-muted-foreground text-xs">
                  Words with repeated failed reviews (2+ lapses). Tap a word to
                  study, snooze, or mark mastered.
                </p>
              </div>
              {data.leeches.length > 0 ? (
                <Button
                  disabled={practiceStarting}
                  onClick={onPracticeLeeches}
                  size="sm"
                  variant="secondary"
                >
                  {practiceStarting
                    ? "Starting…"
                    : `Practice leeches (${data.leeches.length})`}
                </Button>
              ) : null}
            </div>
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
