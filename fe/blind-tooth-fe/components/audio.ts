import * as ExpoAV from 'expo-av';

const beepSound = new ExpoAV.Audio.Sound();


ExpoAV.Audio.Sound;

export namespace Audio {

    export async function Beep() {
        const sound = new ExpoAV.Audio.Sound();
        console.log(await sound.loadAsync(require('../assets/sounds/beep.mp3'), { shouldPlay: true }));
        console.log(await sound.setPositionAsync(0));
        console.log(await sound.playAsync());
        console.log(await sound.unloadAsync());
    }
}