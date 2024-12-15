import {CardStatus} from "../entity/CardStatus";
import {BattleFieldCard} from "../entity/BattleFieldCard";

export interface BattleFieldCardService {
    create(status: CardStatus): BattleFieldCard;
}