import * as THREE from 'three';
import {BlockAddButton} from "../entity/BlockAddButton";
import {Vector2d} from "../../common/math/Vector2d";

export interface BlockAddButtonRepository {
    createBlockAddButton(clickedCardId: number, position: Vector2d): Promise<BlockAddButton>;
    findButtonByCardId(clickedCardId: number): BlockAddButton | null;
    findAllButtons(): BlockAddButton[];
    deleteAllButton(): void;
}