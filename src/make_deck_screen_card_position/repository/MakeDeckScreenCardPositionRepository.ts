import {MakeDeckScreenCardPosition} from "../entity/MakeDeckScreenCardPosition";

export interface MakeDeckScreenCardPositionRepository {
    save(cardId: number, position: MakeDeckScreenCardPosition): void;
    findById(positionId: number): MakeDeckScreenCardPosition | undefined;
    findAll(): MakeDeckScreenCardPosition[];
    deleteById(positionId: number): void;
    deleteAll(): void;
    count(): number;
}