import { Component, inject } from '@angular/core';
import { IJuegoCard } from '../../models/juegos-card-interface';
import { AuthService } from '../../services/auth';
import { JuegosCard } from './components/juegos-card';

@Component({
  selector: 'app-home',
  imports: [JuegosCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  auth = inject(AuthService);
  cards : IJuegoCard[] = [
    {
      title: 'El Ahorcado',
      image: '/assets/ahorcado-assets/ahorcado-portada.png',
      textImage: 'Imagen del juego ahorcado',
      nameGame: 'El Ahorcado',
      descriptionGame: 'trata de adivinar la palabra según la sugerencia de letras, dentro del tiempo limite',
      link: '/juegos/ahorcado',
      textButton: 'Jugar Ahora'
    },
    {
      title: 'Juego 2',
      image: '/assets/placeholder.png',
      textImage: 'Imagen del Juego 2',
      nameGame: 'Nombre del Juego 2',
      descriptionGame: 'Descripción del Juego 2',
      link: 'https://www.youtube.com/watch?v=c2jprxwkr0k',
      textButton: 'Jugar Ahora'
    },
    {
      title: 'Juego 3',
      image: '/assets/placeholder.png',
      textImage: 'Imagen del Juego 3',
      nameGame: 'Nombre del Juego 3',
      descriptionGame: 'Descripción del Juego 3',
      link: 'https://www.youtube.com/watch?v=c2jprxwkr0k',
      textButton: 'Jugar Ahora'
    },
    {
      title: 'Juego 4',
      image: '/assets/placeholder.png',
      textImage: 'Imagen del Juego 4',
      nameGame: 'Nombre del Juego 4',
      descriptionGame: 'Descripción del Juego 4',
      link: 'https://www.youtube.com/watch?v=c2jprxwkr0k',
      textButton: 'Jugar Ahora'
    }
  ]
}
