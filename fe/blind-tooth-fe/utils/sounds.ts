import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

type SoundMode = "on" | "off";

const SOUND_MODE_KEY = "soundSettings";

export function useSoundsMode() {
  const { getItem, setItem } = useAsyncStorage(SOUND_MODE_KEY);
  const [soundsMode, setSoundsMode] = useState<SoundMode | null>(null);

  useEffect(() => {
    (async () => {
      const value = await getItem();
      setSoundsMode((value as SoundMode) ?? "off");
    })();
  }, [getItem]);

  async function storeSoundsMode(value: SoundMode) {
    try {
      await setItem(value);
      storeSoundsMode(value);
    } catch (e) {
      console.error(e);
    }
  }

  return { soundsMode, storeSoundsMode };
}
