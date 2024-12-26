import {MyDeckButtonScene} from "../../my_deck_button_scene/entity/MyDeckButtonScene";
import * as THREE from "three";

export interface MyDeckButtonClickDetectRepository {
    isMyDeckButtonClicked(clickPoint: { x: number; y: number },
                          deckSceneList: MyDeckButtonScene[],
                          camera: THREE.Camera): any | null;
}