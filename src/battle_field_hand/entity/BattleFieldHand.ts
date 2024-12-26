import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class BattleFieldHand {
    id: number;
    cardSceneId: number;
    positionId: number;
    attributeMarkIdList: number[];

    constructor(cardSceneId: number, positionId: number, attributeMarkIdList: number[]) {
        this.id = IdGenerator.generateId();
        this.cardSceneId = cardSceneId;
        this.positionId = positionId;
        this.attributeMarkIdList = attributeMarkIdList;
    }

    getId(): number {
        return this.id;
    }
}
