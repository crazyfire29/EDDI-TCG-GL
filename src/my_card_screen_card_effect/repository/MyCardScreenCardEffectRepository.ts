import * as THREE from 'three';
import {MyCardScreenCardEffect} from "../entity/MyCardScreenCardEffect";
import {Vector2d} from "../../common/math/Vector2d";

export interface MyCardScreenCardEffectRepository {
    createMyCardScreenCardEffect(cardId: number, position: Vector2d): Promise<MyCardScreenCardEffect>;
    findEffectByCardId(cardId: number): MyCardScreenCardEffect | null;
    findAllEffect(): MyCardScreenCardEffect[];
    findAllCardIdList(): number[];
    deleteAllEffect(): void;
}