import {TryAgainButtonConfig, TryAgainButtonType} from "./TryAgainButtonType";
import * as THREE from 'three';

export class TryAgainButtonConfigList {
    public static readonly tryAgainButtonConfigs: TryAgainButtonConfig[] = [
        {
            id: 1,
            type: TryAgainButtonType.CANCEL,
            imagePath: 'resource/select_card_result_screen/try_again_buttons/cancel_button.png',
            position: new THREE.Vector2(120, -270)
        },
        {
            id: 2,
            type: TryAgainButtonType.ACCEPT,
            imagePath: 'resource/select_card_result_screen/try_again_buttons/accept_button.png',
            position: new THREE.Vector2(-70, -270)
        }
    ];
}