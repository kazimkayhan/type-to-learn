import { describe, expect, it } from "vitest";
import type { IWordMastery } from "@/utils/db/record";
import {
  choosePreferredMastery,
  createVocabSyncFile,
  isVocabSyncEncrypted,
  parseVocabSyncFile,
  VOCAB_SYNC_VERSION,
  type VocabSyncPayload,
} from "@/utils/db/vocab-sync-codec";

const UNSUPPORTED_VERSION_RE = /Unsupported sync version/;
const MISSING_PAYLOAD_RE = /missing payload/;
const ENCRYPTED_RE = /encrypted/;
const DECRYPT_FAIL_RE = /decrypt|passphrase/i;

function mastery(overrides: Partial<IWordMastery>): IWordMastery {
  return {
    dict: "dict-a",
    due: 0,
    easeFactor: 2.5,
    intervalDays: 1,
    lapses: 0,
    lastReview: 100,
    reps: 1,
    state: "learning",
    totalWrong: 0,
    word: "word",
    ...overrides,
  };
}

const emptyPayload: VocabSyncPayload = {
  customLists: [],
  wordMastery: [],
};

describe("choosePreferredMastery", () => {
  it("prefers the newer lastReview", () => {
    const older = mastery({ lastReview: 10, reps: 99 });
    const newer = mastery({ lastReview: 20, reps: 1 });
    expect(choosePreferredMastery(older, newer)).toBe(newer);
  });

  it("breaks ties with reps, then totalWrong", () => {
    const fewerReps = mastery({ lastReview: 10, reps: 1, totalWrong: 9 });
    const moreReps = mastery({ lastReview: 10, reps: 5, totalWrong: 0 });
    expect(choosePreferredMastery(fewerReps, moreReps)).toBe(moreReps);

    const fewerWrong = mastery({ lastReview: 10, reps: 2, totalWrong: 1 });
    const moreWrong = mastery({ lastReview: 10, reps: 2, totalWrong: 4 });
    expect(choosePreferredMastery(fewerWrong, moreWrong)).toBe(moreWrong);
  });
});

describe("parseVocabSyncFile", () => {
  it("reads an unencrypted payload", async () => {
    const text = JSON.stringify({
      encrypted: false,
      exportedAt: "2026-01-01T00:00:00.000Z",
      payload: emptyPayload,
      version: VOCAB_SYNC_VERSION,
    });
    await expect(parseVocabSyncFile(text)).resolves.toEqual(emptyPayload);
  });

  it("rejects unsupported versions and missing payloads", async () => {
    await expect(
      parseVocabSyncFile(
        JSON.stringify({
          encrypted: false,
          payload: emptyPayload,
          version: 999,
        })
      )
    ).rejects.toThrow(UNSUPPORTED_VERSION_RE);

    await expect(
      parseVocabSyncFile(
        JSON.stringify({ encrypted: false, version: VOCAB_SYNC_VERSION })
      )
    ).rejects.toThrow(MISSING_PAYLOAD_RE);
  });

  it("requires a passphrase for encrypted files", async () => {
    const text = JSON.stringify({
      ciphertext: "x",
      encrypted: true,
      iv: "y",
      salt: "z",
      version: VOCAB_SYNC_VERSION,
    });
    await expect(parseVocabSyncFile(text)).rejects.toThrow(ENCRYPTED_RE);
  });
});

describe("createVocabSyncFile + encrypt roundtrip", () => {
  it("round-trips an encrypted payload with the correct passphrase", async () => {
    const payload: VocabSyncPayload = {
      customLists: [],
      wordMastery: [
        mastery({
          dict: "d1",
          lastReview: 123,
          reps: 4,
          word: "zebra",
        }),
      ],
    };
    const file = await createVocabSyncFile(payload, "test-passphrase");
    expect(file.encrypted).toBe(true);
    expect(file.ciphertext).toBeTruthy();
    expect(file.payload).toBeUndefined();

    const text = JSON.stringify(file);
    expect(isVocabSyncEncrypted(text)).toBe(true);

    const decrypted = await parseVocabSyncFile(text, "test-passphrase");
    expect(decrypted.wordMastery).toHaveLength(1);
    expect(decrypted.wordMastery[0]?.word).toBe("zebra");

    await expect(parseVocabSyncFile(text, "wrong-pass")).rejects.toThrow(
      DECRYPT_FAIL_RE
    );
  });
});
