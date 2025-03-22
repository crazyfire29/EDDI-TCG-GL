import * as THREE from "three";
import {MyCardScreenCard} from "../../my_card_screen_card/entity/MyCardScreenCard";

export interface MyCardScreenCardClickDetectRepository {
    isMyCardScreenCardClicked(clickPoint: { x: number; y: number },
        cardList: MyCardScreenCard[],
        camera: THREE.Camera): any | null;
}