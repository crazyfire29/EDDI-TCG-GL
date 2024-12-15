import {IdGenerator} from "../../common/id_generator/IdGenerator";
import {CardStatus} from "./CardStatus";

export class BattleFieldCard {
    id: number;
    cardSceneId: number;
    positionId: number;
    attributeMarkIdList: number[];
    status: CardStatus;

    constructor(cardSceneId: number, positionId: number, attributeMarkIdList: number[], status: CardStatus = CardStatus.HAND) {
        this.id = IdGenerator.generateId();
        this.cardSceneId = cardSceneId;
        this.positionId = positionId;
        this.attributeMarkIdList = attributeMarkIdList;
        this.status = status;
    }
}
