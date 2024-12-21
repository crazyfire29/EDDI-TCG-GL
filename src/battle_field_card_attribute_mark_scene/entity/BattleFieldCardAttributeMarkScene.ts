import * as THREE from 'three';
import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class BattleFieldCardAttributeMarkScene {
    id: number;
    mesh: THREE.Mesh;
    renderingOrder: number;

    constructor(mesh: THREE.Mesh, renderingOrder: number = 0) {
        this.id = IdGenerator.generateId();
        this.mesh = mesh;
        this.renderingOrder = renderingOrder;
    }
}