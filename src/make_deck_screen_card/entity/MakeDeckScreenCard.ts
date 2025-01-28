import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";
import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class MakeDeckScreenCard {
    id: number;
    mesh: THREE.Mesh;
    position: Vector2d;

    constructor(mesh: THREE.Mesh, position: Vector2d) {
        this.id = IdGenerator.generateId("MakeDeckScreenCard");
        this.mesh = mesh;
        this.position = position;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

}
