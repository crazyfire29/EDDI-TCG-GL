import * as THREE from 'three';
import {CardPageMovementButton} from "../entity/CardPageMovementButton";
import {CardPageMovementButtonType} from "../entity/CardPageMovementButtonType";
import {Vector2d} from "../../common/math/Vector2d";

export interface CardPageMovementButtonRepository {
    createCardPageMovementButton(type: CardPageMovementButtonType, position: Vector2d): Promise<CardPageMovementButton>;
    findById(id: number): CardPageMovementButton | null;
    findAll(): CardPageMovementButton[];
    deleteById(id: number): void;
    deleteAll(): void;
    findAllButtonIds(): number[];
    hideButton(buttonId: number): void;
    showButton(buttonId: number): void;
}