import {MyCardScreenCardEffectPosition} from "../entity/MyCardScreenCardEffectPosition";

export interface MyCardScreenCardEffectPositionRepository {
    findPositionByPositionId(positionId: number): MyCardScreenCardEffectPosition | null;
    findAll(): MyCardScreenCardEffectPosition[];
    deleteByPositionId(positionId: number): void;
    deleteAll(): void;
    count(): number;
}