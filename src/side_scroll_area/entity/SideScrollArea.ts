import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";
import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class SideScrollArea {
    id: number;
    mesh: THREE.Mesh;
    position: THREE.Vector2;

    constructor(mesh: THREE.Mesh, position: THREE.Vector2) {
        this.id = IdGenerator.generateId("SideScrollArea");
        this.mesh = mesh;
        this.position = position;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

}
