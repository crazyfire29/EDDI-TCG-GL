import * as THREE from 'three';
import {MyDeckButtonType} from "./MyDeckButtonType";
import {Vector2d} from "../../common/math/Vector2d";

export class MyDeckButton {
    mesh: THREE.Mesh;
    private position: Vector2d;
    private type: MyDeckButtonType;
    private width: number;
    private height: number;

    constructor(type: MyDeckButtonType, width: number, height: number, mesh: THREE.Mesh, position: Vector2d) {
        this.type = type;
        this.width = width;
        this.height = height;
        this.mesh = mesh;
        this.position = position;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

}
