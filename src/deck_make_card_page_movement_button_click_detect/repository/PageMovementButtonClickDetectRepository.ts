import {CardPageMovementButton} from "../../make_deck_card_page_movement_button/entity/CardPageMovementButton";

import * as THREE from "three";

export interface PageMovementButtonClickDetectRepository {
    isPageMovementButtonClicked(clickPoint: { x: number; y: number },
                          pageMovementButtonList: CardPageMovementButton[],
                          camera: THREE.Camera): any | null;

}