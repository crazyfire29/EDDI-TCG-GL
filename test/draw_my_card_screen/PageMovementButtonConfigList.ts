import {PageMovementButtonConfig, PageMovementButtonType} from "./PageMovementButtonType";
import * as THREE from 'three';

export class PageMovementButtonConfigList {
    public static readonly PageMovementButtonConfigs: PageMovementButtonConfig[] = [
        {
            id: 1,
            type: PageMovementButtonType.PREV,
            imagePath: 'resource/my_card/page_movement_button/prev_gold_button.png',
            position: new THREE.Vector2(-140, -400)
        },
        {
            id: 2,
            type: PageMovementButtonType.NEXT,
            imagePath: 'resource/my_card/page_movement_button/next_gold_button.png',
            position: new THREE.Vector2(110, -400)
        }
    ];
}