import * as THREE from 'three';
import {IdGenerator} from "../../common/id_generator/IdGenerator";


export class WindowScene {
    id: number;
    name: string;
    scene: THREE.Scene;

    constructor(name: string) {
        this.id = IdGenerator.generateId("WindowScene");
        this.name = name;
        this.scene = new THREE.Scene();
    }

    getScene(): THREE.Scene {
        return this.scene
    }

    getId(): number {
        return this.id
    }

    addObject(object: THREE.Object3D): void {
        this.scene.add(object);
    }

    removeObject(object: THREE.Object3D): void {
        this.scene.remove(object);
    }
}