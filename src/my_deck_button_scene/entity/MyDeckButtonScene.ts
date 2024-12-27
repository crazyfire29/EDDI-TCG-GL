import * as THREE from 'three';
import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class MyDeckButtonScene {
    id: number;
    mesh: THREE.Mesh;

    constructor(mesh: THREE.Mesh) {
        this.id = IdGenerator.generateId("MyDeckButtonScene");
        console.log(`[DEBUG] MyDeckButtonScene constructor called with id: ${this.id}`);
        this.mesh = mesh;
    }

    getMesh(): THREE.Mesh {
        return this.mesh;
    }
}