import * as THREE from 'three';
import {LeftClickedArea} from "../../left_click_detect/entity/LeftClickedArea";

export interface DragMoveService {
    onMouseMove(event: MouseEvent): void;
    getLeftClickedArea(): LeftClickedArea | null;
}