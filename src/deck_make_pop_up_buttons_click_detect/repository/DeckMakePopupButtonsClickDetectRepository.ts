import {DeckMakePopupButtons} from "../../deck_make_pop_up_buttons/entity/DeckMakePopupButtons";

import * as THREE from "three";

export interface DeckMakePopupButtonsClickDetectRepository {
    isDeckMakePopupButtonsClicked(clickPoint: { x: number; y: number },
                          deckMakePopupButtonsList: DeckMakePopupButtons[],
                          camera: THREE.Camera): any | null;
}