import * as THREE from 'three';
import {MakeDeckScreenDoneButton} from "../entity/MakeDeckScreenDoneButton";
import {MakeDeckScreenDoneButtonType} from "../entity/MakeDeckScreenDoneButtonType";
import {Vector2d} from "../../common/math/Vector2d";

export interface MakeDeckScreenDoneButtonRepository {
    createDoneButton(type: MakeDeckScreenDoneButtonType, position: Vector2d): Promise<MakeDeckScreenDoneButton>;
    findById(id: number): MakeDeckScreenDoneButton | null;
    findAll(): MakeDeckScreenDoneButton[];
    deleteById(id: number): void;
    deleteAll(): void;
    findAllButtonIds(): number[];
    hideButton(buttonId: number): void;
    showButton(buttonId: number): void;
}