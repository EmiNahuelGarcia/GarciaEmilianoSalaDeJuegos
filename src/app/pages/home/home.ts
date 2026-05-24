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
      title: 'Mayor o Menor',
      image: '/assets/mayor-menor-assets/mayor-menor-portada.png',
      textImage: 'Imagen del juego mayor o menor',
      nameGame: 'Mayor o Menor',
      descriptionGame: 'Adivina si el siguiente número de nivel de monstruo es mayor o menor que el actual',
      link: '/juegos/mayor-menor',
      textButton: 'Jugar Ahora'
    },
    {
      title: 'Preguntados',
      image: '/assets/preguntados-assets/preguntados-portada.png',
      textImage: 'Imagen del juego preguntados',
      nameGame: 'Preguntados',
      descriptionGame: 'Adivina las respuestas a preguntas de cultura anime dentro del tiempo limite',
      link: '/juegos/preguntados',
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
