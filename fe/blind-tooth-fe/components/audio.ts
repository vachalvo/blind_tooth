import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import * as ExpoAV from "expo-av";
import { SoundObject } from "expo-av/build/Audio/Sound";
import { Vibration } from "react-native";

const beepSound = ExpoAV.Audio.Sound.createAsync(
  require("../assets/sounds/beep_v2.wav")
);
const beepShort = ExpoAV.Audio.Sound.createAsync(
  require("../assets/sounds/beep_short.wav")
).then((x) => {
  x.sound.setVolumeAsync(1);
  return x;
});
const beepMix = ExpoAV.Audio.Sound.createAsync(
  require("../assets/sounds/beep_mix.wav")
);

const $2beep_short = ExpoAV.Audio.Sound.createAsync(
  require("../assets/sounds/2beep_short.wav")
);
const $3beep_short = ExpoAV.Audio.Sound.createAsync(
  require("../assets/sounds/3beep_short.wav")
);
const OK_beep_long = ExpoAV.Audio.Sound.createAsync(
  require("../assets/sounds/OK_beep_long.wav")
);
const wrongway_beep_shot = ExpoAV.Audio.Sound.createAsync(
  require("../assets/sounds/wrongway_beep_shot.wav")
);

const pattern_OK_beep_long: number[] = [0, 400];
const patter_wrong_way: number[] = [
  80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80,
];
const pattern_one_shot: number[] = [80, 80];
const pattern_two_shot: number[] = [...pattern_one_shot, ...pattern_one_shot];
const pattern_thee_shot: number[] = [
  ...pattern_one_shot,
  ...pattern_one_shot,
  ...pattern_one_shot,
];

async function audioSequence(
  this: Promise<SoundObject>,
  times: number,
  pause?: number,
  vibPatern?: number[],
  muteSound?: boolean,
  muteVibrator?: boolean
) {
  pause ||= 0;
  const { sound, status } = await this;
  const durationMillis = (status as any).durationMillis;
  async function action() {
    if (times-- <= 0) {
      clearInterval(interval);
      return;
    }
    if (!muteSound) {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    }
    if (!muteVibrator) {
      Vibration.vibrate(vibPatern);
    }
  }
  console.log(durationMillis, arguments, durationMillis + pause, pause);
  const interval = times > 1 ? setInterval(action, durationMillis + pause) : -1;
  action();
}

export namespace Audio {
  export const BeepSeqence = audioSequence.bind(beepSound);
  export const ShortSeqence = audioSequence.bind(beepShort);
  export const MixSeqence = audioSequence.bind(beepMix);

  export const Ok_way = audioSequence.bind(
    OK_beep_long,
    1,
    0,
    pattern_OK_beep_long
  );
  export const Wrong_way = audioSequence.bind(
    wrongway_beep_shot,
    1,
    0,
    patter_wrong_way
  );
  export const Bad_Right_1 = audioSequence.bind(
    $3beep_short,
    1,
    0,
    pattern_thee_shot
  );
  export const Bad_Right_2 = audioSequence.bind(
    $3beep_short,
    2,
    -800,
    pattern_thee_shot
  );
  export const Bad_Left_1 = audioSequence.bind(
    $2beep_short,
    1,
    0,
    pattern_two_shot
  );
  export const Bad_Left_2 = audioSequence.bind(
    $2beep_short,
    2,
    -800,
    pattern_two_shot
  );
}
