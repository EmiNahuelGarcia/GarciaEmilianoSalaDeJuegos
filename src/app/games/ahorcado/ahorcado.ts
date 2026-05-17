import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth';
import { SupabaseService } from '../../services/supabase';
import { AudioService } from '../../services/audio';

@Component({
  selector: 'app-ahorcado',
  imports: [CommonModule],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})
export class Ahorcado implements OnInit, OnDestroy {
  auth = inject(AuthService);
  db = inject(SupabaseService);
  audio = inject(AudioService)

  palabraSecreta = signal('');
  pista = signal('');
  letrasUsadas = signal<string[]>([]);
  vidas = signal(6);
  nivel = signal(1);
  tiempo = signal(0);
  tiempoFinal = signal(0);

  jugando = signal(false);
  gameOver = signal(false);
  cargando = signal(false);
  transicionNivel = signal(false);
  resultado = signal<'victoria' | 'derrota' | ''>('');
  nombreUsuario = '';
  tiempoMaximo = 120;
  abecedario = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  timerInterval: any;
  cronometroGlobal: any;
  totalLetrasAcertadas = signal(0);

  palabras = [
    { palabra: 'POLIMORFISMO', pista: 'Propiedad que permite múltiples formas de un método.' },
    { palabra: 'RECURRENCIA', pista: 'Definición de una función en términos de sí misma.' },
    { palabra: 'ENTROPIA', pista: 'Magnitud que mide el desorden de un sistema.' },
    { palabra: 'CRYPTOGRAFIA', pista: 'Estudia técnicas de cifrado y seguridad.' },
    { palabra: 'INYECCION', pista: 'Vulnerabilidad que manipula querys a bases de datos.' },
    { palabra: 'CONCURRENCIA', pista: 'Capacidad de ejecutar múltiples procesos simultáneamente.' },
    { palabra: 'METACLASE', pista: 'Clase especial en Python que define el comportamiento de otras clases.' },
    { palabra: 'SERIALIZACION', pista: 'Conversión de un objeto en un formato para almacenar o transmitir.' },
    { palabra: 'COMPILADOR', pista: 'Programa que traduce código fuente a lenguaje máquina.' },
    { palabra: 'OPTIMIZACION', pista: 'Proceso de mejorar la eficiencia de un algoritmo.' },
    { palabra: 'PARADIGMA', pista: 'Modelo o enfoque de programación (ej. funcional, POO).' },
    { palabra: 'TRANSACCION', pista: 'Unidad de trabajo en bases de datos que debe ser atómica.' },
    { palabra: 'NORMALIZACION', pista: 'Proceso de estructurar datos en una base para reducir redundancia.' },
    { palabra: 'ALGORITMO', pista: 'Conjunto de instrucciones para resolver un problema.' },
    { palabra: 'RECURSION', pista: 'Técnica donde una función se llama a sí misma.' },
    { palabra: 'HERENCIA', pista: 'Mecanismo de POO donde una clase deriva de otra.' },
    { palabra: 'ENCAPSULAMIENTO', pista: 'Ocultación de datos y métodos dentro de una clase.' },
    { palabra: 'KERNEL', pista: 'Parte central de un sistema operativo que gestiona recursos.' },
    { palabra: 'VIRTUALIZACION', pista: 'Creación de una versión virtual de algo, como un servidor.' },
    { palabra: 'DOCKER', pista: 'Plataforma de contenerización para desarrollar, enviar y ejecutar aplicaciones .' },
    

  ];

  ngOnInit(): void {
    this.nombreUsuario = this.auth.getUsername() || 'Invitado';
  }

  palabraOculta(): string {
    const palabra = this.palabraSecreta();
    if (!palabra) return '';

    return palabra
      .split('')
      .map(letra => (this.letrasUsadas().includes(letra) ? letra : '_'))
      .join('');
  }

  spriteMostrado() {
    const vidas = this.vidas();
    if (this.resultado() === 'derrota') return 'assets/ahorcado-assets/ahorcado-gameOver.png';
    if (vidas <= 0) return 'assets/ahorcado-assets/ahorcado-7.png';
    return `assets/ahorcado-assets/ahorcado-${7 - vidas}.png`;
  }

  iniciarJuego(): void {
    this.nivel.set(1);
    this.tiempoFinal.set(0);
    this.totalLetrasAcertadas.set(0);
    this.gameOver.set(false);
    this.resultado.set('');
    this.stopCronometroGlobal();
    this.iniciarCronometroGlobal();
    this.cargarNivel();
    this.audio.playAudioAhorcado();
  }

  cargarNivel(): void {
    this.cargando.set(true);
    this.jugando.set(false);
    this.letrasUsadas.set([]);
    this.vidas.set(6);
    this.tiempo.set(0);
    this.stopCronometro();

    setTimeout(() => {
      const pool = this.palabras.filter(p => p.palabra !== this.palabraSecreta());
      const random = pool[Math.floor(Math.random() * pool.length)];

      this.palabraSecreta.set(random.palabra);
      this.pista.set(random.pista);
      this.cargando.set(false);
      this.jugando.set(true);
      this.iniciarCronometro();
    }, 600);
  }

  intento(letra: string): void {
    if (!this.jugando() || this.letrasUsadas().includes(letra)) return;

    this.letrasUsadas.update(lista => [...lista, letra]);

    if (!this.palabraSecreta().includes(letra)) {
      this.vidas.update(v => v - 1);
      this.audio.playEfectoError();

      if (this.vidas() === 0) {
        this.morir();
      }

      return;
    }

    this.verificarVictoriaNivel();
  }

  verificarVictoriaNivel(): void {
    if (this.palabraOculta().includes('_')) return;

    this.stopCronometro();
    this.jugando.set(false);
    this.transicionNivel.set(true);

    const letrasAcertadasEnNivel = this.palabraSecreta().length;
    this.totalLetrasAcertadas.update(total => total + letrasAcertadasEnNivel);

    if (this.nivel() < 3) {
      setTimeout(() => {
        this.nivel.update(n => n + 1);
        this.transicionNivel.set(false);
        this.cargarNivel();
      }, 1200);
      return;
    }

    this.transicionNivel.set(false);
    this.finalizar('victoria');
  }

  morir(): void {
    this.jugando.set(false);
    this.stopCronometro();

    setTimeout(() => {
      this.finalizar('derrota');
    }, 3000);
  }

  stopCronometro(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  iniciarCronometro(): void {
    this.stopCronometro();

    this.timerInterval = setInterval(() => {
      this.tiempo.update(t => t + 1);

      if (this.tiempo() >= this.tiempoMaximo) {
        this.morir();
      }
    }, 1000);
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

  async finalizar(resultadoFinal: 'victoria' | 'derrota'): Promise<void> {
    this.stopCronometro();
    this.stopCronometroGlobal();
    this.transicionNivel.set(false);

    if (resultadoFinal === 'victoria') {
      this.audio.playMusicaVictoryAhorcado();
    } else {
      this.audio.playMusicaGameOver();
    }

    this.resultado.set(resultadoFinal);
    this.gameOver.set(true);
    const letrasNivelActual = this.letrasUsadas().filter(letra =>
      this.palabraSecreta().includes(letra)
    ).length;
    const victoria = resultadoFinal === 'victoria' ? 1 : 0;
    const derrota = resultadoFinal === 'derrota' ? 1 : 0;
    const totalFinal = this.totalLetrasAcertadas() + letrasNivelActual;
    const tiempoJuego = this.tiempoFinal();

    //await this.placeholderInsertarEstadisticas({ victoria, derrota, tiempoJuego, totalFinal });
  }


  ngOnDestroy(): void {
    this.stopCronometro();
    this.stopCronometroGlobal();
    if (this.audio) {
      this.audio.stopMusica();
    }
  }

}
