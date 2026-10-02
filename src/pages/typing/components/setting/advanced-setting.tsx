import { useAtom } from "jotai";
import { useCallback } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  dailyReviewConfigAtom,
  isDariTransVisibleAtom,
  isEnglishTransVisibleAtom,
  isIgnoreCaseAtom,
  isShowAnswerOnHoverAtom,
  isShowPrevAndNextWordAtom,
  isTextSelectableAtom,
  isWordEnrichmentEnabledAtom,
  randomConfigAtom,
  recallModeConfigAtom,
  srsConfigAtom,
  timedPracticeConfigAtom,
} from "@/store";
import type { RecallMode } from "@/typings";
import styles from "./index.module.css";

function sliderValue(value: number | readonly number[]): number {
  if (typeof value === "number") {
    return value;
  }
  return value[0] ?? 0;
}

const RECALL_MODE_OPTIONS: { label: string; value: RecallMode }[] = [
  { label: "Classic (see word, type it)", value: "classic" },
  { label: "Definition → type spelling", value: "definition" },
  { label: "Audio → type spelling", value: "audio" },
  { label: "Cloze (fill blank in example)", value: "cloze" },
  { label: "Rotate modes each word", value: "rotate" },
];

const TIMED_PRESETS = [5, 10, 15, 20] as const;

export default function AdvancedSetting() {
  const [randomConfig, setRandomConfig] = useAtom(randomConfigAtom);
  const [isShowPrevAndNextWord, setIsShowPrevAndNextWord] = useAtom(
    isShowPrevAndNextWordAtom
  );
  const [isIgnoreCase, setIsIgnoreCase] = useAtom(isIgnoreCaseAtom);
  const [isTextSelectable, setIsTextSelectable] = useAtom(isTextSelectableAtom);
  const [isShowAnswerOnHover, setIsShowAnswerOnHover] = useAtom(
    isShowAnswerOnHoverAtom
  );
  const [isWordEnrichmentEnabled, setIsWordEnrichmentEnabled] = useAtom(
    isWordEnrichmentEnabledAtom
  );
  const [isDariTransVisible, setIsDariTransVisible] = useAtom(
    isDariTransVisibleAtom
  );
  const [isEnglishTransVisible, setIsEnglishTransVisible] = useAtom(
    isEnglishTransVisibleAtom
  );
  const [recallModeConfig, setRecallModeConfig] = useAtom(recallModeConfigAtom);
  const [dailyReviewConfig, setDailyReviewConfig] = useAtom(
    dailyReviewConfigAtom
  );
  const [timedPracticeConfig, setTimedPracticeConfig] = useAtom(
    timedPracticeConfigAtom
  );
  const [srsConfig, setSrsConfig] = useAtom(srsConfigAtom);

  const onToggleDariTrans = useCallback(
    (checked: boolean) => {
      setIsDariTransVisible(checked);
    },
    [setIsDariTransVisible]
  );

  const onToggleEnglishTrans = useCallback(
    (checked: boolean) => {
      setIsEnglishTransVisible(checked);
    },
    [setIsEnglishTransVisible]
  );

  const onToggleRandom = useCallback(
    (checked: boolean) => {
      setRandomConfig((prev) => ({
        ...prev,
        isOpen: checked,
      }));
    },
    [setRandomConfig]
  );

  const onToggleLastAndNextWord = useCallback(
    (checked: boolean) => {
      setIsShowPrevAndNextWord(checked);
    },
    [setIsShowPrevAndNextWord]
  );

  const onToggleIgnoreCase = useCallback(
    (checked: boolean) => {
      setIsIgnoreCase(checked);
    },
    [setIsIgnoreCase]
  );

  const onToggleTextSelectable = useCallback(
    (checked: boolean) => {
      setIsTextSelectable(checked);
    },
    [setIsTextSelectable]
  );
  const onToggleShowAnswerOnHover = useCallback(
    (checked: boolean) => {
      setIsShowAnswerOnHover(checked);
    },
    [setIsShowAnswerOnHover]
  );
  const onToggleWordEnrichment = useCallback(
    (checked: boolean) => {
      setIsWordEnrichmentEnabled(checked);
    },
    [setIsWordEnrichmentEnabled]
  );

  const onChangeRecallMode = useCallback(
    (value: string | null) => {
      if (!value) {
        return;
      }
      setRecallModeConfig((prev) => ({
        ...prev,
        mode: value as RecallMode,
      }));
    },
    [setRecallModeConfig]
  );

  const onChangeMaxDue = useCallback(
    (value: number | readonly number[]) => {
      const next = sliderValue(value);
      setDailyReviewConfig((prev) => ({ ...prev, maxDue: next }));
    },
    [setDailyReviewConfig]
  );

  const onChangeMaxNew = useCallback(
    (value: number | readonly number[]) => {
      const next = sliderValue(value);
      setDailyReviewConfig((prev) => ({ ...prev, maxNew: next }));
    },
    [setDailyReviewConfig]
  );

  const onToggleTimed = useCallback(
    (checked: boolean) => {
      setTimedPracticeConfig((prev) => ({ ...prev, enabled: checked }));
    },
    [setTimedPracticeConfig]
  );

  const onChangeTimedDuration = useCallback(
    (value: string | null) => {
      if (!value) {
        return;
      }
      const minutes = Number(value);
      if (!Number.isFinite(minutes) || minutes <= 0) {
        return;
      }
      setTimedPracticeConfig((prev) => ({
        ...prev,
        durationMinutes: minutes,
      }));
    },
    [setTimedPracticeConfig]
  );

  const onChangeScheduler = useCallback(
    (value: string | null) => {
      if (value !== "sm2" && value !== "fsrs") {
        return;
      }
      setSrsConfig((prev) => ({ ...prev, algorithm: value }));
    },
    [setSrsConfig]
  );

  return (
    <ScrollArea className="flex-1 select-none overflow-y-auto">
      <div className="h-full w-full px-3">
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Recall mode</span>
            <span className={styles.sectionDescription}>
              Change what you see before typing. Definition and audio hide the
              spelling so you recall from meaning or sound.
            </span>
            <div className={styles.block}>
              <Select
                onValueChange={onChangeRecallMode}
                value={recallModeConfig.mode}
              >
                <SelectTrigger className="w-full max-w-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RECALL_MODE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Spaced repetition</span>
            <span className={styles.sectionDescription}>
              FSRS (recommended) schedules reviews from your typing outcomes.
              SM-2 is the classic simpler fallback.
            </span>
            <div className={styles.block}>
              <Select
                onValueChange={onChangeScheduler}
                value={srsConfig.algorithm}
              >
                <SelectTrigger className="w-full max-w-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fsrs">FSRS (recommended)</SelectItem>
                  <SelectItem value="sm2">SM-2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Timed practice</span>
            <span className={styles.sectionDescription}>
              End the session automatically when the countdown reaches zero —
              useful for short exam-style drills.
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={timedPracticeConfig.enabled}
                onCheckedChange={onToggleTimed}
              />
              <span className="text-right font-normal text-muted-foreground text-xs leading-tight">{`Timed mode ${
                timedPracticeConfig.enabled ? "on" : "off"
              }`}</span>
            </div>
            {timedPracticeConfig.enabled ? (
              <div className={styles.block}>
                <span className={styles.blockLabel}>Duration</span>
                <Select
                  onValueChange={onChangeTimedDuration}
                  value={String(timedPracticeConfig.durationMinutes)}
                >
                  <SelectTrigger className="w-full max-w-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMED_PRESETS.map((minutes) => (
                      <SelectItem key={minutes} value={String(minutes)}>
                        {minutes} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              Today&apos;s review size
            </span>
            <span className={styles.sectionDescription}>
              Caps for the Today queue: due reviews first, then new words from
              the current chapter.
            </span>
            <div className={styles.block}>
              <span className={styles.blockLabel}>Max due words</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider
                  className="slider"
                  max={50}
                  min={5}
                  onValueChange={onChangeMaxDue}
                  step={1}
                  value={[dailyReviewConfig.maxDue]}
                />
                <span className="ml-4 w-10 font-normal text-muted-foreground text-xs">
                  {dailyReviewConfig.maxDue}
                </span>
              </div>
            </div>
            <div className={styles.block}>
              <span className={styles.blockLabel}>Max new words</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider
                  className="slider"
                  max={30}
                  min={0}
                  onValueChange={onChangeMaxNew}
                  step={1}
                  value={[dailyReviewConfig.maxNew]}
                />
                <span className="ml-4 w-10 font-normal text-muted-foreground text-xs">
                  {dailyReviewConfig.maxNew}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Definition languages</span>
            <span className={styles.sectionDescription}>
              Choose which meanings appear under each word. Dari is shown above
              the English definition.
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={isDariTransVisible}
                onCheckedChange={onToggleDariTrans}
              />
              <span className="text-right font-normal text-muted-foreground text-xs leading-tight">{`Dari meaning ${
                isDariTransVisible ? "on" : "off"
              }`}</span>
            </div>
            <div className={styles.switchBlock}>
              <Switch
                checked={isEnglishTransVisible}
                onCheckedChange={onToggleEnglishTrans}
              />
              <span className="text-right font-normal text-muted-foreground text-xs leading-tight">{`English definition ${
                isEnglishTransVisible ? "on" : "off"
              }`}</span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Shuffle chapters</span>
            <span className={styles.sectionDescription}>
              When enabled, words in each chapter will be randomly shuffled.
              Takes effect on the next chapter.
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={randomConfig.isOpen}
                onCheckedChange={onToggleRandom}
              />
              <span className="text-right font-normal text-muted-foreground text-xs leading-tight">{`Shuffle ${
                randomConfig.isOpen ? "on" : "off"
              }`}</span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              Show previous/next word during practice
            </span>
            <span className={styles.sectionDescription}>
              When enabled, the previous and next words are shown above during
              practice
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={isShowPrevAndNextWord}
                onCheckedChange={onToggleLastAndNextWord}
              />
              <span className="text-right font-normal text-muted-foreground text-xs leading-tight">{`Word preview ${
                isShowPrevAndNextWord ? "on" : "off"
              }`}</span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Ignore case</span>
            <span className={styles.sectionDescription}>
              When enabled, input is case-insensitive — e.g. both
              &quot;hello&quot; and &quot;Hello&quot; are accepted
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={isIgnoreCase}
                onCheckedChange={onToggleIgnoreCase}
              />
              <span className="text-right font-normal text-muted-foreground text-xs leading-tight">{`Ignore case ${
                isIgnoreCase ? "on" : "off"
              }`}</span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Allow text selection</span>
            <span className={styles.sectionDescription}>
              When enabled, text can be selected with the mouse
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={isTextSelectable}
                onCheckedChange={onToggleTextSelectable}
              />
              <span className="text-right font-normal text-muted-foreground text-xs leading-tight">{`Text selection ${
                isTextSelectable ? "on" : "off"
              }`}</span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              Show hints in dictation mode
            </span>
            <span className={styles.sectionDescription}>
              When enabled, hover over a word to reveal the correct answer
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={isShowAnswerOnHover}
                onCheckedChange={onToggleShowAnswerOnHover}
              />
              <span className="text-right font-normal text-muted-foreground text-xs leading-tight">{`Hints ${
                isShowAnswerOnHover ? "on" : "off"
              }`}</span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              Example sentences and synonyms
            </span>
            <span className={styles.sectionDescription}>
              For English words, look up a live example sentence and synonyms
              from a free dictionary service and show them under the definition
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={isWordEnrichmentEnabled}
                onCheckedChange={onToggleWordEnrichment}
              />
              <span className="text-right font-normal text-muted-foreground text-xs leading-tight">{`Examples & synonyms ${
                isWordEnrichmentEnabled ? "on" : "off"
              }`}</span>
            </div>
          </div>
        </div>
      </div>
      <ScrollBar
        className="flex touch-none select-none bg-transparent"
        orientation="vertical"
      />
    </ScrollArea>
  );
}
