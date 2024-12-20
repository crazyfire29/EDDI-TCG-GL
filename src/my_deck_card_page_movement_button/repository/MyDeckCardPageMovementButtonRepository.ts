import * as THREE from 'three';
import {MyDeckCardPageMovementButton} from "../entity/MyDeckCardPageMovementButton";
import {MyDeckCardPageMovementButtonType} from "../entity/MyDeckCardPageMovementButtonType";
import {NonBackgroundImage} from "../../shape/image/NonBackgroundImage";

export interface MyDeckCardPageMovementButtonRepository {
    createMyDeckCardPageMovementButton(
        textureName: string,
        type: MyDeckCardPageMovementButtonType,
        widthPercent: number,
        heightPercent: number,
        positionPercent: THREE.Vector2
    ): Promise<NonBackgroundImage>;
    save(myDeckCardPageMovementButton: MyDeckCardPageMovementButton): void;
    findById(id: number): MyDeckCardPageMovementButton | null;
    findAll(): MyDeckCardPageMovementButton[];
    deleteById(id: number): void;
    deleteAll(): void;
}