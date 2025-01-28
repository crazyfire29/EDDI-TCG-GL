import {YourField} from "../entity/YourField";
import {OpponentField} from "../entity/OpponentField";

export interface OpponentFieldRepository {
    count(): number
    save(cardSceneId: number, positionId: number, attributeMarkIdList: number[], cardId: number): YourField;
    findById(id: number): YourField | undefined;
    findAll(): YourField[];
    deleteById(id: number): boolean;
    deleteAll(): void;
    findByCardSceneId(cardSceneId: number): YourField | null
    findAttributeMarkIdListByCardSceneId(cardSceneId: number): number[] | null
    findPositionIdByCardSceneId(cardSceneId: number): number | null
}