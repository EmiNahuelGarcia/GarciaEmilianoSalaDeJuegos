import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AudioService {
    audio: HTMLAudioElement;

    constructor() {
        this.audio = new Audio();
        this.audio.loop = true;
        this.audio.volume = 0.3;
    }

    pausarMusica() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    stopMusica() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio.src = '';
        }
    }

    playAudioAhorcado() {
        this.stopMusica();
        this.audio.loop = true;
        this.audio.src = 'assets/ahorcado-assets/ahorcado-song.ogg';
        this.audio.volume = 0.3;
        this.audio.play();
    }


    playEfectoError() {
        const quemado = new Audio('assets/ahorcado-assets/ahorcado-error.ogg');
        quemado.volume = 0.2;
        quemado.play();
    }

    playMusicaGameOver() {
        this.pausarMusica();
        this.audio.loop = false;
        this.audio.src = 'assets/ahorcado-assets/ahorcado-badEnd.ogg';
        this.audio.volume = 0.3;
        this.audio.play();
    }

    playMusicaVictoryAhorcado() {
        this.pausarMusica();
        this.audio.src = 'assets/ahorcado-assets/ahorcado-goodEnd.ogg';
        this.audio.volume = 0.1;
        this.audio.play();
    }
}