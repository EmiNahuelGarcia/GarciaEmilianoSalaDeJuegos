export interface IMayorMenorCard {
    id: string;
    nivel: number;
    nombre: string;
    imagen: string;
}

export const CARTAS_MAYOR_MENOR: IMayorMenorCard[] = [];

for (let nivel = 1; nivel <= 12; nivel++) {
    for (let i = 1; i <= 3; i++) {
        CARTAS_MAYOR_MENOR.push({
            id: `nivel${nivel}-${i}`,
            nivel,
            nombre: `Nivel ${nivel} - Carta ${i}`,
            imagen: `assets/mayor-menor-assets/cards/nivel${nivel}-${i}.png`
        });
    }
}
