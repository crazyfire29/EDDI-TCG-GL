import * as THREE from 'three';
import {MakeDeckScreenDoneButtonType} from "./MakeDeckScreenDoneButtonType";
import {IdGenerator} from "../../common/id_generator/IdGenerator";
import {Vector2d} from "../../common/math/Vector2d";

export class MakeDeckScreenDoneButton {
    id: number;
    mesh: THREE.Mesh;
    public position: Vector2d;
    public type: MakeDeckScreenDoneButtonType;
    public width: number;
    public height: number;

    constructor(type: MakeDeckScreenDoneButtonType, width: number, height: number, mesh: THREE.Mesh, position: Vector2d) {
        this.id = IdGenerator.generateId("MakeDeckScreenDoneButton");
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
