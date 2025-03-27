import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

export interface ButtonConfig {
    id: number;
    position: Vector2d;
}

export class GlobalNavigationBarConfigList {
    public buttonConfigs: ButtonConfig[] = [
        {
            id: 1,
            position: new Vector2d(-0.241, 0.421)
        },
        {
            id: 2,
            position: new Vector2d(-0.139, 0.425)
        },
         {
             id: 3,
             position: new Vector2d(-0.042, 0.425)
         },
         {
             id: 4,
             position: new Vector2d(0.0532, 0.425)
         },
         {
             id: 5,
             position: new Vector2d(0.1495, 0.421)
         },
         {
             id: 6,
             position: new Vector2d(0.245, 0.425)
         }
    ];
}
