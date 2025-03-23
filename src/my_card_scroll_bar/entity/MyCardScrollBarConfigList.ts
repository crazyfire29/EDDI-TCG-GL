import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

export interface ScrollBarConfig {
    id: number;
    position: Vector2d;
}

export class MyCardScrollBarConfigList {
    public scrollBarConfigs: ScrollBarConfig[] = [
        {
            // scroll bar
            id: 1,
            position: new Vector2d(0.416, -0.02)
        },
        {
            // scroll handle
            id: 2,
            position: new Vector2d(0.416, 0.28)
        }
    ];
}
