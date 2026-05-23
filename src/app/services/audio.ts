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
        const error = new Audio('assets/ahorcado-assets/ahorcado-error.ogg');
        error.volume = 0.2;
        error.play();
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

    //mayor-menor

    playAudioMayorMenor() {
        this.stopMusica();
        this.audio.loop = true;
        this.audio.src = 'assets/mayor-menor-assets/mayor-menor-song.ogg';
        this.audio.volume = 0.05;
        this.audio.play();
    }

    playEfectoErrorMayorMenor() {
        const error = new Audio('assets/mayor-menor-assets/yugi-error.ogg');
        error.volume = 0.2;
        error.play();
    }


    playMusicaVictoryMayorMenor() {
        this.pausarMusica();
        this.audio.src = 'assets/mayor-menor-assets/mayor-menor-victory.ogg';
        this.audio.volume = 0.1;
        this.audio.play();
    }

    playMusicaGameOverMayorMenor() {
        this.pausarMusica();
        this.audio.loop = false;
        this.audio.src = 'assets/mayor-menor-assets/mayor-menor-defeat.ogg';
        this.audio.volume = 0.3;
        this.audio.play();
    }

    playAciertoMayorMenor() {
        const acierto = new Audio('assets/mayor-menor-assets/yugi-acierto.ogg');
        acierto.volume = 0.2;
        acierto.play();
    }


}