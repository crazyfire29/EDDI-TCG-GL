import * as THREE from 'three';
import {BlockDeleteButton} from "../entity/BlockDeleteButton";
import {Vector2d} from "../../common/math/Vector2d";

export interface BlockDeleteButtonRepository {
    createBlockDeleteButton(clickedCardId: number, position: Vector2d): Promise<BlockDeleteButton>;
    findButtonByCardId(clickedCardId: number): BlockDeleteButton | null;
    findAllButtons(): BlockDeleteButton[];
    deleteAllButton(): void;
}