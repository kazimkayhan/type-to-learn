import type React from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import PageShell from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dictionaries } from "@/resources/dictionary";
import type { Dictionary } from "@/typings";
import groupBy, { groupByDictTags } from "@/utils/group-by";
import IconMagnifyingGlass from "~icons/heroicons/magnifying-glass-solid";
import IconXMark from "~icons/heroicons/x-mark-solid";
import IconInfo from "~icons/ic/outline-info";
import DictionaryGroup from "./category-dicts";
import CustomListsSection from "./custom-lists-section";
import DictRequest from "./dict-request";

function matchesDictionary(dict: Dictionary, query: string): boolean {
  const haystack = [
    dict.name,
    dict.description,
    dict.category,
    dict.id,
    ...dict.tags,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export default function GalleryPage() {
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const trimmedQuery = query.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();

  const filteredDictionaries = useMemo(() => {
    if (!normalizedQuery) {
      return dictionaries;
    }
    return dictionaries.filter((dict) =>
      matchesDictionary(dict, normalizedQuery)
    );
  }, [normalizedQuery]);

  const groupedByCategoryAndTag = useMemo(() => {
    const groupedByCategory = Object.entries(
      groupBy(filteredDictionaries, (dict) => dict.category)
    );
    return groupedByCategory.map(
      ([category, dicts]) =>
        [category, groupByDictTags(dicts)] as [
          string,
          Record<string, Dictionary[]>,
        ]
    );
  }, [filteredDictionaries]);

  const clearSearch = useCallback(() => {
    setQuery("");
    searchInputRef.current?.focus();
  }, []);

  const onSearchKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape" && query) {
        event.preventDefault();
        clearSearch();
      }
    },
    [clearSearch, query]
  );

  return (
    <PageShell
      actions={<DictRequest />}
      closeLabel="Close dictionary gallery"
      fillViewport={false}
      stickyHeader={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative min-w-0 flex-1">
            <IconMagnifyingGlass
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-controls="dictionary-results"
              aria-label="Search dictionaries"
              autoFocus
              className="h-11 pr-10 pl-10 text-base"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder="Search by name, tag, or description…"
              ref={searchInputRef}
              type="text"
              value={query}
            />
            {query.length > 0 && (
              <button
                aria-label="Clear search"
                className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                onClick={clearSearch}
                type="button"
              >
                <IconXMark className="h-4 w-4" />
              </button>
            )}
          </div>
          {trimmedQuery.length > 0 && (
            <p
              aria-live="polite"
              className="shrink-0 text-muted-foreground text-sm tabular-nums"
            >
              {filteredDictionaries.length}{" "}
              {filteredDictionaries.length === 1
                ? "dictionary"
                : "dictionaries"}
            </p>
          )}
        </div>
      }
      title="Dictionaries"
    >
      <div
        className="flex w-full min-w-0 flex-col gap-10 sm:gap-14"
        id="dictionary-results"
      >
        {normalizedQuery ? null : <CustomListsSection />}
        {groupedByCategoryAndTag.length > 0 ? (
          groupedByCategoryAndTag.map(([category, groupeByTag]) => (
            <DictionaryGroup
              category={category}
              groupedDictsByTag={groupeByTag}
              key={category}
            />
          ))
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-4 py-12 text-center">
            <p className="text-muted-foreground text-sm sm:text-base">
              No dictionaries match “{trimmedQuery}”.
            </p>
            <Button onClick={clearSearch} size="sm" variant="outline">
              Clear search
            </Button>
          </div>
        )}
      </div>

      <div className="mt-12 flex items-start justify-center gap-2 px-1 pb-4 text-muted-foreground sm:mt-16">
        <IconInfo className="mt-0.5 h-5 w-5 shrink-0" />
        <p className="min-w-0 text-xs leading-relaxed">
          Dictionary data in this project comes from multiple open-source
          projects and voluntary community contributors. We are deeply grateful
          and respect the intellectual property of every contributor. This data
          is for personal learning and research only. If you are a copyright
          owner and believe our use infringes your rights, contact us using the
          email at the bottom of the site.
        </p>
      </div>
    </PageShell>
  );
}
