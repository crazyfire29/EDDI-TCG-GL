import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";
import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class DeckMakePopupBackground {
    id: number;
    mesh: THREE.Mesh;
    width: number;
    height: number;
    position: Vector2d;

    constructor(mesh: THREE.Mesh, width: number, height: number, position: Vector2d) {
        this.id = IdGenerator.generateId("DeckMakePopupBackground");
        this.mesh = mesh;
        this.width = width;
        this.height = height;
        this.position = position;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

}
