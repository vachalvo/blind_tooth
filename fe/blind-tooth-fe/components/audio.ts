import * as ExpoAV from 'expo-av';
import { SoundObject } from 'expo-av/build/Audio/Sound';

//const beepSound = new ExpoAV.Audio.Sound();
//beepSound.loadAsync(require('../assets/sounds/beep_v2.wav'), { shouldPlay: true }).then(console.log)

const beepSound = ExpoAV.Audio.Sound.createAsync(require('../assets/sounds/beep_v2.wav'));
const beepShort = ExpoAV.Audio.Sound.createAsync(require('../assets/sounds/beep_short.wav')).then(x => {
    x.sound.setVolumeAsync(.05);
    return x;
});
const beepMix = ExpoAV.Audio.Sound.createAsync(require('../assets/sounds/beep_mix.wav'));

async function audioSequence(this: Promise<SoundObject>, times: number, pause = 0) {
    const { sound, status } = await this;
    const durationMillis = (status as any).durationMillis;
    async function action() {
        if ((times--) <= 0) { clearInterval(interval); return; }
        await sound.setPositionAsync(0);
        await sound.playAsync();
    }
    const interval = times > 1 ? setInterval(action, durationMillis + pause) : -2;
    action();
}

export namespace Audio {
    export const BeepSeqence = audioSequence.bind(beepSound);
    export const ShortSeqence = audioSequence.bind(beepShort);
    export const MixSeqence = audioSequence.bind(beepMix);
}