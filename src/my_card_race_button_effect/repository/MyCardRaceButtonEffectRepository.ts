import * as THREE from 'three';
import {MyCardRaceButtonEffect} from "../entity/MyCardRaceButtonEffect";
import {CardRace} from "../../card/race";
import {Vector2d} from "../../common/math/Vector2d";

export interface MyCardRaceButtonEffectRepository {
    createRaceButtonEffect(type: CardRace, position: Vector2d): Promise<MyCardRaceButtonEffect>;
    findEffectById(id: number): MyCardRaceButtonEffect | null;
    findAllEffect(): MyCardRaceButtonEffect[];
    deleteById(id: number): void;
    deleteAll(): void;
    findAllEffectIds(): number[];
    hideEffect(effectId: number): void;
    showEffect(effectId: number): void;
}