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

    save(cardSceneId: number, positionId: number, attributeMarkIdList: number[], cardId: number): BattleFieldHand {
        const existingCard = Array.from(this.cardMap.values()).find(card => card.cardSceneId === cardSceneId && card.positionId === positionId);
        if (existingCard) {
            existingCard.attributeMarkIdList = attributeMarkIdList;
            return existingCard;
        }

        const newCard = new BattleFieldHand(cardSceneId, positionId, attributeMarkIdList, cardId);
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

    findByCardSceneId(cardSceneId: number): BattleFieldHand | null {
        const hand = Array.from(this.cardMap.values()).find(hand => hand.cardSceneId === cardSceneId);
        return hand || null;
    }

    findAttributeMarkIdListByCardSceneId(cardSceneId: number): number[] | null {
        const hand = this.findByCardSceneId(cardSceneId);
        if (hand instanceof BattleFieldHand) {
            console.log(`BattleFieldHandRepositoryImpl findAttributeMarkIdListByCardSceneId() -> hand.attributeMarkIdList: ${hand.attributeMarkIdList}`)
        }

        return hand ? hand.attributeMarkIdList : null;
    }

    findPositionIdByCardSceneId(cardSceneId: number): number | null {
        const hand = this.findByCardSceneId(cardSceneId);
        if (hand) {
            console.log(`BattleFieldHandRepositoryImpl findPositionIdByCardSceneId() -> hand.positionId: ${hand.positionId}`);
            return hand.positionId;
        }
        return null;
    }

    findCardIndexByCardSceneId(cardSceneId: number): number | null {
        const cardArray = Array.from(this.cardMap.values());
        const index = cardArray.findIndex(card => card.cardSceneId === cardSceneId);
        return index !== -1 ? index : null; // 인덱스를 찾으면 반환, 없으면 null 반환
    }
}
