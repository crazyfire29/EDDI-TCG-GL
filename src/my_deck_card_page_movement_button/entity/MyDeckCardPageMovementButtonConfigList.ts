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
            width: 63 / window.innerWidth,
            height: 42 / window.innerHeight,
            position: new THREE.Vector2(-358 / window.innerWidth, -400 / window.innerHeight)
        },
        {
            id: 2,
            width: 63 / window.innerWidth,
            height: 42 / window.innerHeight,
            position: new THREE.Vector2(-152 / window.innerWidth, -400 / window.innerHeight)
        },
    ];
}
