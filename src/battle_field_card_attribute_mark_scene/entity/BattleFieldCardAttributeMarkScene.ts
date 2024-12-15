import * as THREE from 'three';
import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class BattleFieldCardAttributeMarkScene {
    id: number;
    mesh: THREE.Mesh;

    constructor(mesh: THREE.Mesh) {
        this.id = IdGenerator.generateId();
        this.mesh = mesh;
    }
}