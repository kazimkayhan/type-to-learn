import { useAtomValue, useSetAtom } from "jotai";
import type { ElementType } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WordPronunciationIconRef } from "@/components/word-pronunciation-icon";
import { WordPronunciationIcon } from "@/components/word-pronunciation-icon";
import Phonetic from "@/pages/typing/components/word-panel/components/phonetic";
import Letter from "@/pages/typing/components/word-panel/components/word/letter";
import {
  currentChapterAtom,
  currentDictIdAtom,
  customDictionariesAtom,
  refreshCustomDictionaries,
  reviewModeInfoAtom,
  todaySessionAtom,
} from "@/store";
import type { Word } from "@/typings";
import { timeStamp2String } from "@/utils";
import { addWordToCustomList, createCustomList } from "@/utils/db/custom-lists";
import type { IWordMastery } from "@/utils/db/record";
import {
  getMastery,
  LEECH_LAPSES_THRESHOLD,
  markWordMastered,
  snoozeWord,
} from "@/utils/db/word-mastery";
import { findDictionary } from "@/utils/dictionary-lookup";
import HashtagIcon from "~icons/heroicons/chart-pie-20-solid";
import CheckCircle from "~icons/heroicons/check-circle-20-solid";
import ClockIcon from "~icons/heroicons/clock-20-solid";
import XCircle from "~icons/heroicons/x-circle-20-solid";

export interface WordStudySheetStats {
  avgTimeSec?: string;
  correctCount?: number;
  sessionCount?: number;
  wrongCount?: number;
}

interface WordStudySheetProps {
  dictId: string;
  onClose?: () => void;
  onMasteryChange?: (mastery: IWordMastery) => void;
  stats?: WordStudySheetStats;
  word: Word;
}

function stateLabel(state: IWordMastery["state"]): string {
  switch (state) {
    case "mastered":
      return "Mastered";
    case "review":
      return "Review";
    case "learning":
      return "Learning";
    default:
      return "New";
  }
}

export default function WordStudySheet({
  dictId,
  word,
  stats,
  onClose,
  onMasteryChange,
}: WordStudySheetProps) {
  const navigate = useNavigate();
  const setTodaySession = useSetAtom(todaySessionAtom);
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom);
  const setCurrentDictId = useSetAtom(currentDictIdAtom);
  const setCurrentChapter = useSetAtom(currentChapterAtom);
  const customDictionaries = useAtomValue(customDictionariesAtom);
  const setCustomDictionaries = useSetAtom(customDictionariesAtom);
  const dictInfo = findDictionary(dictId, customDictionaries);
  const [mastery, setMastery] = useState<IWordMastery | null>(null);
  const [busy, setBusy] = useState(false);
  const [newListOpen, setNewListOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const pronunciationRef = useRef<WordPronunciationIconRef | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMastery(dictId, word.name).then((row) => {
      if (!cancelled) {
        setMastery(row ?? null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [dictId, word.name]);

  const refreshMastery = useCallback(
    (next: IWordMastery) => {
      setMastery(next);
      onMasteryChange?.(next);
    },
    [onMasteryChange]
  );

  const onMarkMastered = useCallback(async () => {
    setBusy(true);
    try {
      const next = await markWordMastered(dictId, word.name);
      refreshMastery(next);
    } finally {
      setBusy(false);
    }
  }, [dictId, refreshMastery, word.name]);

  const onSnooze = useCallback(async () => {
    setBusy(true);
    try {
      const next = await snoozeWord(dictId, word.name, 7);
      refreshMastery(next);
    } finally {
      setBusy(false);
    }
  }, [dictId, refreshMastery, word.name]);

  const onPracticeNow = useCallback(() => {
    setReviewModeInfo({ isReviewMode: false, reviewRecord: undefined });
    setCurrentDictId(dictId);
    setCurrentChapter(-1);
    setTodaySession({ active: true, words: [word] });
    onClose?.();
    navigate("/");
  }, [
    dictId,
    navigate,
    onClose,
    setCurrentChapter,
    setCurrentDictId,
    setReviewModeInfo,
    setTodaySession,
    word,
  ]);

  const onAddToList = useCallback(
    async (listId: string) => {
      setBusy(true);
      try {
        await addWordToCustomList(listId, word);
        await refreshCustomDictionaries(setCustomDictionaries);
        const listName =
          customDictionaries.find((dict) => dict.id === listId)?.name ?? "list";
        toast.success(`Added to ${listName}`);
      } catch {
        toast.error("Could not add word to list");
      } finally {
        setBusy(false);
      }
    },
    [customDictionaries, setCustomDictionaries, word]
  );

  const onOpenNewList = useCallback(() => {
    setNewListName(word.name);
    setNewListOpen(true);
  }, [word.name]);

  const onCreateListWithWord = useCallback(async () => {
    const trimmed = newListName.trim();
    if (!trimmed) {
      toast.error("Enter a list name");
      return;
    }
    setBusy(true);
    try {
      await createCustomList({
        name: trimmed,
        words: [word],
      });
      await refreshCustomDictionaries(setCustomDictionaries);
      setNewListOpen(false);
      toast.success("List created with this word");
    } catch {
      toast.error("Could not create list");
    } finally {
      setBusy(false);
    }
  }, [newListName, setCustomDictionaries, word]);

  const isLeech = useMemo(
    () => mastery !== null && mastery.lapses >= LEECH_LAPSES_THRESHOLD,
    [mastery]
  );

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-2">
        <div className="flex max-w-full flex-wrap justify-center">
          {word.name.split("").map((letter, index) => (
            <Letter
              key={`${index}-${letter}`}
              letter={letter}
              state="normal"
              visible
            />
          ))}
        </div>
        <div className="relative flex h-8 items-center">
          <Phonetic word={word} />
          {dictInfo ? (
            <WordPronunciationIcon
              className="absolute top-1/2 -right-7 h-5 w-5 -translate-y-1/2"
              lang={dictInfo.language}
              ref={pronunciationRef}
              word={word}
            />
          ) : null}
        </div>
        {word.trans.length > 0 ? (
          <p className="max-w-sm text-center font-sans text-foreground text-sm leading-relaxed">
            {word.trans.join("; ")}
          </p>
        ) : null}
        {mastery ? (
          <p className="text-muted-foreground text-xs">
            {stateLabel(mastery.state)}
            {isLeech ? " · Leech" : ""}
            {mastery.lastReview > 0
              ? ` · last ${timeStamp2String(mastery.lastReview)}`
              : ""}
            {mastery.due > 0 ? ` · due ${timeStamp2String(mastery.due)}` : ""}
          </p>
        ) : (
          <p className="text-muted-foreground text-xs">Not tracked yet</p>
        )}
      </div>

      {(stats?.avgTimeSec ||
        stats?.sessionCount !== undefined ||
        stats?.correctCount !== undefined ||
        stats?.wrongCount !== undefined) && (
        <div className="grid w-full grid-cols-2 gap-2 sm:gap-3">
          {stats.avgTimeSec === undefined ? null : (
            <StatChip
              icon={ClockIcon}
              label="Avg. time"
              value={stats.avgTimeSec}
            />
          )}
          {stats.sessionCount === undefined ? null : (
            <StatChip
              icon={HashtagIcon}
              label="Sessions"
              value={String(stats.sessionCount)}
            />
          )}
          {stats.correctCount === undefined ? null : (
            <StatChip
              icon={CheckCircle}
              label="Correct"
              value={String(stats.correctCount)}
            />
          )}
          {stats.wrongCount === undefined ? null : (
            <StatChip
              icon={XCircle}
              label="Mistakes"
              value={String(stats.wrongCount)}
            />
          )}
        </div>
      )}

      {mastery ? (
        <div className="grid w-full grid-cols-2 gap-2 text-center text-muted-foreground text-xs sm:grid-cols-4">
          <div>
            <p className="font-semibold text-foreground tabular-nums">
              {mastery.reps}
            </p>
            <p>Reviews</p>
          </div>
          <div>
            <p className="font-semibold text-foreground tabular-nums">
              {mastery.lapses}
            </p>
            <p>Lapses</p>
          </div>
          <div>
            <p className="font-semibold text-foreground tabular-nums">
              {mastery.totalWrong}
            </p>
            <p>Mistakes</p>
          </div>
          <div>
            <p className="font-semibold text-foreground tabular-nums">
              {mastery.intervalDays}d
            </p>
            <p>Interval</p>
          </div>
        </div>
      ) : null}

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
        <Button
          className="w-full sm:w-auto"
          disabled={busy}
          onClick={onPracticeNow}
          size="sm"
        >
          Practice now
        </Button>
        <Button
          className="w-full sm:w-auto"
          disabled={busy || mastery?.state === "mastered"}
          onClick={onMarkMastered}
          size="sm"
          variant="secondary"
        >
          Mark mastered
        </Button>
        <Button
          className="w-full sm:w-auto"
          disabled={busy}
          onClick={onSnooze}
          size="sm"
          variant="outline"
        >
          Snooze 7 days
        </Button>
      </div>

      <div className="flex w-full flex-col gap-2">
        <p className="text-center text-muted-foreground text-xs">Add to list</p>
        <div className="flex flex-wrap justify-center gap-2">
          {customDictionaries.map((list) => (
            <Button
              disabled={busy}
              key={list.id}
              onClick={() => onAddToList(list.id)}
              size="sm"
              type="button"
              variant="ghost"
            >
              {list.name}
            </Button>
          ))}
          <Button
            disabled={busy}
            onClick={onOpenNewList}
            size="sm"
            type="button"
            variant="outline"
          >
            New list…
          </Button>
        </div>
      </div>

      <Dialog onOpenChange={setNewListOpen} open={newListOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New list</DialogTitle>
            <DialogDescription>
              Create a custom list that starts with “{word.name}”.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-1.5 py-2">
            <Label htmlFor="study-sheet-new-list">List name</Label>
            <Input
              autoFocus
              id="study-sheet-new-list"
              onChange={(event) => setNewListName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onCreateListWithWord();
                }
              }}
              value={newListName}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => setNewListOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={busy}
              onClick={onCreateListWithWord}
              type="button"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md bg-muted px-3 py-2">
      <span className="flex items-center gap-1 text-muted-foreground text-xs">
        <Icon className="size-3.5" />
        {label}
      </span>
      <span className="font-medium text-foreground text-sm tabular-nums">
        {value}
      </span>
    </div>
  );
}
