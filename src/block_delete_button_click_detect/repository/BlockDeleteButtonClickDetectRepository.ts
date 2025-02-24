import * as THREE from "three";
import {BlockDeleteButton} from "../../block_delete_button/entity/BlockDeleteButton";

export interface BlockDeleteButtonClickDetectRepository {
    isButtonClicked(clickPoint: { x: number; y: number },
        buttonList: BlockDeleteButton[],
        camera: THREE.Camera): BlockDeleteButton | null;
}