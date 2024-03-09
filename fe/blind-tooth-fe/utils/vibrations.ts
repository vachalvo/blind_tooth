import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Vibration } from "react-native";

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

const pattern_sym_short_one_shot: number[] = [80, 80];
const pattern_sym_short_two_shot: number[] = [
  ...pattern_sym_short_one_shot,
  ...pattern_sym_short_one_shot,
];
const pattern_sym_short_thee_shot: number[] = [
  ...pattern_sym_short_one_shot,
  ...pattern_sym_short_one_shot,
  ...pattern_sym_short_one_shot,
];

export function vibrateShort() {
  Vibration.vibrate(pattern_sym_short_one_shot);
}

export function vibrateMedium() {
  Vibration.vibrate(pattern_sym_short_two_shot);
}

export function vibrateLong() {
  Vibration.vibrate(pattern_sym_short_thee_shot);
}
