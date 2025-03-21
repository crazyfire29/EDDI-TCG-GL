import {MyCardScreenCardPosition} from "../entity/MyCardScreenCardPosition";

export interface MyCardScreenCardPositionRepository {
    findPositionByPositionId(positionId: number): MyCardScreenCardPosition | null;
    findAll(): MyCardScreenCardPosition[];
    deleteByPositionId(positionId: number): void;
    deleteAll(): void;
    count(): number;
}