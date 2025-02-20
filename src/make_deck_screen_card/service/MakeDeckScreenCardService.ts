import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

export interface MakeDeckScreenCardService {
    createMakeDeckScreenCardWithPosition(cardIdToCountMap: Map<number, number>): Promise<THREE.Group | null>;
}