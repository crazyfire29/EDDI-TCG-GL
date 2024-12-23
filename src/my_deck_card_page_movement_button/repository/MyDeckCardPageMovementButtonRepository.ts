import * as THREE from 'three';
import {MyDeckCardPageMovementButton} from "../entity/MyDeckCardPageMovementButton";
import {MyDeckCardPageMovementButtonType} from "../entity/MyDeckCardPageMovementButtonType";
import {Vector2d} from "../../common/math/Vector2d";

export interface MyDeckCardPageMovementButtonRepository {
    createMyDeckCardPageMovementButton(type: MyDeckCardPageMovementButtonType, position: Vector2d): Promise<MyDeckCardPageMovementButton>;
    getAllMyDeckCardPageMovementButtons(): Map<number, MyDeckCardPageMovementButton>;
    findById(id: number): MyDeckCardPageMovementButton | null;
    findAll(): MyDeckCardPageMovementButton[];
    deleteById(id: number): void;
    deleteAll(): void;
}