import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

type VibrationMode = "off" | "soft" | "medium" | "heavy";

const VIBRATION_MODE_KEY = "vibrationSettings";

export function useVibrationsMode() {
  const { getItem, setItem } = useAsyncStorage(VIBRATION_MODE_KEY);
  const [vibrationsMode, setVibrationsMode] = useState<VibrationMode | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const value = await getItem();
      setVibrationsMode((value as VibrationMode) ?? "medium");
    })();
  }, [getItem]);

  async function storeVibrationsMode(value: VibrationMode) {
    try {
      await setItem(value);
      setVibrationsMode(value);
    } catch (e) {
      console.error(e);
    }
  }

  return { vibrationsMode, storeVibrationsMode };
}
