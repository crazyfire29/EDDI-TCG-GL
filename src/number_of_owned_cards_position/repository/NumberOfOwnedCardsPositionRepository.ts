import {NumberOfOwnedCardsPosition} from "../entity/NumberOfOwnedCardsPosition";

export interface NumberOfOwnedCardsPositionRepository {
    save(cardId: number, position: NumberOfOwnedCardsPosition): void;
    findById(positionId: number): NumberOfOwnedCardsPosition | undefined;
    findAll(): NumberOfOwnedCardsPosition[];
    deleteById(positionId: number): void;
    deleteAll(): void;
    count(): number;
}