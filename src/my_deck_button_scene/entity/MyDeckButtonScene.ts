import * as THREE from 'three';
import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class MyDeckButtonScene {
    id: number;
    mesh: THREE.Mesh;

    constructor(mesh: THREE.Mesh) {
        this.id = IdGenerator.generateId("MyDeckButtonScene");
        this.mesh = mesh;
    }

    getMesh(): THREE.Mesh {
        return this.mesh;
    }
}