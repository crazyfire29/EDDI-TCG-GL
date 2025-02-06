import {SelectedCardBlockPosition} from "../entity/SelectedCardBlockPosition";

export interface SelectedCardBlockPositionRepository {
    findPositionById(positionId: number): SelectedCardBlockPosition | undefined;
    findPositionByCardId(cardId: number): SelectedCardBlockPosition | null;
    findAllPosition(): SelectedCardBlockPosition[];
    deleteById(positionId: number): void;
    deleteAll(): void;
    count(): number;
}