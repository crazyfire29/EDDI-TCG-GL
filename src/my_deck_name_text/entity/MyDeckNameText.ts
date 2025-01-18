import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";
import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class MyDeckNameText {
    id: number;
    mesh: THREE.Mesh;
    private position: Vector2d;
    width: number;
    height: number;

    constructor(mesh: THREE.Mesh, position: Vector2d, width: number, height: number) {
        this.id = IdGenerator.generateId("MyDeckNameText");
        this.mesh = mesh;
        this.position = position;
        this.width = width;
        this.height = height;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

}
