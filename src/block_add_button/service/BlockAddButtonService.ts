import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

export interface BlockAddButtonService {
    createBlockAddButtonWithPosition(cardId: number): Promise<THREE.Group | null>;
}