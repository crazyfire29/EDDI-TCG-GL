import * as THREE from 'three';
import {MakeDeckScreenCardEffect} from "../entity/MakeDeckScreenCardEffect";
import {Vector2d} from "../../common/math/Vector2d";

export interface MakeDeckScreenCardEffectRepository {
    createMakeDeckScreenCardEffect(cardId: number, position: Vector2d): Promise<MakeDeckScreenCardEffect>;
    findEffectByCardId(cardId: number): MakeDeckScreenCardEffect | null;
    findAllEffect(): MakeDeckScreenCardEffect[];
    findCardIdList(): number[];
    deleteAllEffect(): void;
}