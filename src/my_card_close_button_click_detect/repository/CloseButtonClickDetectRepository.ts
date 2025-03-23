import * as THREE from "three";
import {MyCardCloseButton} from "../../my_card_close_button/entity/MyCardCloseButton";

export interface CloseButtonClickDetectRepository {
    isCloseButtonClicked(clickPoint: { x: number; y: number },
                         closeButton: MyCardCloseButton,
                         camera: THREE.Camera): any | null;
}