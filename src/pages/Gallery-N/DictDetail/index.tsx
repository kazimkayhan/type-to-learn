import { useAtom, useSetAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  currentChapterAtom,
  currentDictIdAtom,
  reviewModeInfoAtom,
} from "@/store";
import type { Dictionary } from "@/typings";
import range from "@/utils/range";
import IcOutlineCollectionsBookmark from "~icons/ic/outline-collections-bookmark";
import MajesticonsPaperFoldTextLine from "~icons/majesticons/paper-fold-text-line";
import PajamasReviewList from "~icons/pajamas/review-list";
import { useDeleteWordRecord } from "../../../utils/db";
import Chapter from "../Chapter";
import { ErrorTable } from "../ErrorTable";
import { getRowsFromErrorWordData } from "../ErrorTable/columns";
import useErrorWordData from "../hooks/useErrorWords";
import { ReviewDetail } from "../ReviewDetail";

enum Tab {
  Chapters = "chapters",
  Errors = "errors",
  Review = "review",
}

export default function DictDetail({
  dictionary: dict,
}: {
  dictionary: Dictionary;
}) {
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom);
  const [currentDictId, setCurrentDictId] = useAtom(currentDictIdAtom);
  const [curTab, setCurTab] = useState<Tab>(Tab.Chapters);
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom);
  const navigate = useNavigate();
  const { deleteWordRecord } = useDeleteWordRecord();
  const [reload, setReload] = useState(false);

  const chapter = useMemo(
    () => (dict.id === currentDictId ? currentChapter : 0),
    [currentChapter, currentDictId, dict.id]
  );
  const { errorWordData, isLoading, error } = useErrorWordData(dict, reload);

  const tableData = useMemo(
    () => getRowsFromErrorWordData(errorWordData),
    [errorWordData]
  );

  const onDelete = useCallback(
    async (word: string) => {
      await deleteWordRecord(word, dict.id);
      setReload((old) => !old);
    },
    [deleteWordRecord, dict.id]
  );

  const onChangeChapter = useCallback(
    (index: number) => {
      setCurrentDictId(dict.id);
      setCurrentChapter(index);
      setReviewModeInfo((old) => ({ ...old, isReviewMode: false }));
      navigate("/");
    },
    [dict.id, navigate, setCurrentChapter, setCurrentDictId, setReviewModeInfo]
  );

  const handleTabChange = useCallback(
    (value: Tab) => {
      if (value !== curTab) {
        setCurTab(value);
      }
    },
    [curTab]
  );

  return (
    <div className="flex min-w-0 flex-col rounded-2xl px-1 py-2 text-gray-800 sm:rounded-[4rem] sm:px-4 sm:py-3 sm:pl-5 dark:text-gray-300">
      <div className="text relative flex h-auto min-w-0 flex-col gap-2 sm:h-40">
        <h3 className="pr-8 font-semibold text-lg sm:text-2xl">{dict.name}</h3>
        <p className="mt-1">{dict.chapterCount} chapters</p>
        <p>{dict.length} words total</p>
        <p className="text-sm sm:text-base">{dict.description}</p>
        <div className="relative right-auto bottom-auto mt-2 min-w-0 sm:absolute sm:right-4 sm:bottom-5 sm:mt-0">
          <ToggleGroup
            className="flex-wrap justify-start"
            onValueChange={handleTabChange}
            type="single"
            value={curTab}
          >
            <ToggleGroupItem
              className={`${curTab === Tab.Chapters ? "bg-primary text-primary-foreground" : ""} disabled:opacity-100`}
              disabled={curTab === Tab.Chapters}
              value={Tab.Chapters}
            >
              <MajesticonsPaperFoldTextLine className="mr-1.5 text-gray-500" />
              Chapters
            </ToggleGroupItem>
            {errorWordData.length > 0 && (
              <>
                <ToggleGroupItem
                  className={`${curTab === Tab.Errors ? "bg-primary text-primary-foreground" : ""} disabled:opacity-100`}
                  disabled={curTab === Tab.Errors}
                  value={Tab.Errors}
                >
                  <IcOutlineCollectionsBookmark className="mr-1.5 text-gray-500" />
                  View errors
                </ToggleGroupItem>
                <ToggleGroupItem
                  className={`${curTab === Tab.Review ? "bg-primary text-primary-foreground" : ""} disabled:opacity-100`}
                  disabled={curTab === Tab.Review}
                  value={Tab.Review}
                >
                  <PajamasReviewList className="mr-1.5 text-gray-500" />
                  Error review
                </ToggleGroupItem>
              </>
            )}
          </ToggleGroup>
        </div>
      </div>
      <div className="flex min-w-0 pl-0">
        <Tabs className="h-[min(30rem,55dvh)] w-full min-w-0" value={curTab}>
          <TabsContent className="h-full" value={Tab.Chapters}>
            <ScrollArea className="h-[min(30rem,55dvh)]">
              <div className="flex w-full flex-wrap gap-3">
                {range(0, dict.chapterCount, 1).map((index) => (
                  <Chapter
                    checked={chapter === index}
                    dictID={dict.id}
                    index={index}
                    key={`${dict.id}-${index}`}
                    onChange={onChangeChapter}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent className="h-full" value={Tab.Errors}>
            <ErrorTable
              data={tableData}
              error={error}
              isLoading={isLoading}
              onDelete={onDelete}
            />
          </TabsContent>
          <TabsContent className="h-full" value={Tab.Review}>
            <ReviewDetail dict={dict} errorData={errorWordData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
