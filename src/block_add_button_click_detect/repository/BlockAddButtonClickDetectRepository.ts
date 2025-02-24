import * as THREE from "three";
import {BlockAddButton} from "../../block_add_button/entity/BlockAddButton";

export interface BlockAddButtonClickDetectRepository {
    isButtonClicked(clickPoint: { x: number; y: number },
        buttonList: BlockAddButton[],
        camera: THREE.Camera): BlockAddButton | null;
}