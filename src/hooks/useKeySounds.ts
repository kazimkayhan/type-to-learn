import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import {
  KEY_SOUND_URL_PREFIX,
  keySoundResources,
  SOUND_URL_PREFIX,
} from "@/resources/soundResource";
import { hintSoundsConfigAtom, keySoundsConfigAtom } from "@/store";
import noop from "@/utils/noop";

export type PlayFunction = ReturnType<typeof useSound>[0];

export default function useKeySound(): [
  PlayFunction,
  PlayFunction,
  PlayFunction,
] {
  const {
    isOpen: isKeyOpen,
    isOpenClickSound,
    volume: keyVolume,
    resource: keyResource,
  } = useAtomValue(keySoundsConfigAtom);
  const setKeySoundsConfig = useSetAtom(keySoundsConfigAtom);
  const {
    isOpen: isHintOpen,
    isOpenWrongSound,
    isOpenCorrectSound,
    volume: hintVolume,
    wrongResource,
    correctResource,
  } = useAtomValue(hintSoundsConfigAtom);

  const [keySoundUrl, setKeySoundUrl] = useState(() => {
    if (!keyResource?.filename) {
      const fallback = keySoundResources[0] ?? {
        filename: "Default.wav",
        key: "Default",
        name: "Default",
      };
      return `${KEY_SOUND_URL_PREFIX}${fallback.filename}`;
    }
    return `${KEY_SOUND_URL_PREFIX}${keyResource.filename}`;
  });

  useEffect(() => {
    if (
      !(
        keyResource?.filename &&
        keySoundResources.some(
          (item) =>
            item.filename === keyResource.filename &&
            item.key === keyResource.key
        )
      )
    ) {
      const defaultKeySoundResource = keySoundResources.find(
        (item) => item.key === "Default"
      ) ||
        keySoundResources[0] || {
          filename: "Default.wav",
          key: "Default",
          name: "Default",
        };

      setKeySoundUrl(
        `${KEY_SOUND_URL_PREFIX}${defaultKeySoundResource.filename}`
      );
      setKeySoundsConfig((prev) => ({
        ...prev,
        resource: defaultKeySoundResource,
      }));
    }
  }, [keyResource, setKeySoundsConfig]);

  const [playClickSound] = useSound(keySoundUrl, {
    interrupt: true,
    volume: keyVolume,
  });
  const [playWrongSound] = useSound(
    `${SOUND_URL_PREFIX}${wrongResource.filename}`,
    {
      interrupt: true,
      volume: hintVolume,
    }
  );
  const [playCorrectSound] = useSound(
    `${SOUND_URL_PREFIX}${correctResource.filename}`,
    {
      interrupt: true,
      volume: hintVolume,
    }
  );

  return [
    isKeyOpen && isOpenClickSound ? playClickSound : noop,
    isHintOpen && isOpenWrongSound ? playWrongSound : noop,
    isHintOpen && isOpenCorrectSound ? playCorrectSound : noop,
  ];
}
