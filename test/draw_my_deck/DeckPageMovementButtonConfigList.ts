import {DeckPageMovementButtonConfig, DeckPageMovementButtonType} from "./DeckPageMovementButtonType";
import * as THREE from 'three';

export class DeckPageMovementButtonConfigList {
    public static readonly deckPageMovementButtonConfigs: DeckPageMovementButtonConfig[] = [
        {
            id: 1,
            type: DeckPageMovementButtonType.PREV,
            imagePath: 'resource/my_deck/deck_page_movement_button/prev_button.png',
            position: new THREE.Vector2(160, -140)
        },
        {
            id: 2,
            type: DeckPageMovementButtonType.NEXT,
            imagePath: 'resource/my_deck/deck_page_movement_button/next_button.png',
            position: new THREE.Vector2(-160, -140)
        }
    ];
}