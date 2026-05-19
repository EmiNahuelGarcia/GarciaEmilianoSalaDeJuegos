export type JuegoId = 'ahorcado' | 'mayorMenor' | 'juego-3' | 'juego-4';
export type JuegoActivoId = 'ahorcado' | 'mayorMenor';

export interface IJuegoRanking {
    id: JuegoId;
    label: string;
    displayName: string;
    enabled: boolean;
}
