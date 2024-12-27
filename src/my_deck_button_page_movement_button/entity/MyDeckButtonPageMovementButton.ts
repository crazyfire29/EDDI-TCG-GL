import * as THREE from 'three';
import {MyDeckButtonPageMovementButtonType} from "./MyDeckButtonPageMovementButtonType";
import {IdGenerator} from "../../common/id_generator/IdGenerator";
import {Vector2d} from "../../common/math/Vector2d";

export class MyDeckButtonPageMovementButton {
    id: number;
    mesh: THREE.Mesh;
    public position: Vector2d;
    public type: MyDeckButtonPageMovementButtonType;
    public width: number;
    public height: number;

    constructor(type: MyDeckButtonPageMovementButtonType, width: number, height: number, mesh: THREE.Mesh, position: Vector2d) {
        this.id = IdGenerator.generateId("MyDeckButtonPageMovementButton");
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
