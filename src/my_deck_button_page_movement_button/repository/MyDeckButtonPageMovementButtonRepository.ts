import * as THREE from 'three';
import {MyDeckButtonPageMovementButton} from "../entity/MyDeckButtonPageMovementButton";
import {MyDeckButtonPageMovementButtonType} from "../entity/MyDeckButtonPageMovementButtonType";
import {Vector2d} from "../../common/math/Vector2d";

export interface MyDeckButtonPageMovementButtonRepository {
    createMyDeckButtonPageMovementButton(type: MyDeckButtonPageMovementButtonType, position: Vector2d): Promise<MyDeckButtonPageMovementButton>;
    getAllMyDeckPageMovementButtons(): Map<number, MyDeckButtonPageMovementButton>;
    findById(id: number): MyDeckButtonPageMovementButton | null;
    findAll(): MyDeckButtonPageMovementButton[];
    deleteById(id: number): void;
    deleteAll(): void;
}