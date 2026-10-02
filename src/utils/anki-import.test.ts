import { describe, expect, it } from "vitest";
import {
  stripAnkiMarkup,
  stripApkgExtension,
  wordFromAnkiFieldsString,
} from "@/utils/anki-import";

describe("stripApkgExtension", () => {
  it("removes .apkg case-insensitively", () => {
    expect(stripApkgExtension("My Deck.apkg")).toBe("My Deck");
    expect(stripApkgExtension("deck.APKG")).toBe("deck");
    expect(stripApkgExtension("plain")).toBe("plain");
  });
});

describe("stripAnkiMarkup", () => {
  it("strips HTML tags and entities", () => {
    expect(stripAnkiMarkup("<b>hello</b>&nbsp;world")).toBe("hello world");
    expect(stripAnkiMarkup("a<br>b<br/>c")).toBe("a b c");
    expect(stripAnkiMarkup("&amp;&lt;&gt;&quot;&#39;")).toBe("&<>\"'");
  });

  it("unwraps cloze deletions to the answer text", () => {
    expect(stripAnkiMarkup("The {{c1::cat}} sat")).toBe("The cat sat");
    expect(stripAnkiMarkup("{{c2::dog::hint}}")).toBe("dog");
  });
});

describe("wordFromAnkiFieldsString", () => {
  it("uses the front field as the word and the rest as translations", () => {
    const word = wordFromAnkiFieldsString("apple\u001fa fruit\u001fn. سیب");
    expect(word).toEqual({
      name: "apple",
      trans: ["a fruit", "n. سیب"],
    });
  });

  it("returns null for an empty note", () => {
    expect(wordFromAnkiFieldsString("")).toBeNull();
  });

  it("treats a leading separator as an empty front (uses next field)", () => {
    // Empty segments are dropped by strip+filter, so "\u001fonly back"
    // becomes a single-field note named "only back".
    expect(wordFromAnkiFieldsString("\u001fonly back")).toEqual({
      name: "only back",
      trans: [],
    });
  });

  it("strips markup inside fields", () => {
    const word = wordFromAnkiFieldsString(
      "<i>run</i>\u001f{{c1::to move quickly}}"
    );
    expect(word).toEqual({
      name: "run",
      trans: ["to move quickly"],
    });
  });
});
