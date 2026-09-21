export function isKanji(ch: string) {
  const [char] = ch;
  return (
    (char >= "\u4e00" && char <= "\u9fcf") ||
    (char >= "\uf900" && char <= "\ufaff") ||
    (char >= "\u3400" && char <= "\u4dbf")
  );
}

/**
 * source: https://github.com/andree-surya/moji4j
 */
export function romajiToHiragana(romaji: string): string {
  const changeStr: string = romaji.toLowerCase();
  const resultStr: string[] = changeStr.split("");

  for (let i = 0; i < changeStr.length - 1; i += 1) {
    const currentCharacter = changeStr[i];
    const nextCharacter = changeStr[i + 1];

    const isDoubleConsonant =
      currentCharacter === nextCharacter && currentCharacter !== "n";
    const isExceptionalCase = currentCharacter === "t" && nextCharacter === "c";

    if (
      isRomanConsonant(currentCharacter) &&
      (isDoubleConsonant || isExceptionalCase)
    ) {
      resultStr[i] = "っ";
    }
  }

  let result = "";
  let currentOffset = 0;
  while (currentOffset < resultStr.length) {
    const maxSubstringLength = Math.min(4, resultStr.length - currentOffset);

    for (
      let substringLength = maxSubstringLength;
      substringLength > 0;
      substringLength -= 1
    ) {
      const substring = resultStr.slice(
        currentOffset,
        currentOffset + substringLength
      );

      const replacementString: string | undefined =
        romajiToHiraganaJson[substring.join("")];

      if (replacementString) {
        result += replacementString;
        currentOffset += substring.length;
        break;
      }

      if (substringLength === 1) {
        result += substring;

        currentOffset += 1;
        break;
      }
    }
  }

  return result;
}

function isRomanConsonant(character: string): boolean {
  return character >= "a" && character <= "z" && !isRomanVowel(character);
}

function isRomanVowel(character: string): boolean {
  return (
    character === "a" ||
    character === "i" ||
    character === "u" ||
    character === "e" ||
    character === "o"
  );
}

interface RomajiToHiragana {
  [key: string]: string;
}
const romajiToHiraganaJson: RomajiToHiragana = {
  "-": "ー",
  a: "あ",
  ba: "ば",
  be: "べ",
  bi: "び",
  bo: "ぼ",
  bu: "ぶ",
  bya: "びゃ",
  bye: "びぇ",
  byi: "びぃ",
  byo: "びょ",
  byu: "びゅ",
  ca: "か",
  cha: "ちゃ",
  che: "ちぇ",
  chi: "ち",
  cho: "ちょ",
  chu: "ちゅ",
  co: "こ",
  cu: "く",
  cya: "ちゃ",
  cye: "ちぇ",
  cyi: "ちぃ",
  cyo: "ちょ",
  cyu: "ちゅ",
  da: "だ",
  de: "で",
  dha: "でゃ",
  dhe: "でぇ",
  dhi: "でぃ",
  dho: "でょ",
  dhu: "でゅ",
  di: "ぢ",
  do: "ど",
  du: "づ",
  dya: "ぢゃ",
  dye: "ぢぇ",
  dyi: "ぢぃ",
  dyo: "ぢょ",
  dyu: "ぢゅ",
  dzu: "づ",
  e: "え",
  fa: "ふぁ",
  fe: "ふぇ",
  fi: "ふぃ",
  fo: "ふぉ",
  fu: "ふ",
  ga: "が",
  ge: "げ",
  gi: "ぎ",
  go: "ご",
  gu: "ぐ",
  gya: "ぎゃ",
  gye: "ぎぇ",
  gyi: "ぎぃ",
  gyo: "ぎょ",
  gyu: "ぎゅ",
  ha: "は",
  he: "へ",
  hi: "ひ",
  ho: "ほ",
  hu: "ふ",
  hya: "ひゃ",
  hye: "ひぇ",
  hyi: "ひぃ",
  hyo: "ひょ",
  hyu: "ひゅ",
  i: "い",
  ja: "じゃ",
  je: "じぇ",
  ji: "じ",
  jo: "じょ",
  ju: "じゅ",
  jya: "じゃ",
  jye: "じぇ",
  jyi: "じぃ",
  jyo: "じょ",
  jyu: "じゅ",
  ka: "か",
  ke: "け",
  ki: "き",
  ko: "こ",
  ku: "く",
  kya: "きゃ",
  kye: "きぇ",
  kyi: "きぃ",
  kyo: "きょ",
  kyu: "きゅ",
  la: "ら",
  le: "れ",
  li: "り",
  lo: "ろ",
  lu: "る",
  lya: "りゃ",
  lye: "りぇ",
  lyi: "りぃ",
  lyo: "りょ",
  lyu: "りゅ",
  m: "ん",
  ma: "ま",
  me: "め",
  mi: "み",
  mo: "も",
  mu: "む",
  mya: "みゃ",
  mye: "みぇ",
  myi: "みぃ",
  myo: "みょ",
  myu: "みゅ",
  n: "ん",
  "n'": "ん",
  na: "な",
  ne: "ね",
  ni: "に",
  no: "の",
  nu: "ぬ",
  nya: "にゃ",
  nye: "にぇ",
  nyi: "にぃ",
  nyo: "にょ",
  nyu: "にゅ",
  o: "お",
  pa: "ぱ",
  pe: "ぺ",
  pi: "ぴ",
  po: "ぽ",
  pu: "ぷ",
  pya: "ぴゃ",
  pye: "ぴぇ",
  pyi: "ぴぃ",
  pyo: "ぴょ",
  pyu: "ぴゅ",
  ra: "ら",
  re: "れ",
  ri: "り",
  ro: "ろ",
  ru: "る",
  rya: "りゃ",
  rye: "りぇ",
  ryi: "りぃ",
  ryo: "りょ",
  ryu: "りゅ",
  sa: "さ",
  se: "せ",
  sha: "しゃ",
  she: "しぇ",
  shi: "し",
  sho: "しょ",
  shu: "しゅ",
  si: "し",
  so: "そ",
  su: "す",
  sya: "しゃ",
  sye: "しぇ",
  syi: "しぃ",
  syo: "しょ",
  syu: "しゅ",
  ta: "た",
  te: "て",
  tha: "てゃ",
  the: "てぇ",
  thi: "てぃ",
  tho: "てょ",
  thu: "てゅ",
  ti: "ち",
  to: "と",
  tsu: "つ",
  tu: "つ",
  tya: "ちゃ",
  tye: "ちぇ",
  tyi: "ちぃ",
  tyo: "ちょ",
  tyu: "ちゅ",
  u: "う",
  va: "ヴぁ",
  ve: "ヴぇ",
  vi: "ヴぃ",
  vo: "ヴぉ",
  vu: "ヴ",
  wa: "わ",
  we: "ゑ",
  wi: "ゐ",
  wo: "を",
  wu: "う",
  xa: "ぁ",
  xe: "ぇ",
  xi: "ぃ",
  xka: "ヵ",
  xke: "ヶ",
  xo: "ぉ",
  xtsu: "っ",
  xu: "ぅ",
  xwa: "ゎ",
  xya: "ゃ",
  xyo: "ょ",
  xyu: "ゅ",
  ya: "や",
  ye: "いぇ",
  yi: "い",
  yo: "よ",
  yu: "ゆ",
  za: "ざ",
  ze: "ぜ",
  zi: "じ",
  zo: "ぞ",
  zu: "ず",
  zya: "じゃ",
  zye: "じぇ",
  zyi: "じぃ",
  zyo: "じょ",
  zyu: "じゅ",
};
