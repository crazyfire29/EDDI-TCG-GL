import * as THREE from "three";
import {GlobalNavigationBar} from "../../global_navigation_bar/entity/GlobalNavigationBar";

export interface GnbButtonClickDetectRepository {
    isGnbButtonClicked(clickPoint: { x: number; y: number },
        buttonList: GlobalNavigationBar[],
        camera: THREE.Camera): any | null;
}