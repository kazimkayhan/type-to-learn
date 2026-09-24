import { getCurrentDate, recordDataAction } from "..";
import { db } from ".";

export interface ExportProgress {
  completedRows: number;
  done: boolean;
  totalRows?: number;
}

export interface ImportProgress {
  completedRows: number;
  done: boolean;
  totalRows?: number;
}

export async function exportDatabase(
  callback: (exportProgress: ExportProgress) => boolean
) {
  const [pako, { saveAs }] = await Promise.all([
    import("pako"),
    import("file-saver"),
    import("dexie-export-import"),
  ]);

  const blob = await db.export({
    progressCallback: ({ totalRows, completedRows, done }) =>
      callback({ completedRows, done, totalRows }),
  });
  const [wordCount, chapterCount] = await Promise.all([
    db.wordRecords.count(),
    db.chapterRecords.count(),
  ]);

  const json = await blob.text();
  const compressed = pako.gzip(json);
  const compressedBlob = new Blob([compressed]);
  const currentDate = getCurrentDate();
  saveAs(compressedBlob, `Type-to-Learn-User-Data-${currentDate}.gz`);
  recordDataAction({
    chapterCount,
    size: compressedBlob.size,
    type: "export",
    wordCount,
  });
}

const IMPORT_OPTIONS = {
  acceptChangedPrimaryKey: false,
  acceptMissingTables: true,
  acceptNameDiff: false,
  acceptVersionDiff: true,
  clearTablesBeforeImport: true,
  overwriteValues: true,
} as const;

export async function importDatabase(
  onStart: () => void,
  callback: (importProgress: ImportProgress) => boolean,
  onError?: (error: unknown) => void
) {
  const [pako] = await Promise.all([
    import("pako"),
    import("dexie-export-import"),
  ]);

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/gzip";
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    onStart();

    // clearTablesBeforeImport wipes tables before the import transaction
    // runs, so a mid-import failure would otherwise leave the database
    // empty with no way back. Snapshot it first so we can restore on error.
    let backupBlob: Blob | undefined;
    try {
      backupBlob = await db.export();
    } catch (backupError) {
      console.error(
        "Failed to create safety backup before import:",
        backupError
      );
    }

    try {
      const compressed = await file.arrayBuffer();
      const json = pako.ungzip(compressed, { to: "string" });
      const blob = new Blob([json]);

      await db.import(blob, {
        ...IMPORT_OPTIONS,
        progressCallback: ({ totalRows, completedRows, done }) =>
          callback({ completedRows, done, totalRows }),
      });

      const [wordCount, chapterCount] = await Promise.all([
        db.wordRecords.count(),
        db.chapterRecords.count(),
      ]);
      recordDataAction({
        chapterCount,
        size: file.size,
        type: "import",
        wordCount,
      });
    } catch (error) {
      console.error("Import failed:", error);
      if (backupBlob) {
        try {
          await db.import(backupBlob, IMPORT_OPTIONS);
        } catch (restoreError) {
          console.error(
            "Failed to restore data after failed import:",
            restoreError
          );
        }
      }
      onError?.(error);
    }
  });

  input.click();
}
