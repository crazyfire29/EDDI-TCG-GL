import * as THREE from 'three';
import {GlobalNavigationBarEffect} from "../entity/GlobalNavigationBarEffect";
import {Vector2d} from "../../common/math/Vector2d";

export interface GlobalNavigationBarEffectRepository {
    createGlobalNavigationBarEffect(type: number, position: Vector2d): Promise<GlobalNavigationBarEffect>;
    findEffectById(buttonId: number): GlobalNavigationBarEffect | null;
    findAllEffect(): GlobalNavigationBarEffect[];
    findAllEffectIdList(): number[];
    deleteAllEffect(): void;
}