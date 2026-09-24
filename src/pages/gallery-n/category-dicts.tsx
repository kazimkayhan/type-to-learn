import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { currentDictInfoAtom } from "@/store";
import type { Dictionary } from "@/typings";
import { findCommonValues } from "@/utils";
import DictTagSwitcher from "./dict-tag-switcher";
import DictionaryComponent from "./dictionary-without-cover";

export default function DictionaryGroup({
  category,
  groupedDictsByTag,
}: {
  category: string;
  groupedDictsByTag: Record<string, Dictionary[]>;
}) {
  const tagList = useMemo(
    () => Object.keys(groupedDictsByTag),
    [groupedDictsByTag]
  );
  const [currentTag, setCurrentTag] = useState(
    tagList.length > 0 ? tagList[0] : ""
  );
  const currentDictInfo = useAtomValue(currentDictInfoAtom);

  const dictionaryCount = useMemo(() => {
    const ids = new Set<string>();
    for (const dicts of Object.values(groupedDictsByTag)) {
      for (const dict of dicts) {
        ids.add(dict.id);
      }
    }
    return ids.size;
  }, [groupedDictsByTag]);

  const onChangeCurrentTag = useCallback((tag: string) => {
    setCurrentTag(tag);
  }, []);

  // Keep the selected tag valid whenever the tag list changes (e.g. search
  // filtering); don't touch it if the current selection is still valid, so
  // a manual tag click survives unrelated re-filters.
  useEffect(() => {
    if (tagList.length === 0) {
      setCurrentTag("");
      return;
    }
    setCurrentTag((prev) => (tagList.includes(prev) ? prev : tagList[0]));
  }, [tagList]);

  // Auto-follow the actively-practiced dictionary's tag only when the
  // practiced dictionary itself changes - not on every tagList identity
  // change - so switching dictionaries still jumps to the right tag without
  // fighting a manual tag selection on every search keystroke.
  useEffect(() => {
    const commonTags = findCommonValues(tagList, currentDictInfo.tags);
    if (commonTags.length > 0) {
      setCurrentTag(commonTags[0]);
    }
  }, [currentDictInfo.tags]);

  const visibleDicts =
    currentTag && groupedDictsByTag[currentTag]
      ? groupedDictsByTag[currentTag]
      : [];

  return (
    <section className="w-full min-w-0">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2 sm:mb-5">
        <h2 className="font-semibold text-foreground text-lg sm:text-xl">
          {category}
        </h2>
        {dictionaryCount > 0 && (
          <p className="text-muted-foreground text-xs tabular-nums sm:text-sm">
            {dictionaryCount}{" "}
            {dictionaryCount === 1 ? "dictionary" : "dictionaries"}
          </p>
        )}
      </div>
      <DictTagSwitcher
        currentTag={currentTag}
        onChangeCurrentTag={onChangeCurrentTag}
        tagList={tagList}
      />
      <div className="mt-6 grid w-full dic3:grid-cols-3 dic4:grid-cols-4 grid-cols-1 gap-4 px-0 pb-2 sm:mt-8 sm:gap-6 md:grid-cols-2">
        {visibleDicts.length > 0 ? (
          visibleDicts.map((dict) => (
            <DictionaryComponent dictionary={dict} key={dict.id} />
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            No dictionaries available in this category
          </div>
        )}
      </div>
    </section>
  );
}
