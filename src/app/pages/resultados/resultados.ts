import { Component, computed, inject, signal } from '@angular/core';
import { SupabaseService } from '../../services/supabase';
import { SpinnerComponent } from '../../shared/spinner/spinnerComponent';
import { IJuegoRanking, JuegoActivoId, JuegoId } from '../../models/JuegoRanking-interface';



@Component({
  selector: 'app-resultados',
  imports: [SpinnerComponent],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css',
})
export class Resultados {
  db = inject(SupabaseService);
  scores = signal<any[]>([]);
  juego = signal<JuegoActivoId>('ahorcado');
  loading = signal<boolean>(true);
  juegos: IJuegoRanking[] = [
    { id: 'ahorcado', label: 'Ahorcado', displayName: 'Ahorcado', enabled: true },
    { id: 'mayorMenor', label: 'Mayor - Menor', displayName: 'Mayor - Menor', enabled: true },
    { id: 'juego-3', label: 'Juego 3', displayName: 'Juego 3', enabled: false },
    { id: 'juego-4', label: 'Juego 4', displayName: 'Juego 4', enabled: false },
  ];
  juegoActivo = computed(
    () => this.juegos.find((juego) => juego.id === this.juego()) ?? this.juegos[0],
  );

  async ngOnInit() {
    await this.cargarScores(this.juego());
  }

  seleccionarJuego(juego: JuegoId) {
    if (juego !== 'ahorcado' && juego !== 'mayorMenor') {
      return;
    }

    if (this.juego() === juego) {
      return;
    }

    void this.cargarScores(juego);
  }

  async cargarScores(juego: JuegoActivoId) {
    this.juego.set(juego);
    this.loading.set(true);
    const data = await this.db.getAllStats(juego);
    this.scores.set(data || []);
    this.loading.set(false);
  }
}


