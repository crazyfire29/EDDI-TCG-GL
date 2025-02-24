import {BlockDeleteButtonPosition} from "../entity/BlockDeleteButtonPosition";

export interface BlockDeleteButtonPositionRepository {
    findPositionByPositionId(positionId: number): BlockDeleteButtonPosition | null;
    findAll(): BlockDeleteButtonPosition[];
    deleteByPositionId(positionId: number): void;
    deleteAll(): void;
    count(): number;
}