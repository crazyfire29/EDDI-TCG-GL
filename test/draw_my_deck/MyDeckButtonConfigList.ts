import {MyDeckButtonConfig, MyDeckButtonType} from "./MyDeckButtonType";
import * as THREE from 'three';

export class MyDeckButtonConfigList {
    public static readonly myDeckButtonConfigs: MyDeckButtonConfig[] = [
        {
            id: 1,
            type: MyDeckButtonType.CLICKDECKBUTTON,
            imagePath: 'resource/my_deck/my_deck_buttons/click_deck_button.png',
//             position: new THREE.Vector2(160, -140)
        },
        {
            id: 2,
            type: MyDeckButtonType.NOTCLICKDECKBUTTON,
            imagePath: 'resource/my_deck/my_deck_buttons/not_click_deck_button.png',
//             position: new THREE.Vector2(-160, -140)
        }
    ];
}