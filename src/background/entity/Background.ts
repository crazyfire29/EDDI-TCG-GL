import * as THREE from 'three';
import {BackgroundType} from "./BackgroundType";
import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class Background {
    id: number;
    public texture: THREE.Texture | null = null;
    public width: number = 0;
    public height: number = 0;
    public position: THREE.Vector2 = new THREE.Vector2(0, 0);
    public type: BackgroundType;

    constructor(type: BackgroundType, width: number, height: number, position: THREE.Vector2) {
        this.id = IdGenerator.generateId("Background");
        this.type = type;
        this.width = width;
        this.height = height;
        this.position = position;
    }

    public setPosition(x: number, y: number): void {
        this.position.set(x, y);
    }

    public setSize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }
}
