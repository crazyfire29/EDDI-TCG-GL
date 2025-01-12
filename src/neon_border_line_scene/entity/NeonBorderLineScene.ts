import * as THREE from 'three';
import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class NeonBorderLineScene {
    id: number;
    line: THREE.Mesh | null = null;
    material: THREE.ShaderMaterial | null = null;

    constructor(line: THREE.Mesh, material: THREE.ShaderMaterial) {
        this.id = IdGenerator.generateId("NeonBorderLineScene");
        this.line = line;
        this.material = material;
    }

    getId(): number {
        return this.id;
    }

    getLine(): THREE.Mesh | null {
        return this.line;
    }

    getMaterial(): THREE.ShaderMaterial | null {
        return this.material;
    }
}
