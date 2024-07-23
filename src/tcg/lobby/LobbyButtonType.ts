import * as THREE from 'three';

export enum LobbyButtonType {
    OneVsOne = "1v1",
    MyCards = "my_cards",
    Shop = "shop",
    Test = "test"
}

export interface LobbyButtonConfig {
    type: LobbyButtonType;
    imagePath: string;
    position: THREE.Vector2;
}