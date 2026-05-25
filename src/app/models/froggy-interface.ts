export type VehicleSpriteName = 'coche-1' | 'coche-2' | 'coche-3';

export interface IVehicle {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    sprite: VehicleSpriteName;
}

export interface ICoin {
    x: number;
    y: number;
    size: number;
}