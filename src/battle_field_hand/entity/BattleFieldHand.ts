import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class BattleFieldHand {
    id: number;
    cardSceneId: number;
    positionId: number;
    attributeMarkIdList: number[];

    constructor(cardSceneId: number, positionId: number, attributeMarkIdList: number[]) {
        this.id = IdGenerator.generateId("BattleFieldHand");
        this.cardSceneId = cardSceneId;
        this.positionId = positionId;
        this.attributeMarkIdList = attributeMarkIdList;
    }

    getId(): number {
        return this.id;
    }

    getCardSceneId(): number {
        return this.cardSceneId;
    }

    getPositionId(): number {
        return this.positionId;
    }

    getAttributeMarkIdList(): number[] {
        return this.attributeMarkIdList;
    }
}
