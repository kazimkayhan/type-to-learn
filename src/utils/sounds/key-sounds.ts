import { Howl, Howler } from "howler";
import { KEY_SOUND_URL_PREFIX } from "@/resources/sound-resource";
import type { SoundResource } from "@/typings";

export function playKeySoundResource(soundResource: SoundResource) {
  const path = KEY_SOUND_URL_PREFIX + soundResource.filename;
  const sound = new Howl({
    format: ["wav"],
    src: path,
  });
  Howler.volume(1);
  sound.play();
}
