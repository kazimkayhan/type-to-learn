import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import {
  KEY_SOUND_URL_PREFIX,
  keySoundResources,
  SOUND_URL_PREFIX,
} from "@/resources/sound-resource";
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
  const [keySoundUrl, setKeySoundUrl] = useState(
    `${KEY_SOUND_URL_PREFIX}${keyResource.filename}`
  );

  useEffect(() => {
    if (
      !keySoundResources.some(
        (item) =>
          item.filename === keyResource.filename && item.key === keyResource.key
      )
    ) {
      const defaultKeySoundResource =
        keySoundResources.find((item) => item.key === "Default") ||
        keySoundResources[0];

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
