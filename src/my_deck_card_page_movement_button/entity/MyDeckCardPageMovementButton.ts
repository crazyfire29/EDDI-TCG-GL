import * as THREE from 'three';
import {MyDeckCardPageMovementButtonType} from "./MyDeckCardPageMovementButtonType";
import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class MyDeckCardPageMovementButton {
    id: number;
    public texture: THREE.Texture | null = null;
    public widthPercent: number = 0;
    public heightPercent: number = 0;
    public positionPercent: THREE.Vector2 = new THREE.Vector2(0, 0);
    public type: MyDeckCardPageMovementButtonType;

    constructor(type: MyDeckCardPageMovementButtonType, widthPercent: number, heightPercent: number, positionPercent: THREE.Vector2) {
        this.id = IdGenerator.generateId();
        this.type = type;
        this.widthPercent = widthPercent;
        this.heightPercent = heightPercent;
        this.positionPercent = positionPercent;
    }

    public setPosition(x: number, y: number): void {
        this.positionPercent.set(x, y);
    }

    public setSize(width: number, height: number): void {
        this.widthPercent = width;
        this.heightPercent = height;
    }
}
