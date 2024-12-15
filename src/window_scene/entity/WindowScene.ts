import * as THREE from 'three';

export class WindowScene {
    id: string;
    name: string;
    scene: THREE.Scene;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.scene = new THREE.Scene();
    }

    addObject(object: THREE.Object3D): void {
        this.scene.add(object);
    }

    removeObject(object: THREE.Object3D): void {
        this.scene.remove(object);
    }
}