import {DeckMakeButton} from "../../deck_make_button/entity/DeckMakeButton";

import * as THREE from "three";

export interface DeckMakeButtonClickDetectRepository {
    isDeckMakeButtonClicked(clickPoint: { x: number; y: number },
                          deckMakeButton: DeckMakeButton,
                          camera: THREE.Camera): any | null;
}