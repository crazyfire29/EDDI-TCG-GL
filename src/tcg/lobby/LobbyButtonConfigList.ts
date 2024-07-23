import {LobbyButtonConfig, LobbyButtonType} from "./LobbyButtonType";
import * as THREE from 'three';

export class LobbyButtonConfigList {
    public static readonly buttonConfigs: LobbyButtonConfig[] = [
        {
            type: LobbyButtonType.OneVsOne,
            imagePath: 'resource/main_lobby/buttons/entrance_game_button.png',
            position: new THREE.Vector2(0, -200)
        },
        {
            type: LobbyButtonType.MyCards,
            imagePath: 'resource/main_lobby/buttons/my_card_button.png',
            position: new THREE.Vector2(0, -80)
        },
        {
            type: LobbyButtonType.Shop,
            imagePath: 'resource/main_lobby/buttons/shop_button.png',
            position: new THREE.Vector2(0, 40)
        },
        {
            type: LobbyButtonType.Test,
            imagePath: 'resource/main_lobby/buttons/test_button.png',
            position: new THREE.Vector2(0, 160)
        }
    ];
}