import * as THREE from "three";
import {MakeDeckScreenCard} from "../../make_deck_screen_card/entity/MakeDeckScreenCard";

export interface MakeDeckScreenCardClickDetectRepository {
    isMakeDeckScreenCardClicked(clickPoint: { x: number; y: number },
        cardList: MakeDeckScreenCard[],
        camera: THREE.Camera): any | null;
}