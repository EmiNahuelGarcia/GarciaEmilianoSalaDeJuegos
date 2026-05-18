import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth';
import { SupabaseService } from '../../services/supabase';
import { AudioService } from '../../services/audio';
import { CARTAS_MAYOR_MENOR, IMayorMenorCard } from '../../models/mayor-menor-card.interface';

@Component({
  selector: 'app-mayor-menor',
  imports: [],
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.css',
})
export class MayorMenor implements OnInit, OnDestroy {
  auth = inject(AuthService);
  db = inject(SupabaseService);
  audio = inject(AudioService)

  jugando = signal(false);
  terminado = signal(false);
  cargando = signal(false);
  resultado = signal<'victoria' | 'derrota' | ''>('');
  vidas = signal(5);
  nombreUsuario = signal<string>('Invitado');
  aciertosTotales = signal(0);
  tiempoInicio = signal(0);
  tiempoMaximo: number = 20;
  tiempoFinal = signal(0);
  cronometroGlobal: any;
  timerInterval: any;
  mazo: IMayorMenorCard[] = [];
  cartaActual = signal<IMayorMenorCard | null>(null);

  ngOnInit(): void {
    this.nombreUsuario.set(this.auth.getUsername() || 'Invitado');
  }

  inicializarMazo() {
    this.mazo = [...CARTAS_MAYOR_MENOR].sort(() => Math.random() - 0.5);
  }

  iniciar(): void {
    this.vidas.set(5);
    this.aciertosTotales.set(0);
    this.tiempoFinal.set(0);
    this.terminado.set(false);
    this.resultado.set('');
    this.inicializarMazo();
    this.iniciarCronometroGlobal();
    this.cargarNivel();
    //placeholder para el audio

  }

  cargarNivel(): void {
    this.cargando.set(true);
    this.jugando.set(false);
    this.tiempoInicio.set(0);
    //placeholder intro
    setTimeout(() => {
      this.cartaActual.set(this.mazo.pop() || null);
      this.cargando.set(false);
      this.jugando.set(true);
      //musica del juego
      this.startTimer();
    }, 800);
  }

  intento(eleccion: 'mayor' | 'menor'): void {
    if (!this.jugando()) return;
    const proximaCarta = this.mazo.pop();
    const cartaActual = this.cartaActual()?.nivel;
    const cartaProxima = proximaCarta?.nivel;
    this.stopTimer();
    const acierto = (eleccion === 'mayor' && cartaProxima! >= cartaActual!) || (eleccion === 'menor' && cartaProxima! <= cartaActual!);
    if (acierto) {
      this.aciertosTotales.update(n => n + 1);
      this.sacarOtraCarta(proximaCarta);
    } else {
      this.restarVida();
      this.sacarOtraCarta(proximaCarta);
    }
  }

  sacarOtraCarta(proximaCarta: IMayorMenorCard | undefined): void {
    if (this.mazo.length === 0) {
      this.terminarJuego('victoria');
    } else {
      this.cartaActual.set(proximaCarta ?? null);
      this.startTimer();
    }
  }

  restarVida(): void {
    this.vidas.update(v => v - 1);
    if (this.vidas() <= 0) {
      //poner musica de derrota
      this.terminarJuego('derrota');
    } else {
      //poner musica de error
      console.log('¡Error! Te quedan ' + this.vidas() + ' vidas.');
    }
  }

  startTimer(): void {
    this.stopTimer();
    this.tiempoInicio.set(0);
    this.timerInterval = setInterval(() => {
      if (this.terminado()) {
        this.stopTimer();
        return;
      }
      this.tiempoInicio.update(t => t + 1);
      if (this.tiempoInicio() >= this.tiempoMaximo) {
        this.restarVida();
        this.stopTimer();
        if (this.vidas() > 0) {
          this.sacarOtraCarta(this.mazo.pop());
        }
      }

    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  iniciarCronometroGlobal(): void {
    if (this.cronometroGlobal) return;
    this.cronometroGlobal = setInterval(() => {
      this.tiempoFinal.update(t => t + 1);
    }, 1000);
  }

  stopCronometroGlobal(): void {
    if (!this.cronometroGlobal) return;
    clearInterval(this.cronometroGlobal);
    this.cronometroGlobal = null;
  }

  terminarJuego(resultado: 'victoria' | 'derrota') {
    this.terminado.set(true);
    this.stopTimer();
    this.stopCronometroGlobal();
    this.jugando.set(false);
    this.resultado.set(resultado);

    const victoria = resultado === 'victoria' ? 1 : 0;
    const derrota = resultado === 'derrota' ? 1 : 0;
    const tiempo_de_juego = this.tiempoFinal();
    const puntos = this.aciertosTotales();

    //aca tengo que poner las stats en la base de datos 
  }

  ngOnDestroy(): void {
    this.stopTimer();
    this.stopCronometroGlobal();
    if (this.audio) {
      this.audio.stopMusica();
    }
  }
}