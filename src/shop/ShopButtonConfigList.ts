import {ShopButtonConfig, ShopButtonType} from "./ShopButtonType";
import * as THREE from 'three';

export class ShopButtonConfigList {
    public static readonly buttonConfigs: ShopButtonConfig[] = [
        {
            id: 1,
            type: ShopButtonType.ALL,
            imagePath: 'resource/shop/buttons/draw_all.png',
            position: new THREE.Vector2(-650, -30)//all
        },
        {
            id: 2,
            type: ShopButtonType.HUMAN,
            imagePath: 'resource/shop/buttons/draw_human.png',
            position: new THREE.Vector2(655, -30)//human
        },
        {
            id: 3,
            type: ShopButtonType.TRENT,
            imagePath: 'resource/shop/buttons/draw_trent.png',
            position: new THREE.Vector2(210, -30)//trent
        },
        {
            id: 4,
            type: ShopButtonType.UNDEAD,
            imagePath: 'resource/shop/buttons/draw_human.png',
            position: new THREE.Vector2(-220, -30)//undead
        }
    ];
}