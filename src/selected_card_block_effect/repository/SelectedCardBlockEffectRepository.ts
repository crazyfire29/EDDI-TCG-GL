import * as THREE from 'three';
import {SelectedCardBlockEffect} from "../entity/SelectedCardBlockEffect";
import {Vector2d} from "../../common/math/Vector2d";

export interface SelectedCardBlockEffectRepository {
    createSelectedCardBlockEffect(cardId: number, position: Vector2d): Promise<SelectedCardBlockEffect>;
    findEffectByEffectId(effectId: number): SelectedCardBlockEffect | null;
    findEffectByCardId(cardId: number): SelectedCardBlockEffect | null;
    findAllEffects(): SelectedCardBlockEffect[];
    findEffectIdList(): number[];
    deleteAllEffect(): void;
    deleteEffectByEffectId(effectId: number): void;
}