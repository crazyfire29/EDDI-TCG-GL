import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

export interface GlobalNavigationBarEffectService {
    createGlobalNavigationBarEffect(type: number, position:Vector2d): Promise<THREE.Group | null>;
}