import {BattleFieldHand} from "../entity/BattleFieldHand";

export interface BattleFieldHandRepository {
    save(cardSceneId: number, positionId: number, attributeMarkIdList: number[]): BattleFieldHand;
    findById(id: number): BattleFieldHand | undefined;
    findAll(): BattleFieldHand[];
    deleteById(id: number): boolean;
    deleteAll(): void;
    findByCardSceneId(cardSceneId: number): BattleFieldHand | null
    findAttributeMarkIdListByCardSceneId(cardSceneId: number): number[] | null
    findPositionIdByCardSceneId(cardSceneId: number): number | null
}