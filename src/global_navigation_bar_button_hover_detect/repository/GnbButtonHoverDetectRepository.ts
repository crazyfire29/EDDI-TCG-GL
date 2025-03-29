import * as THREE from "three";
import {GlobalNavigationBar} from "../../global_navigation_bar/entity/GlobalNavigationBar";

export interface GnbButtonHoverDetectRepository {
    isGnbButtonHover(hoverPoint: { x: number; y: number },
        buttonList: GlobalNavigationBar[],
        camera: THREE.Camera): any | null;
}