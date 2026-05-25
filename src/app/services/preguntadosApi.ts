import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';


@Injectable({
    providedIn: 'root',
})
export class preguntadosApiService {
    http = inject(HttpClient);
    keyApiPreguntados: string = 'https://eminahuelgarcia.github.io/api-preguntados/api-preguntados.json';
    trivia = signal<any>(null);

    obtenerPreguntas() {
        const request = this.http.get<any>(this.keyApiPreguntados);

        const subscription = request.subscribe((data) => {
            if (data) {
                this.trivia.set(data);
            }
            subscription.unsubscribe();
        });

    }
}