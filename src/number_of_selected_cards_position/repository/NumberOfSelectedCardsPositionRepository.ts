import {NumberOfSelectedCardsPosition} from "../entity/NumberOfSelectedCardsPosition";

export interface NumberOfSelectedCardsPositionRepository {
    findById(positionId: number): NumberOfSelectedCardsPosition | undefined;
    findAll(): NumberOfSelectedCardsPosition[];
    deleteById(positionId: number): void;
    deleteAll(): void;
    count(): number;
}