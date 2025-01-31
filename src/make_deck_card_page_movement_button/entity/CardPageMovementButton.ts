import * as THREE from 'three';
import {CardPageMovementButtonType} from "./CardPageMovementButtonType";
import {IdGenerator} from "../../common/id_generator/IdGenerator";
import {Vector2d} from "../../common/math/Vector2d";

export class CardPageMovementButton {
    id: number;
    mesh: THREE.Mesh;
    public position: Vector2d;
    public type: CardPageMovementButtonType;
    public width: number;
    public height: number;

    constructor(type: CardPageMovementButtonType, width: number, height: number, mesh: THREE.Mesh, position: Vector2d) {
        this.id = IdGenerator.generateId("CardPageMovementButton");
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
