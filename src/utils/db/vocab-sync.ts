import { getCurrentDate } from "@/utils";
import { db } from ".";
import { listCustomLists } from "./custom-lists";
import type { IWordMastery } from "./record";
import {
  choosePreferredMastery,
  createVocabSyncFile,
  parseVocabSyncFile,
  VOCAB_SYNC_MIME,
  type VocabSyncPayload,
} from "./vocab-sync-codec";

export {
  choosePreferredMastery,
  createVocabSyncFile,
  isVocabSyncEncrypted,
  parseVocabSyncFile,
  VOCAB_SYNC_MIME,
  VOCAB_SYNC_VERSION,
  type VocabSyncFile,
  type VocabSyncPayload,
} from "./vocab-sync-codec";

export interface VocabSyncImportResult {
  customLists: number;
  masteryMerged: number;
  masteryWritten: number;
}

function readLocalConfig(key: string): Record<string, unknown> | undefined {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // ignore
  }
}

function writeLocalConfig(
  key: string,
  value: Record<string, unknown> | undefined
): void {
  if (!value) {
    return;
  }
  localStorage.setItem(key, JSON.stringify(value));
}

export async function buildVocabSyncPayload(): Promise<VocabSyncPayload> {
  const [customLists, masteryRows] = await Promise.all([
    listCustomLists(),
    db.wordMastery.toArray(),
  ]);

  return {
    configs: {
      dailyReviewConfig: readLocalConfig("dailyReviewConfig"),
      recallModeConfig: readLocalConfig("recallModeConfig"),
      srsConfig: readLocalConfig("srsConfig"),
      timedPracticeConfig: readLocalConfig("timedPracticeConfig"),
    },
    customLists,
    wordMastery: masteryRows.map(({ id: _id, ...rest }) => rest),
  };
}

export async function exportVocabSyncPack(passphrase?: string): Promise<void> {
  const payload = await buildVocabSyncPayload();
  const file = await createVocabSyncFile(payload, passphrase);

  const blob = new Blob([`${JSON.stringify(file, null, 2)}\n`], {
    type: VOCAB_SYNC_MIME,
  });
  const { saveAs } = await import("file-saver");
  saveAs(blob, `Type-to-Learn-Vocab-Sync-${getCurrentDate()}.json`);
}

export async function importVocabSyncPayload(
  payload: VocabSyncPayload
): Promise<VocabSyncImportResult> {
  const listsToWrite = payload.customLists.filter(
    (list) => Boolean(list.id) && Boolean(list.name)
  );
  if (listsToWrite.length > 0) {
    await db.customLists.bulkPut(listsToWrite);
  }

  let masteryWritten = 0;
  let masteryMerged = 0;
  const masteryToAdd: Omit<IWordMastery, "id">[] = [];
  const masteryToPut: IWordMastery[] = [];

  const incomingRows = payload.wordMastery.filter(
    (row) => Boolean(row.dict) && Boolean(row.word)
  );

  const existingRows =
    incomingRows.length === 0
      ? []
      : await db.wordMastery
          .where("[dict+word]")
          .anyOf(incomingRows.map((row) => [row.dict, row.word]))
          .toArray();

  const existingByKey = new Map(
    existingRows.map((row) => [`${row.dict}\0${row.word}`, row])
  );

  for (const incoming of incomingRows) {
    const key = `${incoming.dict}\0${incoming.word}`;
    const existing = existingByKey.get(key);
    if (!existing) {
      masteryToAdd.push(incoming);
      masteryWritten += 1;
      continue;
    }
    const winner = choosePreferredMastery(incoming, existing);
    masteryToPut.push({ ...winner, id: existing.id });
    masteryMerged += 1;
  }

  if (masteryToAdd.length > 0) {
    await db.wordMastery.bulkAdd(masteryToAdd);
  }
  if (masteryToPut.length > 0) {
    await db.wordMastery.bulkPut(masteryToPut);
  }

  writeLocalConfig("dailyReviewConfig", payload.configs?.dailyReviewConfig);
  writeLocalConfig("recallModeConfig", payload.configs?.recallModeConfig);
  writeLocalConfig("srsConfig", payload.configs?.srsConfig);
  writeLocalConfig("timedPracticeConfig", payload.configs?.timedPracticeConfig);

  return {
    customLists: listsToWrite.length,
    masteryMerged,
    masteryWritten,
  };
}

export async function importVocabSyncFromFile(
  file: File,
  passphrase?: string
): Promise<VocabSyncImportResult> {
  const text = await file.text();
  const payload = await parseVocabSyncFile(text, passphrase);
  return importVocabSyncPayload(payload);
}
