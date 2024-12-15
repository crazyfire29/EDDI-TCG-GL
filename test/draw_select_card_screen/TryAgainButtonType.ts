import * as THREE from 'three';

export enum TryAgainButtonType {
    ACCEPT = "accept",
    CANCEL = "cancel"
}

export interface TryAgainButtonConfig {
    id: number;
    type: TryAgainButtonType;
    imagePath: string;
    position: THREE.Vector2;
}