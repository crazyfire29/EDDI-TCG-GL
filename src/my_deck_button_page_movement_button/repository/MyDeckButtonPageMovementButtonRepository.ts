import * as THREE from 'three';
import {MyDeckButtonPageMovementButton} from "../entity/MyDeckButtonPageMovementButton";
import {MyDeckButtonPageMovementButtonType} from "../entity/MyDeckButtonPageMovementButtonType";
import {NonBackgroundImage} from "../../shape/image/NonBackgroundImage";

export interface MyDeckButtonPageMovementButtonRepository {
    createMyDeckButtonPageMovementButton(
        textureName: string,
        type: MyDeckButtonPageMovementButtonType,
        widthPercent: number,
        heightPercent: number,
        positionPercent: THREE.Vector2
    ): Promise<NonBackgroundImage>;
    save(myDeckButtonPageMovementButton: MyDeckButtonPageMovementButton): void;
    findById(id: number): MyDeckButtonPageMovementButton | null;
    findAll(): MyDeckButtonPageMovementButton[];
    deleteById(id: number): void;
    deleteAll(): void;
}