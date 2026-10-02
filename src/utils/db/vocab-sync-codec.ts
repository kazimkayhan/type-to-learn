import type { ICustomList } from "./custom-lists";
import type { IWordMastery } from "./record";

export const VOCAB_SYNC_VERSION = 1;
export const VOCAB_SYNC_MIME = "application/json";

export interface VocabSyncPayload {
  configs?: {
    dailyReviewConfig?: Record<string, unknown>;
    recallModeConfig?: Record<string, unknown>;
    srsConfig?: Record<string, unknown>;
    timedPracticeConfig?: Record<string, unknown>;
  };
  customLists: ICustomList[];
  wordMastery: Omit<IWordMastery, "id">[];
}

export interface VocabSyncFile {
  ciphertext?: string;
  encrypted: boolean;
  exportedAt: string;
  iv?: string;
  payload?: VocabSyncPayload;
  salt?: string;
  version: number;
}

const TEXT_ENCODER = new TextEncoder();
const TEXT_DECODER = new TextDecoder();

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveAesKey(
  passphrase: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    "raw",
    TEXT_ENCODER.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      hash: "SHA-256",
      iterations: 210_000,
      name: "PBKDF2",
      salt,
    },
    material,
    { length: 256, name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptPayload(
  payload: VocabSyncPayload,
  passphrase: string
): Promise<Pick<VocabSyncFile, "ciphertext" | "iv" | "salt">> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKey(passphrase, salt);
  const plaintext = TEXT_ENCODER.encode(JSON.stringify(payload));
  const encrypted = await crypto.subtle.encrypt(
    { iv, name: "AES-GCM" },
    key,
    plaintext
  );
  return {
    ciphertext: bytesToBase64(new Uint8Array(encrypted)),
    iv: bytesToBase64(iv),
    salt: bytesToBase64(salt),
  };
}

async function decryptPayload(
  file: VocabSyncFile,
  passphrase: string
): Promise<VocabSyncPayload> {
  if (!(file.ciphertext && file.iv && file.salt)) {
    throw new Error("Encrypted sync file is missing ciphertext fields.");
  }
  const salt = base64ToBytes(file.salt);
  const iv = base64ToBytes(file.iv);
  const key = await deriveAesKey(passphrase, salt);
  const decrypted = await crypto.subtle.decrypt(
    { iv, name: "AES-GCM" },
    key,
    base64ToBytes(file.ciphertext)
  );
  return JSON.parse(TEXT_DECODER.decode(decrypted)) as VocabSyncPayload;
}

/** Pick the stronger of two mastery rows (newer review, then reps, then wrongs). */
export function choosePreferredMastery(
  a: IWordMastery,
  b: IWordMastery
): IWordMastery {
  if (a.lastReview !== b.lastReview) {
    return a.lastReview >= b.lastReview ? a : b;
  }
  if (a.reps !== b.reps) {
    return a.reps >= b.reps ? a : b;
  }
  return a.totalWrong >= b.totalWrong ? a : b;
}

/** Build a sync file object (optionally encrypted). */
export async function createVocabSyncFile(
  payload: VocabSyncPayload,
  passphrase?: string
): Promise<VocabSyncFile> {
  const file: VocabSyncFile = {
    encrypted: Boolean(passphrase?.trim()),
    exportedAt: new Date().toISOString(),
    version: VOCAB_SYNC_VERSION,
  };

  if (passphrase?.trim()) {
    const encrypted = await encryptPayload(payload, passphrase.trim());
    file.ciphertext = encrypted.ciphertext;
    file.iv = encrypted.iv;
    file.salt = encrypted.salt;
  } else {
    file.payload = payload;
  }

  return file;
}

export async function parseVocabSyncFile(
  text: string,
  passphrase?: string
): Promise<VocabSyncPayload> {
  let file: VocabSyncFile;
  try {
    file = JSON.parse(text) as VocabSyncFile;
  } catch (error) {
    throw new Error("Invalid sync file (not JSON).", { cause: error });
  }

  if (file.version !== VOCAB_SYNC_VERSION) {
    throw new Error(`Unsupported sync version: ${String(file.version)}`);
  }

  if (file.encrypted) {
    if (!passphrase?.trim()) {
      throw new Error("This sync file is encrypted. Enter the passphrase.");
    }
    try {
      return await decryptPayload(file, passphrase.trim());
    } catch (error) {
      throw new Error("Could not decrypt sync file. Check the passphrase.", {
        cause: error,
      });
    }
  }

  if (!file.payload) {
    throw new Error("Sync file is missing payload.");
  }
  return file.payload;
}

export function isVocabSyncEncrypted(text: string): boolean {
  try {
    const parsed = JSON.parse(text) as VocabSyncFile;
    return Boolean(parsed.encrypted);
  } catch {
    return false;
  }
}
