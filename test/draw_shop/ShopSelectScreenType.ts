import * as THREE from 'three';

export enum ShopSelectScreenType {
    ALL = "all",
    UNDEAD = "undead",
    TRENT = "trent",
    HUMAN = "human"
}

export interface ShopSelectScreenConfig {
    id: number;
    type: ShopSelectScreenType;
    imagePath: string;
    position: THREE.Vector2;
}