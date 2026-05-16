import { Component, input, InputSignal } from '@angular/core';
import { IJuegoCard } from '../../../models/juegos-card-interface';

@Component({
    selector: 'app-juegos-card',
    imports: [],
    templateUrl: './juegos-card.html',
    styleUrl: './juegos-card.css',
})
export class JuegosCard {
    title: InputSignal<string> = input('PlaceHolder nombre del juego');
    image: InputSignal<string> = input('/assets/placeholder.png');
    textImage: InputSignal<string> = input('placeholder texto alternativo de la imagen');
    nameGame: InputSignal<string> = input('en proceso');
    descriptionGame: InputSignal<string> = input('placeholder descripcion');
    link: InputSignal<string> = input('https://www.youtube.com/watch?v=c2jprxwkr0k');
    textButton: InputSignal<string> = input('placeholder texto del boton');



}


