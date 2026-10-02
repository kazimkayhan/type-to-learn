import { useAtom, useSetAtom } from "jotai";
import { useCallback, useRef, useState } from "react";
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
import { DEFAULT_DICT_ID } from "@/constants";
import {
  currentChapterAtom,
  currentDictIdAtom,
  customDictionariesAtom,
  refreshCustomDictionaries,
} from "@/store";
import type { Dictionary } from "@/typings";
import {
  customListToDictionary,
  deleteCustomList,
  getCustomList,
  parseWordCsv,
  sanitizeListFilename,
  updateCustomList,
  wordsToCsv,
} from "@/utils/db/custom-lists";
import IconArrowDownTray from "~icons/heroicons/arrow-down-tray-20-solid";
import IconArrowUpTray from "~icons/heroicons/arrow-up-tray-20-solid";
import IconTrash from "~icons/heroicons/trash-20-solid";

interface Props {
  dictionary: Dictionary;
  onDeleted?: () => void;
  onUpdated?: (dictionary: Dictionary) => void;
}

export default function CustomListActions({
  dictionary,
  onDeleted,
  onUpdated,
}: Props) {
  const setCustomDictionaries = useSetAtom(customDictionariesAtom);
  const [currentDictId, setCurrentDictId] = useAtom(currentDictIdAtom);
  const setCurrentChapter = useSetAtom(currentChapterAtom);
  const [busy, setBusy] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    const dicts = await refreshCustomDictionaries(setCustomDictionaries);
    const updated = dicts.find((dict) => dict.id === dictionary.id);
    if (updated) {
      onUpdated?.(updated);
    }
    return updated;
  }, [dictionary.id, onUpdated, setCustomDictionaries]);

  const onExport = useCallback(async () => {
    setBusy(true);
    try {
      const list = await getCustomList(dictionary.id);
      if (!list) {
        toast.error("List not found");
        return;
      }
      const csv = wordsToCsv(list.words);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${sanitizeListFilename(list.name)}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Could not export CSV");
    } finally {
      setBusy(false);
    }
  }, [dictionary.id]);

  const onImportMore = useCallback(
    async (file: File) => {
      setBusy(true);
      try {
        const list = await getCustomList(dictionary.id);
        if (!list) {
          toast.error("List not found");
          return;
        }
        const imported = parseWordCsv(await file.text());
        if (imported.length === 0) {
          toast.error("No words found in CSV");
          return;
        }
        const updated = await updateCustomList(dictionary.id, {
          words: [...list.words, ...imported],
        });
        await refresh();
        onUpdated?.(customListToDictionary(updated));
        toast.success(`Added words (list now has ${updated.words.length})`);
      } catch {
        toast.error("Could not import CSV");
      } finally {
        setBusy(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [dictionary.id, onUpdated, refresh]
  );

  const onConfirmDelete = useCallback(async () => {
    setBusy(true);
    try {
      await deleteCustomList(dictionary.id);
      await refreshCustomDictionaries(setCustomDictionaries);
      if (currentDictId === dictionary.id) {
        setCurrentDictId(DEFAULT_DICT_ID);
        setCurrentChapter(0);
      }
      setDeleteOpen(false);
      toast.success("List deleted");
      onDeleted?.();
    } catch {
      toast.error("Could not delete list");
    } finally {
      setBusy(false);
    }
  }, [
    currentDictId,
    dictionary.id,
    onDeleted,
    setCurrentChapter,
    setCurrentDictId,
    setCustomDictionaries,
  ]);

  return (
    <div className="flex flex-wrap gap-2">
      <input
        accept=".csv,text/csv"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onImportMore(file);
          }
        }}
        ref={fileInputRef}
        type="file"
      />
      <Button
        disabled={busy}
        onClick={onExport}
        size="sm"
        type="button"
        variant="outline"
      >
        <IconArrowDownTray className="mr-1.5 size-4" />
        Export CSV
      </Button>
      <Button
        disabled={busy}
        onClick={() => fileInputRef.current?.click()}
        size="sm"
        type="button"
        variant="outline"
      >
        <IconArrowUpTray className="mr-1.5 size-4" />
        Add from CSV
      </Button>
      <Button
        disabled={busy}
        onClick={() => setDeleteOpen(true)}
        size="sm"
        type="button"
        variant="destructive"
      >
        <IconTrash className="mr-1.5 size-4" />
        Delete list
      </Button>

      <Dialog onOpenChange={setDeleteOpen} open={deleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete list?</DialogTitle>
            <DialogDescription>
              Delete “{dictionary.name}”? Practice history for this list stays
              in your data, but the word list is removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setDeleteOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={busy}
              onClick={onConfirmDelete}
              type="button"
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
