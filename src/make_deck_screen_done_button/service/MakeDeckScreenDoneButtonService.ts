import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";
import {MakeDeckScreenDoneButtonType} from "../entity/MakeDeckScreenDoneButtonType";

export interface MakeDeckScreenDoneButtonService {
    createDoneButton(
        type: MakeDeckScreenDoneButtonType,
        position:Vector2d
    ): Promise<THREE.Group | null>;
}