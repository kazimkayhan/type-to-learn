import { useAtomValue, useSetAtom } from "jotai";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { customDictionariesAtom, refreshCustomDictionaries } from "@/store";
import { parseAnkiApkg, stripApkgExtension } from "@/utils/anki-import";
import {
  createCustomList,
  parseWordCsv,
  stripCsvExtension,
} from "@/utils/db/custom-lists";
import IconArrowUpTray from "~icons/heroicons/arrow-up-tray-20-solid";
import IconPlus from "~icons/heroicons/plus-20-solid";
import DictionaryComponent from "./dictionary-without-cover";

export default function CustomListsSection() {
  const customDictionaries = useAtomValue(customDictionariesAtom);
  const setCustomDictionaries = useSetAtom(customDictionariesAtom);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const ankiInputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    await refreshCustomDictionaries(setCustomDictionaries);
  }, [setCustomDictionaries]);

  const onCreate = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Enter a list name");
      return;
    }
    setBusy(true);
    try {
      await createCustomList({
        description: description.trim(),
        name: trimmed,
      });
      await refresh();
      setCreateOpen(false);
      setName("");
      setDescription("");
      toast.success("List created");
    } catch {
      toast.error("Could not create list");
    } finally {
      setBusy(false);
    }
  }, [description, name, refresh]);

  const onImportCsv = useCallback(
    async (file: File) => {
      setBusy(true);
      try {
        const text = await file.text();
        const words = parseWordCsv(text);
        if (words.length === 0) {
          toast.error("No words found in CSV");
          return;
        }
        const listName = stripCsvExtension(file.name) || "Imported list";
        await createCustomList({
          description: `Imported from ${file.name}`,
          name: listName,
          words,
        });
        await refresh();
        toast.success(`Imported ${words.length} words`);
      } catch {
        toast.error("Could not import CSV");
      } finally {
        setBusy(false);
        if (csvInputRef.current) {
          csvInputRef.current.value = "";
        }
      }
    },
    [refresh]
  );

  const onImportAnki = useCallback(
    async (file: File) => {
      setBusy(true);
      try {
        const fallback = stripApkgExtension(file.name) || "Anki deck";
        const { deckName, words } = await parseAnkiApkg(file, fallback);
        if (words.length === 0) {
          toast.error("No notes found in this Anki package");
          return;
        }
        await createCustomList({
          description: `Imported from ${file.name}`,
          name: deckName || fallback,
          words,
        });
        await refresh();
        toast.success(`Imported ${words.length} words from Anki`);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Could not import Anki file";
        toast.error(message);
      } finally {
        setBusy(false);
        if (ankiInputRef.current) {
          ankiInputRef.current.value = "";
        }
      }
    },
    [refresh]
  );

  return (
    <section className="w-full min-w-0">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-5">
        <div className="min-w-0">
          <h2 className="font-semibold text-foreground text-lg sm:text-xl">
            My lists
          </h2>
          <p className="mt-1 text-muted-foreground text-xs sm:text-sm">
            Create a list, or import CSV (`word,translation`) / Anki `.apkg`.
            Stored locally on this device.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            accept=".csv,text/csv"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                onImportCsv(file);
              }
            }}
            ref={csvInputRef}
            type="file"
          />
          <input
            accept=".apkg,application/zip"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                onImportAnki(file);
              }
            }}
            ref={ankiInputRef}
            type="file"
          />
          <Button
            disabled={busy}
            onClick={() => csvInputRef.current?.click()}
            size="sm"
            type="button"
            variant="outline"
          >
            <IconArrowUpTray className="mr-1.5 size-4" />
            Import CSV
          </Button>
          <Button
            disabled={busy}
            onClick={() => ankiInputRef.current?.click()}
            size="sm"
            type="button"
            variant="outline"
          >
            <IconArrowUpTray className="mr-1.5 size-4" />
            Import Anki
          </Button>
          <Button
            disabled={busy}
            onClick={() => setCreateOpen(true)}
            size="sm"
            type="button"
          >
            <IconPlus className="mr-1.5 size-4" />
            New list
          </Button>
        </div>
      </div>

      {customDictionaries.length > 0 ? (
        <div className="grid w-full dic3:grid-cols-3 dic4:grid-cols-4 grid-cols-1 gap-4 px-0 pb-2 sm:gap-6 md:grid-cols-2">
          {customDictionaries.map((dict) => (
            <DictionaryComponent dictionary={dict} key={dict.id} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed px-4 py-10 text-center text-muted-foreground text-sm">
          No custom lists yet. Create one or import a CSV / Anki package to
          practice your own words.
        </div>
      )}

      <Dialog onOpenChange={setCreateOpen} open={createOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New word list</DialogTitle>
            <DialogDescription>
              Build an empty list, then add words from the word study sheet or
              import a CSV / Anki package later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="custom-list-name">Name</Label>
              <Input
                autoFocus
                id="custom-list-name"
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onCreate();
                  }
                }}
                placeholder="e.g. IELTS week 3"
                value={name}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="custom-list-description">Description</Label>
              <Input
                id="custom-list-description"
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional"
                value={description}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setCreateOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={busy} onClick={onCreate} type="button">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
