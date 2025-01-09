import * as THREE from "three";
import {MyDeckCardPageMovementButton} from "../../my_deck_card_page_movement_button/entity/MyDeckCardPageMovementButton";

export interface DeckCardPageMoveButtonClickDetectRepository {
    isDeckCardPageMoveButtonClicked(clickPoint: { x: number; y: number },
        deckCardPageMoveButtonList: MyDeckCardPageMovementButton[],
        camera: THREE.Camera): any | null;
}