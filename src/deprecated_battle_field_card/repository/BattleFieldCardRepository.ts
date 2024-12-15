import { BattleFieldCard } from "../entity/BattleFieldCard";
import { CardStatus } from "../entity/CardStatus";

export interface BattleFieldCardRepository {
    save(cardSceneId: number, positionId: number, attributeMarkIdList: number[], status: CardStatus): BattleFieldCard;
    findById(id: number): BattleFieldCard | undefined;
    findAll(): BattleFieldCard[];
    deleteById(id: number): boolean;
    deleteAll(): void;
}