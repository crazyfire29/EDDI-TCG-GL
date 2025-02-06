import * as THREE from 'three';
import {SelectedCardBlock} from "../entity/SelectedCardBlock";
import {Vector2d} from "../../common/math/Vector2d";

export interface SelectedCardBlockRepository {
    createSelectedCardBlock(cardId: number, position: Vector2d): Promise<SelectedCardBlock>;
    findBlockByBlockId(blockId: number): SelectedCardBlock | null;
    findBlockByCardId(cardId: number): SelectedCardBlock | null;
    findAllBlocks(): SelectedCardBlock[];
    findBlockIdList(): number[];
    deleteAllBlock(): void;
    deleteBlockByBlockId(blockId: number): void;
}