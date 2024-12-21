import * as THREE from 'three';
import {BattleFieldHand} from "../entity/BattleFieldHand";


export interface BattleFieldHandService {
    // createHand(cardId: number);
    // createHand(cardId: number): BattleFieldHand;
    createHand(cardId: number): Promise<THREE.Group>;
    createBattleFieldFirstDrawHand(): any;
}