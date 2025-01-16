import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

import {MyDeckNameText} from "../entity/MyDeckNameText";

export interface MyDeckNameTextService {
    getMyDeckNameTextByDeckId(deckId: number): MyDeckNameText | null;
    getAllMyDeckNameText(): MyDeckNameText[];
    deleteMyDeckNameTextByDeckId(deckId: number): void;
    deleteAllMyDeckNameText(): void;
}