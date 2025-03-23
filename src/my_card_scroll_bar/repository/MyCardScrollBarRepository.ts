import * as THREE from 'three';
import {MyCardScrollBar} from "../entity/MyCardScrollBar";
import {Vector2d} from "../../common/math/Vector2d";

export interface MyCardScrollBarRepository {
    createScrollBar(type: number, position: Vector2d): Promise<MyCardScrollBar>;
    findScrollBarById(id: number): MyCardScrollBar | null;
    findAllScrollBar(): MyCardScrollBar[];
    deleteById(id: number): void;
    deleteAll(): void;
    findAllScrollBarIds(): number[];
    hideScrollBar(id: number): void;
    showScrollBar(id: number): void;
}