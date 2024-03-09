import * as ExpoAV from 'expo-av';

//const beepSound = new ExpoAV.Audio.Sound();
//beepSound.loadAsync(require('../assets/sounds/beep_v2.wav'), { shouldPlay: true }).then(console.log)

const beepSound = ExpoAV.Audio.Sound.createAsync(require('../assets/sounds/beep_v2.wav'));

export namespace Audio {

    export async function Beep() { 
        return BeepSeqence(1);
    }

    export async function BeepSeqence(times: number, pause = 0) {        
        const {sound, status} = await beepSound;
        const durationMillis = (status as any).durationMillis;
        async function action() {
            if ((times--) <= 0) { clearInterval(interval); return; }
            await sound.setPositionAsync(0);
            await sound.playAsync();
        }
        const interval = times > 1 ? setInterval(action, durationMillis + pause) : -2;
        action();
    }
}