import {SelectedCardBlockEffectPosition} from "../entity/SelectedCardBlockEffectPosition";

export interface SelectedCardBlockEffectPositionRepository {
    findPositionById(positionId: number): SelectedCardBlockEffectPosition | undefined;
    findPositionByCardId(cardId: number): SelectedCardBlockEffectPosition | null;
    findAllPosition(): SelectedCardBlockEffectPosition[];
    deleteById(positionId: number): void;
    deleteAll(): void;
    count(): number;
}