import {SideScrollArea} from "../../side_scroll_area/entity/SideScrollArea";

import * as THREE from "three";

export interface SideScrollAreaDetectRepository {
    isSideScrollAreaDetect(detectPoint: { x: number; y: number },
                          sideScrollArea: SideScrollArea,
                          camera: THREE.Camera): any | null;
}