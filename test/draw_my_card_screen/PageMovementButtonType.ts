import * as THREE from 'three';

export enum PageMovementButtonType {
    PREV = "prev",
    NEXT = "next"
}

export interface PageMovementButtonConfig {
    id: number;
    type: PageMovementButtonType;
    imagePath: string;
    position: THREE.Vector2;
}