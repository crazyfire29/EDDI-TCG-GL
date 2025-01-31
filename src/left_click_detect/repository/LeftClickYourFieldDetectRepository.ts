import * as THREE from "three";
import {OpponentFieldCardScene} from "../../opponent_field_card_scene/entity/OpponentFieldCardScene";

export interface LeftClickYourFieldDetectRepository {
    isYourFieldAreaClicked(clickPoint: { x: number; y: number },
                           cardSceneList: OpponentFieldCardScene[],
                           camera: THREE.Camera): any | null;
}