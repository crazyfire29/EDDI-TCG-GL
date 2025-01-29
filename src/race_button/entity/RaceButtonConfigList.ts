import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

export interface ButtonConfig {
    id: number;
    position: Vector2d;
}

export class RaceButtonConfigList {
    public buttonConfigs: ButtonConfig[] = [
        {
            id: 1,
            position: new Vector2d(443 / 1920, 338 / 1080)
        },
        {
            id: 2,
            position: new Vector2d(443 / 1920, 260 / 1080)
        },
         {
             id: 3,
             position: new Vector2d(443 / 1920, 182 / 1080)
         },
    ];
}
