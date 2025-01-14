import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

import {MyDeckButtonEffect} from "../entity/MyDeckButtonEffect";

export interface MyDeckButtonEffectService {
    getMyDeckButtonEffectByDeckId(deckId: number): MyDeckButtonEffect | null;
    getAllMyButtonEffect(): MyDeckButtonEffect[];
//     deleteMyDeckButtonEffectByDeckId(deckId: number): void;
//     deleteAllMyDeckButtonEffect(): void;
}