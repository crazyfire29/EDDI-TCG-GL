import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";
import {IdGenerator} from "../../common/id_generator/IdGenerator";
import {SideScrollAreaType} from "./SideScrollAreaType";

export class SideScrollArea {
    id: number;
    type: SideScrollAreaType;
    mesh: THREE.Mesh;
    position: THREE.Vector2;
    width: number;
    height: number;

    constructor(type: SideScrollAreaType, mesh: THREE.Mesh, position: THREE.Vector2, width: number, height: number) {
        this.id = IdGenerator.generateId("SideScrollArea");
        this.type = type;
        this.mesh = mesh;
        this.position = position;
        this.width = width;
        this.height = height;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

}
