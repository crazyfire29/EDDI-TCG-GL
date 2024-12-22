import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

export interface ButtonConfig {
    id: number;
    position: Vector2d;
}

export class MyDeckButtonPageMovementButtonConfigList {
    public buttonConfigs: ButtonConfig[] = [
        {
            id: 1,
            position: new Vector2d(528 / 1920, -435 / 1080)
        },
        {
            id: 2,
            position: new Vector2d(740 / 1920, -435 / 1080)
        },
    ];
}
