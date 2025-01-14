import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

import {MyDeckButton} from "../entity/MyDeckButton";

export interface MyDeckButtonService {
    getMyDeckButtonByDeckId(deckId: number): MyDeckButton | null;
    getAllMyDeckButton(): MyDeckButton[];
    deleteMyDeckButtonByDeckId(deckId: number): void;
    deleteAllMyDeckButton(): void;
}