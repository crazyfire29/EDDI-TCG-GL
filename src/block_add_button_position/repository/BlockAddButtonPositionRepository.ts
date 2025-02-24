import {BlockAddButtonPosition} from "../entity/BlockAddButtonPosition";

export interface BlockAddButtonPositionRepository {
    findPositionByPositionId(positionId: number): BlockAddButtonPosition | null;
    findAll(): BlockAddButtonPosition[];
    deleteByPositionId(positionId: number): void;
    deleteAll(): void;
    count(): number;
}