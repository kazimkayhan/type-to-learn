import fs from "node:fs";
import path from "node:path";

const dictPath = "src/resources/dictionary.ts";
let src = fs.readFileSync(dictPath, "utf8");

/** IDs to keep (featured + suggested survivors). Everything else goes. */
const KEEP_IDS = new Set([
  // Featured
  "eew4000-meaning",
  "longman3000",
  "Oxford3000",
  "pet-2024",
  "ket",
  "merriam-webster-vb",
  "ielts",
  "toefl",
  "voa",
  "it-vocabulary",
  // International exams (lean)
  "Oxford5000",
  "gmat",
  "gre",
  "sat",
  "TOEIC",
  "bec3",
  "Duolingo_Vocabulary_B1",
  "Duolingo_Vocabulary_B2",
  "Duolingo_Vocabulary_C1",
  "PTE_junior",
  "PTE_senior",
  // Youth / general
  "nce1",
  "nce2",
  "nce3",
  "nce4",
  "classroom3000",
  "top2000words",
  "freq-used-1",
  "freq-used-2",
  "freq-used-3",
  "top1000verbs",
  "top1500nouns",
  "top500adjectives",
  "top250adverbs",
  "suffix-words",
  "word-roots1",
]);

const blockRe =
  /\{\s*category:\s*"[^"]+",[\s\S]*?id:\s*"([^"]+)",[\s\S]*?url:\s*"([^"]+)",?\s*\},?\r?\n?/g;

const removed = [];
src = src.replace(blockRe, (full, id, url) => {
  if (KEEP_IDS.has(id)) {
    return full;
  }
  removed.push({ id, url });
  return "";
});

// Drop the entire programming array (will be empty / unused)
src = src.replace(
  /\/\/ Coding Practice[\s\S]*?const programming: DictionaryResource\[] = \[[\s\S]*?\];\r?\n*/,
  ""
);

// Also remove any leftover empty programming if comment style differs
src = src.replace(
  /const programming: DictionaryResource\[] = \[[\s\S]*?\];\r?\n*/,
  ""
);

// Fix assembly to not spread programming
src = src.replace(
  /\.\.\.newlyRegisteredEnglish,\r?\n\s*\.\.\.programming,/,
  "...newlyRegisteredEnglish,"
);

// Collapse excessive blank lines
src = src.replace(/\n{3,}/g, "\n\n");

fs.writeFileSync(dictPath, src);

// Delete JSON files no longer referenced
const stillReferenced = new Set(
  [...src.matchAll(/url:\s*"(\/dicts\/[^"]+)"/g)].map((m) => m[1])
);

let deleted = 0;
let skipped = 0;
const uniqueUrls = [...new Set(removed.map((r) => r.url))];
for (const url of uniqueUrls) {
  if (stillReferenced.has(url)) {
    skipped += 1;
    continue;
  }
  const file = path.join("public", url.replace(/^\//, ""));
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    deleted += 1;
  }
}

console.log("removed entries:", removed.length);
console.log("deleted json:", deleted);
console.log("skipped still-referenced:", skipped);

const remainingIds = [...src.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
const unique = [...new Set(remainingIds)];
console.log("remaining unique ids:", unique.length);
const missingKeep = [...KEEP_IDS].filter((id) => !unique.includes(id));
console.log("missing keep ids:", missingKeep);

// leftover coding / china-ish markers
console.log("has programming ref:", /programming/.test(src));
console.log(
  "leftover categories sample:",
  [...src.matchAll(/category:\s*"([^"]+)"/g)]
    .map((m) => m[1])
    .filter((v, i, a) => a.indexOf(v) === i)
);
