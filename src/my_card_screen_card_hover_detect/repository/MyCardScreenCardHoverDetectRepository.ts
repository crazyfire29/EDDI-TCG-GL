import * as THREE from "three";
import {MyCardScreenCard} from "../../my_card_screen_card/entity/MyCardScreenCard";

export interface MyCardScreenCardHoverDetectRepository {
    isMyCardScreenCardHover(hoverPoint: { x: number; y: number },
        cardList: MyCardScreenCard[],
        camera: THREE.Camera): any | null;
}