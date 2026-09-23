import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { currentDictInfoAtom } from "@/store";
import type { Dictionary } from "@/typings";
import { findCommonValues } from "@/utils";
import DictTagSwitcher from "./dict-tag-switcher";
import DictionaryComponent from "./dictionary-without-cover";

export default function DictionaryGroup({
  groupedDictsByTag,
}: {
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

  const onChangeCurrentTag = useCallback((tag: string) => {
    setCurrentTag(tag);
  }, []);

  useEffect(() => {
    const commonTags = findCommonValues(tagList, currentDictInfo.tags);
    if (commonTags.length > 0) {
      setCurrentTag(commonTags[0]);
    }
  }, [currentDictInfo.tags, tagList]);

  return (
    <section className="w-full min-w-0">
      <DictTagSwitcher
        currentTag={currentTag}
        onChangeCurrentTag={onChangeCurrentTag}
        tagList={tagList}
      />
      <div className="mt-6 grid w-full dic3:grid-cols-3 dic4:grid-cols-4 grid-cols-1 gap-4 px-0 pb-2 sm:mt-8 sm:gap-6 md:grid-cols-2">
        {currentTag && groupedDictsByTag[currentTag] ? (
          groupedDictsByTag[currentTag].map((dict) => (
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
