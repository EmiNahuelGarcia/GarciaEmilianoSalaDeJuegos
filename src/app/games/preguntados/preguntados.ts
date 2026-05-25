import { Component, inject, signal, WritableSignal, OnInit, OnDestroy } from '@angular/core';
import { preguntadosApiService } from '../../services/preguntadosApi';
import { Ipreguntados } from '../../models/preguntados-interface';
import { AuthService } from '../../services/auth';
import { SupabaseService } from '../../services/supabase';
import { AudioService } from '../../services/audio';


@Component({
  selector: 'app-preguntados',
  imports: [],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css',
})
export class Preguntados implements OnInit, OnDestroy {
  apiPreguntados = inject(preguntadosApiService);
  auth = inject(AuthService);
  db = inject(SupabaseService);
  audio = inject(AudioService);

  jugando = signal(false);
  terminado = signal(false);
  cargando = signal(false);
  resultado = signal<'victoria' | 'derrota' | ''>('');
  vidas = signal(5);
  nombreUsuario = "Invitado";
  aciertosTotales = signal(0);
  tiempoInicio = signal(0);
  tiempoMaximo: number = 60;
  tiempoFinal = signal(0);
  cronometroGlobal: any;
  timerInterval: any;
  pista = signal('');
  pregunta = signal('');
  opciones = signal<string[]>([]);
  nivel = signal(0);

  trivias = this.apiPreguntados.trivia;
  triviaActual = signal<Ipreguntados | null>(null);
  triviasRestantes = signal<Ipreguntados[]>([]);
  triviasRespondidas = signal<Ipreguntados[]>([]);

  async ngOnInit(): Promise<void> {
    this.apiPreguntados.obtenerPreguntas();
    this.nombreUsuario = this.auth.getUsername() || 'Invitado';
    await this.traerPreguntas();
  }

  traerPreguntas(): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.apiPreguntados.trivia()) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  setupTrivia() {
    const triviasDisponibles = this.triviasRestantes() || [];

    if (triviasDisponibles.length === 0 || this.aciertosTotales() === 15) {
      this.terminarJuego('victoria');
      return;
    }

    const randomIndex = Math.floor(Math.random() * triviasDisponibles.length);
    const triviaElegida = triviasDisponibles.splice(randomIndex, 1)[0];

    this.triviasRestantes.set(triviasDisponibles);
    this.triviaActual.set(triviaElegida);
    this.pregunta.set(triviaElegida.pregunta);
    this.opciones.set(triviaElegida.opciones);
    this.pista.set(triviaElegida.pista);
  }

  iniciar(): void {
    this.triviasRestantes.set([...this.trivias()] );
    this.vidas.set(5);
    this.aciertosTotales.set(0);
    this.tiempoFinal.set(0);
    this.terminado.set(false);
    this.resultado.set('');
    this.triviaActual.set(null);
    this.triviasRespondidas.set([]);
    this.cargarNivel();
    this.iniciarCronometroGlobal();
  }

  cargarNivel(): void {
    this.cargando.set(true);
    this.jugando.set(false);
    this.tiempoInicio.set(0);
    setTimeout(() => {
      this.setupTrivia();
      this.cargando.set(false);
      this.jugando.set(true);
      this.audio.playMusicaPreguntados();
      this.startTimer();
    }, 2000);
  }

  comprobarRespuesta(opcionSeleccionada: string) {
    const pregunta = this.triviaActual();
    this.stopTimer();
    if (opcionSeleccionada === pregunta?.respuesta_correcta) {
      this.audio.playAciertoPreguntados();
      this.aciertosTotales.update(v => v + 1);
      this.startTimer();
      this.setupTrivia();
    }
    else {
      this.audio.playErrorPreguntados();
      this.restarVida();
      this.startTimer();
      this.setupTrivia();
    }
  }
  restarVida(): void {
    this.vidas.update(v => v - 1);
    if (this.vidas() <= 0) {
      this.terminarJuego('derrota');
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
        this.stopTimer();
        this.restarVida();

        if (this.vidas() > 0) {
          this.setupTrivia();
          this.startTimer();
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

  ngOnDestroy(): void {
    this.stopTimer();
    this.stopCronometroGlobal();
    this.audio.stopMusica();
  }

  async terminarJuego(resultado: 'victoria' | 'derrota') {
    this.audio.stopMusica();
    this.terminado.set(true);
    this.stopTimer();
    this.stopCronometroGlobal();
    if (resultado === 'victoria') {
      this.audio.playMusicaVictoryPreguntados();
    } else {
      this.audio.playMusicaGameOverPreguntados();
    }
    this.jugando.set(false);
    this.resultado.set(resultado);

    const victoria = resultado === 'victoria' ? 1 : 0;
    const derrota = resultado === 'derrota' ? 1 : 0;
    const tiempo_de_juego = this.tiempoFinal();
    const puntos = this.aciertosTotales();

    await this.db.insertStats('preguntados', victoria, derrota, tiempo_de_juego, puntos, this.auth.getUserUuid(), this.nombreUsuario);
  }



}

