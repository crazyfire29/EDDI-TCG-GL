import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

export interface RaceButtonEffectService {
    createRaceButtonEffect(
        type: number,
        positionPercent:Vector2d
    ): Promise<THREE.Group | null>;
}