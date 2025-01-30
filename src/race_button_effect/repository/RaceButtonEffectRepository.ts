import * as THREE from 'three';
import {RaceButtonEffect} from "../entity/RaceButtonEffect";
import {CardRace} from "../../card/race";
import {Vector2d} from "../../common/math/Vector2d";

export interface RaceButtonEffectRepository {
    createRaceButtonEffect(type: CardRace, position: Vector2d): Promise<RaceButtonEffect>;
    findById(id: number): RaceButtonEffect | null;
    findAll(): RaceButtonEffect[];
    deleteById(id: number): void;
    deleteAll(): void;
    findAllEffectIds(): number[];
    hideRaceButtonEffect(effectId: number): void;
    showRaceButtonEffect(effectId: number): void;
}