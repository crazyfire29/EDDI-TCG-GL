import * as THREE from "three";
import {SelectedCardBlock} from "../../selected_card_block/entity/SelectedCardBlock";

export interface SelectedCardBlockHoverDetectRepository {
    isBlockHover(hoverPoint: { x: number; y: number },
        blockList: SelectedCardBlock[],
        camera: THREE.Camera): SelectedCardBlock | null;
}