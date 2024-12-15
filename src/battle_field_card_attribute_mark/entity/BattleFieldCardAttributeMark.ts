import {CardStatus} from "../../deprecated_battle_field_card/entity/CardStatus";
import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class BattleFieldCardAttributeMark {
    id: number;
    status: CardStatus;
    attributeMarkSceneId: number
    renderingOrder: number;

    constructor(status: CardStatus = CardStatus.HAND, attributeMarkSceneId: number, renderingOrder: number = 0) {
        this.id = IdGenerator.generateId();
        this.status = status;
        this.attributeMarkSceneId = attributeMarkSceneId;
        this.renderingOrder = renderingOrder;
    }
}