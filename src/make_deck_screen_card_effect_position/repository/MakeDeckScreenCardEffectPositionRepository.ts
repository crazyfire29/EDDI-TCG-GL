import {MakeDeckScreenCardEffectPosition} from "../entity/MakeDeckScreenCardEffectPosition";

export interface MakeDeckScreenCardEffectPositionRepository {
    save(cardId: number, position: MakeDeckScreenCardEffectPosition): void;
    findById(positionId: number): MakeDeckScreenCardEffectPosition | undefined;
    findAll(): MakeDeckScreenCardEffectPosition[];
    deleteById(positionId: number): void;
    deleteAll(): void;
    count(): number;
}