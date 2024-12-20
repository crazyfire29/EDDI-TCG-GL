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
            width: 40 / window.innerWidth,
            height: 40 / window.innerHeight,
            position: new THREE.Vector2(475 / window.innerWidth, -360 / window.innerHeight)
        },
        {
            id: 2,
            width: 40 / window.innerWidth,
            height: 40 / window.innerHeight,
            position: new THREE.Vector2(665 / window.innerWidth, -360 / window.innerHeight)
        },
    ];
}
