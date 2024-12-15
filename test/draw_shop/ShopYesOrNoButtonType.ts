import * as THREE from 'three';

export enum ShopYesOrNoButtonType {
    YES = "yes",
    NO = "no"
}

export interface ShopYesOrNoButtonConfig {
    id: number;
    type: ShopYesOrNoButtonType;
    imagePath: string;
    position: THREE.Vector2;
}