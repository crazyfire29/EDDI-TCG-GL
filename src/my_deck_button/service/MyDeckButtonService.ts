import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

import {MyDeckButton} from "../entity/MyDeckButton";

export interface MyDeckButtonService {
    getMyDeckButtonById(id: number): MyDeckButton | null;
    deleteMyDeckButtonById(id: number): void;
    getAllMyDeckButton(): MyDeckButton[];
    deleteAllMyDeckButton(): void;
}