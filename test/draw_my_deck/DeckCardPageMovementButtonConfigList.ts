import {DeckCardPageMovementButtonConfig, DeckCardPageMovementButtonType} from "./DeckCardPageMovementButtonType";
import * as THREE from 'three';

export class DeckCardPageMovementButtonConfigList {
    public static readonly deckCardPageMovementButtonConfigs: DeckCardPageMovementButtonConfig[] = [
        {
            id: 1,
            type: DeckCardPageMovementButtonType.PREV,
            imagePath: 'resource/my_deck/card_page_movement_button/prev_button.png',
            position: new THREE.Vector2(-395, -487)
        },
        {
            id: 2,
            type: DeckCardPageMovementButtonType.NEXT,
            imagePath: 'resource/my_deck/card_page_movement_button/next_button.png',
            position: new THREE.Vector2(-170, -487)
        }
    ];
}