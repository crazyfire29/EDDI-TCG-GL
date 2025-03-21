import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

export interface ButtonConfig {
    id: number;
    position: Vector2d;
}

export class MyCardRaceButtonConfigList {
    public buttonConfigs: ButtonConfig[] = [
        {
            id: 1,
            position: new Vector2d(-865 / 1920, 270 / 1080)
        },
        {
            id: 2,
            position: new Vector2d(-865 / 1920, 100 / 1080)
        },
         {
             id: 3,
             position: new Vector2d(-865 / 1920, -70 / 1080)
         },
    ];
}
