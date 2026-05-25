export type JuegoId = 'ahorcado' | 'mayorMenor' | 'preguntados' | 'froggy';
export type JuegoActivoId = 'ahorcado' | 'mayorMenor' | 'preguntados' | 'froggy';

export interface IJuegoRanking {
    id: JuegoId;
    label: string;
    displayName: string;
    enabled: boolean;
}
