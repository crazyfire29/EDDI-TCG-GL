import * as THREE from 'three';

export interface ButtonConfig {
    id: number;
    position: THREE.Vector2;
    width: number;
    height: number;
}

export class MyDeckCardPageMovementButtonConfigList {
    public buttonConfigs: ButtonConfig[] = [
        {
            id: 1,
            width: 73 / 1920,
            height: 46 / 1080,
            position: new THREE.Vector2(-395 / 1920, -487 / 1080)
        },
        {
            id: 2,
            width: 73 / 1920,
            height: 46 / 1080,
            position: new THREE.Vector2(-169 / 1920, -487 / 1080)
        },
    ];
}
