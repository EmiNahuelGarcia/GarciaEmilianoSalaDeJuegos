import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, inject, signal, computed } from '@angular/core';
import { AuthService } from '../../services/auth';
import { SupabaseService } from '../../services/supabase';
import { AudioService } from '../../services/audio';
import { ICoin, IVehicle, VehicleSpriteName } from '../../models/froggy-interface';

const INITIAL_VEHICLES: IVehicle[] = [
  { x: 0, y: 260, width: 80, height: 40, speed: 4, sprite: 'coche-1' },
  { x: 300, y: 260, width: 80, height: 40, speed: 4, sprite: 'coche-2' },
  { x: 600, y: 260, width: 80, height: 40, speed: 4, sprite: 'coche-3' },
  { x: 150, y: 330, width: 80, height: 40, speed: -5, sprite: 'coche-2' },
  { x: 450, y: 330, width: 80, height: 40, speed: -5, sprite: 'coche-3' },
  { x: 750, y: 330, width: 80, height: 40, speed: -5, sprite: 'coche-1' },
  { x: 0, y: 500, width: 80, height: 40, speed: 4, sprite: 'coche-3' },
  { x: 300, y: 500, width: 80, height: 40, speed: 4, sprite: 'coche-1' },
  { x: 600, y: 500, width: 80, height: 40, speed: 4, sprite: 'coche-2' },
  { x: 150, y: 420, width: 80, height: 40, speed: -6, sprite: 'coche-1' },
  { x: 450, y: 420, width: 80, height: 40, speed: -6, sprite: 'coche-2' },
  { x: 750, y: 420, width: 80, height: 40, speed: -6, sprite: 'coche-3' },
  { x: 0, y: 580, width: 80, height: 40, speed: 3, sprite: 'coche-2' },
  { x: 300, y: 580, width: 80, height: 40, speed: 3, sprite: 'coche-3' },
  { x: 600, y: 580, width: 80, height: 40, speed: 3, sprite: 'coche-1' },
];

const INITIAL_COINS: ICoin[] = [
  { x: 150, y: 300, size: 40 },
  { x: 300, y: 400, size: 40 },
  { x: 400, y: 500, size: 40 },
  { x: 200, y: 600, size: 40 },
  { x: 400, y: 280, size: 40 },
  { x: 250, y: 300, size: 40 },
  { x: 400, y: 400, size: 40 },
  { x: 500, y: 500, size: 40 },
  { x: 650, y: 280, size: 40 },
  { x: 700, y: 350, size: 40 },
];

const INITIAL_FROG_POSITION = { x: 350, y: 730 } as const;

@Component({
  selector: 'app-froggy',
  imports: [],
  templateUrl: './froggy.html',
  styleUrl: './froggy.css',
})
export class Froggy implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  auth = inject(AuthService);
  db = inject(SupabaseService);
  audio = inject(AudioService);

  private readonly vehicleSpritePaths: Record<'coche-1' | 'coche-2' | 'coche-3', string> = {
    'coche-1': 'assets/froggy-assets/coche-1.png',
    'coche-2': 'assets/froggy-assets/coche-2.png',
    'coche-3': 'assets/froggy-assets/coche-3.png',
  };

  private readonly vehicleSprites: Record<VehicleSpriteName, HTMLImageElement> = {
    'coche-1': new Image(),
    'coche-2': new Image(),
    'coche-3': new Image(),
  };

  vehiculos: IVehicle[] = [...INITIAL_VEHICLES];

  coins: ICoin[] = [...INITIAL_COINS];

  coinsSprite = new Image();

  backgroundImage = new Image();
  frogIdleSprite = new Image();
  frogMoveSprite = new Image();

  nombreUsuario = 'Invitado';
  vidas = signal(3);
  puntos = signal(0);
  jugando = signal(false);
  resultado = signal<'victoria' | 'derrota' | ''>('');
  tiempoInicio = signal(0);
  tiempoMaximo = 100;
  tiempoFinal = signal(0);
  tiempoBonus = signal(0);
  readonly tiempoRestante = computed(() => Math.max(0, this.tiempoMaximo - this.tiempoInicio()));
  timerInterval: ReturnType<typeof setInterval> | null = null;
  cronometroGlobal: ReturnType<typeof setInterval> | null = null;
  vehiculosInterval: ReturnType<typeof setInterval> | null = null;

  initialFrogX = INITIAL_FROG_POSITION.x;
  initialFrogY = INITIAL_FROG_POSITION.y;
  frogX: number = INITIAL_FROG_POSITION.x;
  frogY: number = INITIAL_FROG_POSITION.y;
  frogSize: number = 60;
  direction: 'up' | 'down' | 'left' | 'right' = 'up';
  isMoving = false;
  private lastMoveTime = 0;
  private moveTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly repeatDelayMs = 180;
  private readonly frogCollisionPadding = 12;
  private readonly vehicleCollisionPadding = 10;

  private readonly directionAngles: Record<'up' | 'down' | 'left' | 'right', number> = {
    up: 0,
    right: Math.PI / 2,
    down: Math.PI,
    left: -Math.PI / 2,
  };

  ngOnInit(): void {
    this.nombreUsuario = this.auth.getUsername() || 'Invitado';
  }

  ngOnDestroy(): void {
    this.stopTimer();
    this.stopCronometroGlobal();
    this.stopVehiculos();
    if (this.audio) {
      this.audio.stopMusica();
    }
  }

    
  iniciarJuego(): void {
    this.audio.playMusicaFroggy();
    this.jugando.set(true);
    this.tiempoFinal.set(0);
    this.tiempoBonus.set(0);
    this.vidas.set(3);
    this.puntos.set(0);
    this.resultado.set('');
    this.tiempoInicio.set(0);
    this.coins = INITIAL_COINS.map((coin) => ({ ...coin }));
    this.vehiculos = INITIAL_VEHICLES.map((vehiculo) => ({ ...vehiculo }));
    this.frogX = this.initialFrogX;
    this.frogY = this.initialFrogY;
    this.direction = 'up';
    this.isMoving = false;

    this.stopTimer();
    this.stopCronometroGlobal();
    this.stopVehiculos();
    this.startTimer();
    this.iniciarCronometroGlobal();
    this.iniciarMovimientoVehiculos();
    this.dibujarFrog();
  }

  async terminarJuego(resultado: 'victoria' | 'derrota'): Promise<void> {
    if (this.resultado() !== '') {
      return;
    }

    this.stopTimer();
    this.stopCronometroGlobal();
    this.stopVehiculos();

    const tiempoRestante = Math.max(0, this.tiempoMaximo - this.tiempoInicio());
    this.tiempoBonus.set(resultado === 'victoria' ? tiempoRestante : 0);
    if (resultado === 'victoria' && tiempoRestante > 0) {
      this.puntos.update((valor) => valor + tiempoRestante);
    }

    if (resultado === 'victoria') {
      this.audio.playMusicaVictoryFroggy();
    } else {
      this.audio.playMusicaGameOverFroggy();
    }
    this.jugando.set(false);
    this.resultado.set(resultado);
    const victoria = resultado === 'victoria' ? 1 : 0;
    const derrota = resultado === 'derrota' ? 1 : 0;
    const tiempo_de_juego = this.tiempoFinal();
    const puntos = this.puntos();

    await this.db.insertStats('froggy', victoria, derrota, tiempo_de_juego, puntos, this.auth.getUserUuid(), this.nombreUsuario);
  }

  verificarVictoria(): void {
    if (!(this.frogY <= 180)) {
      return;
    }

    this.terminarJuego('victoria');
  }

  verificarColisionVehiculos(): void {
    if (!this.jugando() || this.resultado() !== '') {
      return;
    }

    const frogHitbox = {
      left: this.frogX + this.frogCollisionPadding,
      right: this.frogX + this.frogSize - this.frogCollisionPadding,
      top: this.frogY + this.frogCollisionPadding,
      bottom: this.frogY + this.frogSize - this.frogCollisionPadding,
    };

    const hayChoque = this.vehiculos.some((vehiculo) => {
      const vehicleHitbox = {
        left: vehiculo.x + this.vehicleCollisionPadding,
        right: vehiculo.x + vehiculo.width - this.vehicleCollisionPadding,
        top: vehiculo.y + this.vehicleCollisionPadding,
        bottom: vehiculo.y + vehiculo.height - this.vehicleCollisionPadding,
      };

      return (
        frogHitbox.left < vehicleHitbox.right &&
        frogHitbox.right > vehicleHitbox.left &&
        frogHitbox.top < vehicleHitbox.bottom &&
        frogHitbox.bottom > vehicleHitbox.top
      );
    });

    if (!hayChoque) {
      return;
    }

    this.audio.playEfectoSplatFroggy();
    this.vidas.update((valor) => Math.max(0, valor - 1));

    if (this.vidas() <= 0) {
      this.terminarJuego('derrota');
      return;
    }

    this.reiniciarPosicionRana();
  }

  
  startTimer(): void {
    this.stopTimer();
    this.tiempoInicio.set(0);

    this.timerInterval = setInterval(() => {
      if (!this.jugando()) {
        this.stopTimer();
        return;
      }

      this.tiempoInicio.update((valor) => valor + 1);

      if (this.tiempoInicio() >= this.tiempoMaximo) {
        this.stopTimer();
        this.terminarJuego('derrota');
      }
    }, 1000);
  }

  stopTimer(): void {
    if (!this.timerInterval) {
      return;
    }

    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  iniciarCronometroGlobal(): void {
    if (this.cronometroGlobal) {
      return;
    }

    this.cronometroGlobal = setInterval(() => {
      if (!this.jugando()) {
        return;
      }

      this.tiempoFinal.update((valor) => valor + 1);
    }, 1000);
  }

  stopCronometroGlobal(): void {
    if (!this.cronometroGlobal) {
      return;
    }

    clearInterval(this.cronometroGlobal);
    this.cronometroGlobal = null;
  }

  
  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.backgroundImage.src = 'assets/froggy-assets/froggy-background.png';
    this.frogIdleSprite.src = 'assets/froggy-assets/froggy-1.png';
    this.frogMoveSprite.src = 'assets/froggy-assets/froggy-2.png';
    this.coinsSprite.src = 'assets/froggy-assets/froggy-coin.png';
    Object.entries(this.vehicleSpritePaths).forEach(([spriteKey, spritePath]) => {
      this.vehicleSprites[spriteKey as 'coche-1' | 'coche-2' | 'coche-3'].src = spritePath;
    });
    this.backgroundImage.onload = () => this.dibujarFrog();
    this.frogIdleSprite.onload = () => this.dibujarFrog();
    this.frogMoveSprite.onload = () => this.dibujarFrog();
    this.coinsSprite.onload = () => this.dibujarFrog();
    Object.values(this.vehicleSprites).forEach((sprite) => {
      sprite.onload = () => this.dibujarFrog();
    });
    this.dibujarFrog();
  }

  
  dibujarFondo() {
    const canvas = this.canvas.nativeElement;

    if (this.backgroundImage.complete && this.backgroundImage.naturalWidth > 0) {
      this.ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
      return;
    }

    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  dibujarFrog() {
    this.dibujarFondo();
    this.dibujarCoins();
    this.dibujarVehiculos();

    const sprite = this.isMoving ? this.frogMoveSprite : this.frogIdleSprite;

    if (sprite.complete && sprite.naturalWidth > 0) {
      this.ctx.save();
      this.ctx.translate(this.frogX + this.frogSize / 2, this.frogY + this.frogSize / 2);
      this.ctx.rotate(this.directionAngles[this.direction]);
      this.ctx.drawImage(
        sprite,
        -this.frogSize / 2,
        -this.frogSize / 2,
        this.frogSize,
        this.frogSize,
      );
      this.ctx.restore();
      return;
    }

    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(this.frogX, this.frogY, this.frogSize, this.frogSize);
  }

  dibujarCoins(): void {
    for (const coin of this.coins) {
      if (this.coinsSprite.complete && this.coinsSprite.naturalWidth > 0) {
        this.ctx.drawImage(this.coinsSprite, coin.x, coin.y, coin.size, coin.size);
        continue;
      }

      this.ctx.fillStyle = '#facc15';
      this.ctx.beginPath();
      this.ctx.arc(coin.x + coin.size / 2, coin.y + coin.size / 2, coin.size / 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  dibujarVehiculos(): void {
    for (const vehiculo of this.vehiculos) {
      const sprite = this.vehicleSprites[vehiculo.sprite];

      if (sprite.complete && sprite.naturalWidth > 0) {
        this.ctx.save();
        this.ctx.translate(vehiculo.x + vehiculo.width / 2, vehiculo.y + vehiculo.height / 2);

        if (vehiculo.speed > 0) {
          this.ctx.scale(-1, 1);
        }

        this.ctx.drawImage(
          sprite,
          -vehiculo.width / 2,
          -vehiculo.height / 2,
          vehiculo.width,
          vehiculo.height,
        );
        this.ctx.restore();
        continue;
      }

      this.ctx.fillStyle = vehiculo.speed > 0 ? '#60a5fa' : '#f87171';
      this.ctx.fillRect(vehiculo.x, vehiculo.y, vehiculo.width, vehiculo.height);
    }
  }


  iniciarMovimientoVehiculos(): void {
    this.stopVehiculos();

    this.vehiculosInterval = setInterval(() => {
      if (!this.jugando()) {
        this.stopVehiculos();
        return;
      }

      this.moverVehiculos();
      this.dibujarFrog();
    }, 30);
  }

  moverVehiculos(): void {
    const canvasWidth = this.canvas.nativeElement.width;

    this.vehiculos = this.vehiculos.map((vehiculo) => {
      const siguienteX = vehiculo.x + vehiculo.speed;

      if (vehiculo.speed > 0 && siguienteX > canvasWidth) {
        return {
          ...vehiculo,
          x: -vehiculo.width,
        };
      }

      if (vehiculo.speed < 0 && siguienteX + vehiculo.width < 0) {
        return {
          ...vehiculo,
          x: canvasWidth,
        };
      }

      return {
        ...vehiculo,
        x: siguienteX,
      };
    });

    this.verificarColisionVehiculos();
  }

  stopVehiculos(): void {
    if (!this.vehiculosInterval) {
      return;
    }

    clearInterval(this.vehiculosInterval);
    this.vehiculosInterval = null;
  }

  
  @HostListener('window:keydown', ['$event'])
  mover(event: KeyboardEvent) {
    if (!this.jugando()) {
      return;
    }

    const isArrowKey = event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight';

    if (!isArrowKey) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const now = Date.now();
    if (event.repeat && now - this.lastMoveTime < this.repeatDelayMs) {
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
        this.frogY -= 20;
        this.direction = 'up';
        break;
      case 'ArrowDown':
        this.frogY += 20;
        this.direction = 'down';
        break;
      case 'ArrowLeft':
        this.frogX -= 20;
        this.direction = 'left';
        break;
      case 'ArrowRight':
        this.frogX += 20;
        this.direction = 'right';
        break;
      default:
        return;
    }

    this.lastMoveTime = now;

    this.frogX = Math.max(0, Math.min(this.frogX, this.canvas.nativeElement.width - this.frogSize));
    this.frogY = Math.max(0, Math.min(this.frogY, this.canvas.nativeElement.height - this.frogSize));

    this.recolectarCoins();

    this.verificarVictoria();
    this.verificarColisionVehiculos();

    this.isMoving = true;
    if (this.moveTimeout) {
      clearTimeout(this.moveTimeout);
    }
    this.moveTimeout = setTimeout(() => {
      this.isMoving = false;
      this.dibujarFrog();
    }, 140);

    this.dibujarFrog();
  }

  recolectarCoins(): void {
    const frogRight = this.frogX + this.frogSize;
    const frogBottom = this.frogY + this.frogSize;

    const coinsAntes = this.coins.length;
    this.coins = this.coins.filter((coin) => {
      const coinRight = coin.x + coin.size;
      const coinBottom = coin.y + coin.size;

      const hayColision =
        this.frogX < coinRight &&
        frogRight > coin.x &&
        this.frogY < coinBottom &&
        frogBottom > coin.y;

      return !hayColision;
    });

    const coinsRecolectadas = coinsAntes - this.coins.length;
    if (coinsRecolectadas > 0) {
      this.puntos.update((valor) => valor + coinsRecolectadas * 10);
      this.audio.playEfectoCoinFroggy();
    }
  }

  reiniciarPosicionRana(): void {
    this.frogX = this.initialFrogX;
    this.frogY = this.initialFrogY;
    this.direction = 'up';
    this.isMoving = false;
    this.lastMoveTime = 0;

    if (this.moveTimeout) {
      clearTimeout(this.moveTimeout);
      this.moveTimeout = null;
    }

    this.dibujarFrog();
  }
}

