import { Component, inject, signal } from '@angular/core';
import { SupabaseService } from '../../services/supabase';
import { SpinnerComponent } from '../../shared/spinner/spinnerComponent';

@Component({
  selector: 'app-resultados',
  imports: [SpinnerComponent],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css',
})
export class Resultados {
  db = inject(SupabaseService);
  scores = signal<any[]>([]);
  juego = signal<string>('ahorcado');
  loading = signal<boolean>(true);

  async ngOnInit() {
    await this.cargarScores('ahorcado');
}

  async cargarScores(juego: any) {
    this.juego.set(juego);
    this.loading.set(true);
    const data= await this.db.getAllStats(juego);
    this.scores.set(data || []);
    this.loading.set(false);
  }
}


