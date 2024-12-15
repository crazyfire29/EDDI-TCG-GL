import {BattleFieldHand} from "../entity/BattleFieldHand";


export interface BattleFieldHandService {
    create(cardId: number): BattleFieldHand;
}