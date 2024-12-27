import * as THREE from 'three';
import {MyDeckButtonType} from "./MyDeckButtonType";
import {Vector2d} from "../../common/math/Vector2d";
import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class MyDeckButton {
    id: number;
    mesh: THREE.Mesh;
    private position: Vector2d;
    private width: number;
    private height: number;

    constructor(width: number, height: number, mesh: THREE.Mesh, position: Vector2d) {
        this.id = IdGenerator.generateId("MyDeckButtonScene");
//         console.log(`[DEBUG] MyDeckButtonScene constructor called with id: ${this.id}`);
        this.width = width;
        this.height = height;
        this.mesh = mesh;
        this.position = position;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

}
