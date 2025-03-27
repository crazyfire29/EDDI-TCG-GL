import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";
import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class GlobalNavigationBarEffect {
    id: number;
    mesh: THREE.Mesh;
    position: Vector2d;
    widthPercent: number;
    heightPercent: number;

    constructor(mesh: THREE.Mesh, widthPercent: number, heightPercent: number, position: Vector2d) {
        this.id = IdGenerator.generateId("GlobalNavigationBarEffect");
        this.mesh = mesh;
        this.widthPercent = widthPercent;
        this.heightPercent = heightPercent;
        this.position = position;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public getWidthPercent(): number {
        return this.widthPercent;
    }

    public getHeightPercent(): number {
        return this.heightPercent;
    }

}
