import { useSetAtom } from "jotai";
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
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { customDictionariesAtom, refreshCustomDictionaries } from "@/store";
import type { ExportProgress, ImportProgress } from "@/utils/db/data-export";
import { exportDatabase, importDatabase } from "@/utils/db/data-export";
import {
  exportVocabSyncPack,
  importVocabSyncFromFile,
  isVocabSyncEncrypted,
} from "@/utils/db/vocab-sync";
import styles from "./index.module.css";

type PassphraseMode = "export" | "import" | null;

export default function DataSetting() {
  const setCustomDictionaries = useSetAtom(customDictionariesAtom);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [syncBusy, setSyncBusy] = useState(false);
  const [passphraseMode, setPassphraseMode] = useState<PassphraseMode>(null);
  const [passphrase, setPassphrase] = useState("");
  const [passphraseConfirm, setPassphraseConfirm] = useState("");
  const pendingImportFile = useRef<File | null>(null);
  const syncInputRef = useRef<HTMLInputElement>(null);

  const exportProgressCallback = useCallback(
    ({ totalRows, completedRows, done }: ExportProgress) => {
      if (done) {
        setIsExporting(false);
        setExportProgress(100);
        return true;
      }
      if (totalRows) {
        setExportProgress(Math.floor((completedRows / totalRows) * 100));
      }
      return true;
    },
    []
  );

  const onClickExport = useCallback(() => {
    setExportProgress(0);
    setIsExporting(true);
    exportDatabase(exportProgressCallback);
  }, [exportProgressCallback]);

  const importProgressCallback = useCallback(
    ({ totalRows, completedRows, done }: ImportProgress) => {
      if (done) {
        setIsImporting(false);
        setImportProgress(100);
        return true;
      }
      if (totalRows) {
        setImportProgress(Math.floor((completedRows / totalRows) * 100));
      }
      return true;
    },
    []
  );

  const onStartImport = useCallback(() => {
    setImportProgress(0);
    setIsImporting(true);
  }, []);

  const onImportError = useCallback(() => {
    setIsImporting(false);
    setImportProgress(0);
    toast.error(
      "Import failed. Your previous data has been restored where possible."
    );
  }, []);

  const onClickImport = useCallback(() => {
    importDatabase(onStartImport, importProgressCallback, onImportError);
  }, [importProgressCallback, onImportError, onStartImport]);

  const closePassphraseDialog = useCallback(() => {
    setPassphraseMode(null);
    setPassphrase("");
    setPassphraseConfirm("");
    pendingImportFile.current = null;
  }, []);

  const runSyncExport = useCallback(async (optionalPassphrase?: string) => {
    setSyncBusy(true);
    try {
      await exportVocabSyncPack(optionalPassphrase);
      toast.success(
        optionalPassphrase
          ? "Encrypted vocab sync file downloaded"
          : "Vocab sync file downloaded"
      );
    } catch {
      toast.error("Could not export vocab sync");
    } finally {
      setSyncBusy(false);
    }
  }, []);

  const runSyncImport = useCallback(
    async (file: File, optionalPassphrase?: string) => {
      setSyncBusy(true);
      try {
        const result = await importVocabSyncFromFile(file, optionalPassphrase);
        await refreshCustomDictionaries(setCustomDictionaries);
        toast.success(
          `Synced ${result.customLists} lists · ${result.masteryWritten} new mastery · ${result.masteryMerged} updated`
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Could not import sync file";
        toast.error(message);
      } finally {
        setSyncBusy(false);
        if (syncInputRef.current) {
          syncInputRef.current.value = "";
        }
      }
    },
    [setCustomDictionaries]
  );

  const onConfirmPassphrase = useCallback(async () => {
    if (passphraseMode === "export") {
      if (passphrase.trim() && passphrase !== passphraseConfirm) {
        toast.error("Passphrases do not match");
        return;
      }
      const value = passphrase.trim() || undefined;
      closePassphraseDialog();
      await runSyncExport(value);
      return;
    }

    if (passphraseMode === "import") {
      const file = pendingImportFile.current;
      if (!file) {
        closePassphraseDialog();
        return;
      }
      if (!passphrase.trim()) {
        toast.error("Enter the passphrase");
        return;
      }
      const value = passphrase.trim();
      closePassphraseDialog();
      await runSyncImport(file, value);
    }
  }, [
    closePassphraseDialog,
    passphrase,
    passphraseConfirm,
    passphraseMode,
    runSyncExport,
    runSyncImport,
  ]);

  const onPickSyncFile = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        if (isVocabSyncEncrypted(text)) {
          pendingImportFile.current = file;
          setPassphrase("");
          setPassphraseConfirm("");
          setPassphraseMode("import");
          return;
        }
        await runSyncImport(file);
      } catch {
        toast.error("Could not read sync file");
        if (syncInputRef.current) {
          syncInputRef.current.value = "";
        }
      }
    },
    [runSyncImport]
  );

  return (
    <ScrollArea className="flex-1 select-none overflow-y-auto">
      <div className="h-full w-full px-3">
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Vocabulary sync pack</span>
            <span className={styles.sectionDescription}>
              Move mastery, custom lists, and review settings between devices
              without a server. Optionally lock the file with a passphrase
              (AES-GCM). Import merges with your current data.
            </span>
            <div className="ml-4 flex flex-wrap gap-2">
              <Button
                disabled={syncBusy}
                onClick={() => {
                  setPassphrase("");
                  setPassphraseConfirm("");
                  setPassphraseMode("export");
                }}
                title="Export vocabulary sync"
                type="button"
                variant="outline"
              >
                Export vocab sync
              </Button>
              <input
                accept=".json,application/json"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    onPickSyncFile(file);
                  }
                }}
                ref={syncInputRef}
                type="file"
              />
              <Button
                disabled={syncBusy}
                onClick={() => syncInputRef.current?.click()}
                title="Import vocabulary sync"
                type="button"
                variant="outline"
              >
                Import vocab sync
              </Button>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Export data</span>
            <span className={styles.sectionDescription}>
              Your practice data is currently{" "}
              <strong>stored locally only</strong>. If you need to use Type to
              Learn on different devices, browsers, or unofficial deployments,
              you must manually sync and back up your data. To preserve your
              progress and use upcoming data analysis and smart training
              features, we recommend backing up your data regularly.
            </span>
            <span className="pl-4 text-left font-bold text-red-500 text-sm leading-tight">
              For your data security, please do not modify exported data files.
            </span>
            {isExporting && (
              <div className="flex h-3 w-full items-center justify-start px-5">
                <Progress className="w-11/12" value={exportProgress}>
                  <ProgressTrack className="translate-z-0 relative h-2 transform overflow-hidden rounded-full bg-muted">
                    <ProgressIndicator
                      className="cubic-bezier(0.65, 0, 0.35, 1) h-full w-full bg-primary transition-transform duration-500 ease-out"
                      style={{
                        transform: `translateX(-${100 - exportProgress}%)`,
                      }}
                    />
                  </ProgressTrack>
                </Progress>
                <span className="ml-4 w-10 font-normal text-muted-foreground text-xs">{`${exportProgress}%`}</span>
              </div>
            )}

            <Button
              className="ml-4"
              disabled={isExporting}
              onClick={onClickExport}
              title="Export data"
              type="button"
            >
              Export data
            </Button>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Import data</span>
            <span className={styles.sectionDescription}>
              Please note: importing data will{" "}
              <strong className="font-bold text-destructive text-sm">
                {" "}
                completely overwrite{" "}
              </strong>{" "}
              your current data. Proceed with caution.
            </span>

            {isImporting && (
              <div className="flex h-3 w-full items-center justify-start px-5">
                <Progress className="w-11/12" value={importProgress}>
                  <ProgressTrack className="translate-z-0 relative h-2 transform overflow-hidden rounded-full bg-muted">
                    <ProgressIndicator
                      className="cubic-bezier(0.65, 0, 0.35, 1) h-full w-full bg-primary transition-transform duration-500 ease-out"
                      style={{
                        transform: `translateX(-${100 - importProgress}%)`,
                      }}
                    />
                  </ProgressTrack>
                </Progress>
                <span className="ml-4 w-10 font-normal text-muted-foreground text-xs">{`${importProgress}%`}</span>
              </div>
            )}

            <Button
              className="ml-4"
              disabled={isImporting}
              onClick={onClickImport}
              title="Import data"
              type="button"
            >
              Import data
            </Button>
          </div>
        </div>
      </div>
      <ScrollBar
        className="flex touch-none select-none bg-transparent"
        orientation="vertical"
      />

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            closePassphraseDialog();
          }
        }}
        open={passphraseMode !== null}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {passphraseMode === "export"
                ? "Export vocab sync"
                : "Unlock sync file"}
            </DialogTitle>
            <DialogDescription>
              {passphraseMode === "export"
                ? "Leave blank for an unencrypted JSON file, or set a passphrase to encrypt with AES-GCM."
                : "This sync file is encrypted. Enter the passphrase used when it was exported."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="vocab-sync-passphrase">Passphrase</Label>
              <Input
                autoFocus
                id="vocab-sync-passphrase"
                onChange={(event) => setPassphrase(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onConfirmPassphrase();
                  }
                }}
                placeholder={
                  passphraseMode === "export" ? "Optional" : "Required"
                }
                type="password"
                value={passphrase}
              />
            </div>
            {passphraseMode === "export" ? (
              <div className="grid gap-1.5">
                <Label htmlFor="vocab-sync-passphrase-confirm">
                  Confirm passphrase
                </Label>
                <Input
                  id="vocab-sync-passphrase-confirm"
                  onChange={(event) => setPassphraseConfirm(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      onConfirmPassphrase();
                    }
                  }}
                  placeholder="Optional"
                  type="password"
                  value={passphraseConfirm}
                />
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              onClick={closePassphraseDialog}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={syncBusy}
              onClick={onConfirmPassphrase}
              type="button"
            >
              {passphraseMode === "export" ? "Download" : "Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
}
