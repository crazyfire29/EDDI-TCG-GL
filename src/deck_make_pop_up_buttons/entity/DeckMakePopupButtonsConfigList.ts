import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

export interface ButtonConfig {
    id: number;
    position: Vector2d;
}

export class DeckMakePopupButtonsConfigList {
    public buttonConfigs: ButtonConfig[] = [
        {
            id: 1,
            position: new Vector2d(155 / 1920, -134 / 1080)
        },
        {
            id: 2,
            position: new Vector2d(-155 / 1920, -134 / 1080)
        },
    ];
}
