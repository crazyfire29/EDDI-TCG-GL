import {MyDeckButtonPageMovementButton} from "../../my_deck_button_page_movement_button/entity/MyDeckButtonPageMovementButton";

import * as THREE from "three";

export interface DeckPageMovementButtonClickDetectRepository {
    isDeckMoveButtonClicked(clickPoint: { x: number; y: number },
                          deckMoveButtonList: MyDeckButtonPageMovementButton[],
                          camera: THREE.Camera): any | null;
}