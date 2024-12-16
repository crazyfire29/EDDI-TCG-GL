import * as THREE from 'three';

export enum DeckCardPageMovementButtonType {
    PREV = "prev_button",
    NEXT = "next_button"
}

export interface DeckCardPageMovementButtonConfig {
    id: number;
    type: DeckCardPageMovementButtonType;
    imagePath: string;
    position: THREE.Vector2;
}