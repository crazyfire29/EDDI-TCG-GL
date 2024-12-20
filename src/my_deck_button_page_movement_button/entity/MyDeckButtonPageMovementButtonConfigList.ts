import * as THREE from 'three';

export interface ButtonConfig {
    id: number;
    position: THREE.Vector2;
    width: number;
    height: number;
}

export class MyDeckButtonPageMovementButtonConfigList {
    public buttonConfigs: ButtonConfig[] = [
        {
            id: 1,
            width: 45 / 1920,
            height: 44 / 1080,
            position: new THREE.Vector2(528 / 1920, -435 / 1080)
        },
        {
            id: 2,
            width: 45 / 1920,
            height: 44 / 1080,
            position: new THREE.Vector2(740 / 1920, -435 / 1080)
        },
    ];
}
