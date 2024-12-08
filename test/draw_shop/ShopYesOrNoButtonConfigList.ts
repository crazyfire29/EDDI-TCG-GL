import {ShopYesOrNoButtonConfig, ShopYesOrNoButtonType} from "./ShopYesOrNoButtonType";
import * as THREE from 'three';

export class ShopYesOrNoButtonConfigList {
    public static readonly yesNoButtonConfigs: ShopYesOrNoButtonConfig[] = [
        {
            id: 1,
            type: ShopYesOrNoButtonType.YES,
            imagePath: 'resource/shop/yes_or_no/yes_button.png',
            position: new THREE.Vector2(-70, -270)
        },
        {
            id: 2,
            type: ShopYesOrNoButtonType.NO,
            imagePath: 'resource/shop/yes_or_no/no_button.png',
            position: new THREE.Vector2(120, -270)
        }
    ];
}