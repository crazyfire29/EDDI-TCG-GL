import * as THREE from 'three';
import {MyDeckButtonPageMovementButtonType} from "./MyDeckButtonPageMovementButtonType";
import {IdGenerator} from "../../common/id_generator/IdGenerator";
import {Vector2d} from "../../common/math/Vector2d";

export class MyDeckButtonPageMovementButton {
    id: number;
    mesh: THREE.Mesh;
    public position: Vector2d;
    public type: MyDeckButtonPageMovementButtonType;

    constructor(type: MyDeckButtonPageMovementButtonType, mesh: THREE.Mesh, position: Vector2d) {
        this.id = IdGenerator.generateId();
        this.type = type;
        this.mesh = mesh;
        this.position = position;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
        }

//     public setPosition(x: number, y: number): void {
//         this.position.set(x, y);
//     }

}
