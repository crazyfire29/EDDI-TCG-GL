import {ShopSelectScreenConfig, ShopSelectScreenType} from "./ShopSelectScreenType";
import * as THREE from 'three';

export class ShopSelectScreenConfigList {
    public static readonly screenConfigs: ShopSelectScreenConfig[] = [
        {
            id: 1,
            type: ShopSelectScreenType.ALL,
            imagePath: 'resource/shop/select_screen/select_all.png',
            position: new THREE.Vector2(25, -30)
        },
        {
            id: 2,
            type: ShopSelectScreenType.UNDEAD,
            imagePath: 'resource/shop/select_screen/select_undead.png',
            position: new THREE.Vector2(25, -30)
        },
        {
            id: 3,
            type: ShopSelectScreenType.TRENT,
            imagePath: 'resource/shop/select_screen/select_trent.png',
            position: new THREE.Vector2(25, -30)
        },
        {
            id: 4,
            type: ShopSelectScreenType.HUMAN,
            imagePath: 'resource/shop/select_screen/select_human.png',
            position: new THREE.Vector2(25, -30)
        }
    ];
}