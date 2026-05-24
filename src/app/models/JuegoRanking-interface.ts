export type JuegoId = 'ahorcado' | 'mayorMenor' | 'preguntados' | 'juego-4';
export type JuegoActivoId = 'ahorcado' | 'mayorMenor' | 'preguntados';

export interface IJuegoRanking {
    id: JuegoId;
    label: string;
    displayName: string;
    enabled: boolean;
}
