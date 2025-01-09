import {MyDeckCardPosition} from "../entity/MyDeckCardPosition";

export interface MyDeckCardPositionRepository {
    save(cardId: number, position: MyDeckCardPosition): void;
    findById(positionId: number): MyDeckCardPosition | undefined;
    findAll(): MyDeckCardPosition[];
    deleteById(positionId: number): boolean;
    deleteAll(): void;
    count(): number;
}