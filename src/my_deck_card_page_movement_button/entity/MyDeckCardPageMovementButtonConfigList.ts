import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

export interface ButtonConfig {
    id: number;
    position: Vector2d;
}

export class MyDeckCardPageMovementButtonConfigList {
    public buttonConfigs: ButtonConfig[] = [
        {
            id: 1,
            position: new Vector2d(-395 / 1920, -487 / 1080)
        },
        {
            id: 2,
            position: new Vector2d(-169 / 1920, -487 / 1080)
        },
    ];
}
