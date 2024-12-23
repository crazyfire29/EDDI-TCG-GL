import * as THREE from 'three';
import {MyDeckCardPageMovementButtonType} from "./MyDeckCardPageMovementButtonType";
import {IdGenerator} from "../../common/id_generator/IdGenerator";
import {Vector2d} from "../../common/math/Vector2d";

export class MyDeckCardPageMovementButton {
    id: number;
    mesh: THREE.Mesh;
    public position: Vector2d;
    public type: MyDeckCardPageMovementButtonType;
    public width: number;
    public height: number;

    constructor(type: MyDeckCardPageMovementButtonType, width: number, height: number, mesh: THREE.Mesh, position: Vector2d) {
        this.id = IdGenerator.generateId();
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
