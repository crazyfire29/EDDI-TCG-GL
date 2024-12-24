import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

export interface MyDeckButtonPageMovementButtonService {
    createMyDeckButtonPageMovementButton(
        type: number,
        positionPercent:Vector2d
    ): Promise<THREE.Group | null>;
}