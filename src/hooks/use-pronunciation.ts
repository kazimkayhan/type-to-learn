import { Howl } from "howler";
import { useAtomValue } from "jotai";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { pronunciationConfigAtom } from "@/store";
import type { PronunciationType } from "@/typings";
import { romajiToHiragana } from "@/utils/kana";

const pronunciationApi = "https://dict.youdao.com/dictvoice?audio=";
const MAX_CACHED_SOUNDS = 3;

interface PronunciationPlayback {
  loop: boolean;
  onEnd?: () => void;
  onPlay?: () => void;
  rate: number;
  volume: number;
}

const soundCache = new Map<string, Howl>();
let activeHowl: Howl | null = null;

function generateWordSoundSrc(
  word: string,
  pronunciation: Exclude<PronunciationType, false>
): string {
  switch (pronunciation) {
    case "uk":
      return `${pronunciationApi}${word}&type=1`;
    case "us":
      return `${pronunciationApi}${word}&type=2`;
    case "romaji":
      return `${pronunciationApi}${romajiToHiragana(word)}&le=jap`;
    case "zh":
      return `${pronunciationApi}${word}&le=zh`;
    case "ja":
      return `${pronunciationApi}${word}&le=jap`;
    case "de":
      return `${pronunciationApi}${word}&le=de`;
    case "hapin":
    case "kk":
      return `${pronunciationApi}${word}&le=ru`;
    case "id":
      return `${pronunciationApi}${word}&le=id`;
    default:
      return "";
  }
}

function cacheKey(
  word: string,
  pronunciation: Exclude<PronunciationType, false>
): string {
  return `${pronunciation}:${word}`;
}

function getCachedHowl(
  word: string,
  pronunciation: Exclude<PronunciationType, false>
): Howl | null {
  const src = generateWordSoundSrc(word, pronunciation);
  if (src === "") {
    return null;
  }

  const key = cacheKey(word, pronunciation);
  const cached = soundCache.get(key);
  if (cached && cached.state() !== "unloaded") {
    soundCache.delete(key);
    soundCache.set(key, cached);
    return cached;
  }

  const howl = new Howl({
    format: ["mp3"],
    html5: true,
    preload: true,
    src: [src],
  });
  soundCache.set(key, howl);

  while (soundCache.size > MAX_CACHED_SOUNDS) {
    // Find the oldest entry that isn't the sound currently playing (or the
    // one we just inserted) - evicting the active Howl from the map would
    // orphan it: still playing, but no longer tracked for cleanup later.
    let oldestKey: string | undefined;
    for (const k of soundCache.keys()) {
      if (k === key) {
        continue;
      }
      if (soundCache.get(k) !== activeHowl) {
        oldestKey = k;
        break;
      }
    }
    if (!oldestKey) {
      break;
    }
    const oldestHowl = soundCache.get(oldestKey);
    oldestHowl?.stop();
    oldestHowl?.unload();
    soundCache.delete(oldestKey);
  }

  return howl;
}

function stopActiveHowl() {
  if (!activeHowl) {
    return;
  }
  activeHowl.stop();
  activeHowl = null;
}

function playCachedHowl(
  word: string,
  pronunciation: Exclude<PronunciationType, false>,
  playback: PronunciationPlayback
) {
  const howl = getCachedHowl(word, pronunciation);
  if (!howl) {
    return;
  }

  if (activeHowl) {
    activeHowl.stop();
  }

  howl.loop(playback.loop);
  howl.volume(playback.volume);
  howl.rate(playback.rate);
  howl.off("play");
  howl.off("end");
  howl.off("stop");
  howl.off("playerror");
  if (playback.onPlay) {
    howl.once("play", playback.onPlay);
  }
  if (playback.onEnd) {
    howl.once("end", playback.onEnd);
    howl.once("stop", playback.onEnd);
    howl.once("playerror", playback.onEnd);
  }

  activeHowl = howl;
  howl.seek(0);
  howl.play();
}

export default function usePronunciationSound(word: string, isLoop?: boolean) {
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom);
  const loop = useMemo(
    () => (typeof isLoop === "boolean" ? isLoop : pronunciationConfig.isLoop),
    [isLoop, pronunciationConfig.isLoop]
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const playExclusive = useCallback(() => {
    playCachedHowl(word, pronunciationConfig.type, {
      loop,
      onEnd: () => setIsPlaying(false),
      onPlay: () => setIsPlaying(true),
      rate: pronunciationConfig.rate,
      volume: pronunciationConfig.volume,
    });
  }, [
    loop,
    pronunciationConfig.rate,
    pronunciationConfig.type,
    pronunciationConfig.volume,
    word,
  ]);

  const stop = useCallback(() => {
    stopActiveHowl();
    setIsPlaying(false);
  }, []);

  return { isPlaying, play: playExclusive, playExclusive, stop };
}

export function usePrefetchPronunciationSounds(
  currentWord: string | undefined,
  nextWord: string | undefined
) {
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom);

  useLayoutEffect(() => {
    if (currentWord) {
      getCachedHowl(currentWord, pronunciationConfig.type);
    }
    if (nextWord && nextWord !== currentWord) {
      getCachedHowl(nextWord, pronunciationConfig.type);
    }
  }, [currentWord, nextWord, pronunciationConfig.type]);
}
