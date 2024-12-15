import {BattleFieldHandRepository} from "./BattleFieldHandRepository";
import {BattleFieldHand} from "../entity/BattleFieldHand";

export class BattleFieldHandRepositoryImpl implements BattleFieldHandRepository {
    private static instance: BattleFieldHandRepositoryImpl;
    private cardMap: Map<number, BattleFieldHand> = new Map();

    private constructor() {}

    public static getInstance(): BattleFieldHandRepositoryImpl {
        if (!BattleFieldHandRepositoryImpl.instance) {
            BattleFieldHandRepositoryImpl.instance = new BattleFieldHandRepositoryImpl();
        }
        return BattleFieldHandRepositoryImpl.instance;
    }

    save(cardSceneId: number, positionId: number, attributeMarkIdList: number[]): BattleFieldHand {
        const existingCard = Array.from(this.cardMap.values()).find(card => card.cardSceneId === cardSceneId && card.positionId === positionId);
        if (existingCard) {
            existingCard.attributeMarkIdList = attributeMarkIdList;
            return existingCard;
        }

        const newCard = new BattleFieldHand(cardSceneId, positionId, attributeMarkIdList);
        this.cardMap.set(newCard.id, newCard);

        return newCard;
    }

    findById(id: number): BattleFieldHand | undefined {
        return this.cardMap.get(id);
    }

    findAll(): BattleFieldHand[] {
        return Array.from(this.cardMap.values());
    }

    deleteById(id: number): boolean {
        return this.cardMap.delete(id);
    }

    deleteAll(): void {
        this.cardMap.clear();
    }
}
