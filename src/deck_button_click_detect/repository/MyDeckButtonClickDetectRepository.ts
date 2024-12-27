import {MyDeckButton} from "../../my_deck_button/entity/MyDeckButton";
import * as THREE from "three";

export interface MyDeckButtonClickDetectRepository {
    isMyDeckButtonClicked(clickPoint: { x: number; y: number },
                          deckButtonList: MyDeckButton[],
                          camera: THREE.Camera): any | null;
}