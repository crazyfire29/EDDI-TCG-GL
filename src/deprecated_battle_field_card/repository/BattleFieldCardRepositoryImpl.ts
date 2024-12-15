import {BattleFieldCard} from "../entity/BattleFieldCard";
import {CardStatus} from "../entity/CardStatus";
import {BattleFieldCardRepository} from "./BattleFieldCardRepository";

export class BattleFieldCardRepositoryImpl implements BattleFieldCardRepository {
    private static instance: BattleFieldCardRepositoryImpl;
    private cardMap: Map<number, BattleFieldCard> = new Map();

    private constructor() {}

    public static getInstance(): BattleFieldCardRepositoryImpl {
        if (!BattleFieldCardRepositoryImpl.instance) {
            BattleFieldCardRepositoryImpl.instance = new BattleFieldCardRepositoryImpl();
        }
        return BattleFieldCardRepositoryImpl.instance;
    }

    save(cardSceneId: number, positionId: number, attributeMarkIdList: number[], status: CardStatus = CardStatus.HAND): BattleFieldCard {
        const existingCard = Array.from(this.cardMap.values()).find(card => card.cardSceneId === cardSceneId && card.positionId === positionId);

        if (existingCard) {
            existingCard.status = status;

            return existingCard;
        }

        const newCard = new BattleFieldCard(cardSceneId, positionId, attributeMarkIdList, status);
        this.cardMap.set(newCard.id, newCard);

        return newCard;
    }

    findById(id: number): BattleFieldCard | undefined {
        return this.cardMap.get(id);
    }

    findAll(): BattleFieldCard[] {
        return Array.from(this.cardMap.values());
    }

    deleteById(id: number): boolean {
        return this.cardMap.delete(id);
    }

    deleteAll(): void {
        this.cardMap.clear();
    }
}
