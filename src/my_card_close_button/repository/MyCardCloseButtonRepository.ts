import * as THREE from 'three';
import {MyCardCloseButton} from "../entity/MyCardCloseButton";
import {Vector2d} from "../../common/math/Vector2d";

export interface MyCardCloseButtonRepository {
    createCloseButton(type: number, position: Vector2d): Promise<MyCardCloseButton>;
    findButtonById(id: number): MyCardCloseButton | null;
    findAllButton(): MyCardCloseButton[];
    deleteById(id: number): void;
    deleteAll(): void;
    findAllButtonIds(): number[];
    hideButton(buttonId: number): void;
    showButton(buttonId: number): void;
}