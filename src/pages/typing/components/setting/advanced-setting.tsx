import { useAtom } from "jotai";
import { useCallback } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  isDariTransVisibleAtom,
  isEnglishTransVisibleAtom,
  isIgnoreCaseAtom,
  isShowAnswerOnHoverAtom,
  isShowPrevAndNextWordAtom,
  isTextSelectableAtom,
  isWordEnrichmentEnabledAtom,
  randomConfigAtom,
} from "@/store";
import styles from "./index.module.css";

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

  return (
    <ScrollArea className="flex-1 select-none overflow-y-auto">
      <div className="h-full w-full px-3">
        <div className={styles.tabContent}>
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
