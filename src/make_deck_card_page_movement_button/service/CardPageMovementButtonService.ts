import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";
import {CardPageMovementButtonType} from "../entity/CardPageMovementButtonType";

export interface CardPageMovementButtonService {
    createCardPageMovementButton(
        type: CardPageMovementButtonType,
        position:Vector2d
    ): Promise<THREE.Group | null>;
}