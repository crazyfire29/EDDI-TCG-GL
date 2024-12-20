import * as THREE from 'three';
import {NonBackgroundImage} from "../../shape/image/NonBackgroundImage";

export interface MyDeckButtonPageMovementButtonService {
    createMyDeckButtonPageMovementButton(
        textureName: string,
        type: number,
        widthPercent: number,
        heightPercent: number,
        positionPercent:THREE.Vector2
    ): Promise<NonBackgroundImage | null>;
}