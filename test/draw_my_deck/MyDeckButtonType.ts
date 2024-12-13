import * as THREE from 'three';

export enum MyDeckButtonType {
    CLICKDECKBUTTON = "click_deck_button",
    NOTCLICKDECKBUTTON = "not_click_deck_button"
}

export interface MyDeckButtonConfig {
    id: number;
    type: MyDeckButtonType;
    imagePath: string;
    position: THREE.Vector2;
}