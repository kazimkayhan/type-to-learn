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

export async function importDatabase(
  onStart: () => void,
  callback: (importProgress: ImportProgress) => boolean
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

    const compressed = await file.arrayBuffer();
    const json = pako.ungzip(compressed, { to: "string" });
    const blob = new Blob([json]);

    await db.import(blob, {
      acceptChangedPrimaryKey: false,
      acceptMissingTables: true,
      acceptNameDiff: false,
      acceptVersionDiff: true,
      clearTablesBeforeImport: true,
      overwriteValues: true,
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
  });

  input.click();
}
