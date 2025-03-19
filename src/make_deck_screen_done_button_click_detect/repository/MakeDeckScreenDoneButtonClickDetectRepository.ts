import * as THREE from "three";
import {MakeDeckScreenDoneButton} from "../../make_deck_screen_done_button/entity/MakeDeckScreenDoneButton";

export interface MakeDeckScreenDoneButtonClickDetectRepository {
//     isDoneButtonClicked(clickPoint: { x: number; y: number },
//         buttonList: MakeDeckScreenDoneButton[],
//         camera: THREE.Camera): any | null;

    isDoneButtonClicked(clickPoint: { x: number; y: number },
        button: MakeDeckScreenDoneButton,
        camera: THREE.Camera): any | null;
}