import * as THREE from "three";

import {SideScrollRepository} from "./SideScrollRepository";
import {SideScrollArea} from "../../side_scroll_area/entity/SideScrollArea";

export class SideScrollRepositoryImpl implements SideScrollRepository {
    private static instance: SideScrollRepositoryImpl;
    private raycaster = new THREE.Raycaster();

    public static getInstance(): SideScrollRepositoryImpl {
        if (!SideScrollRepositoryImpl.instance) {
            SideScrollRepositoryImpl.instance = new SideScrollRepositoryImpl();
        }
        return SideScrollRepositoryImpl.instance;
    }

    public isSideScrollAreaDetect(detectPoint: { x: number; y: number },
                          sideScrollArea: SideScrollArea,
                          camera: THREE.Camera): any | null {
        const { x, y } = detectPoint;

        const normalizedMouse = new THREE.Vector2(
            (x / window.innerWidth) * 2 - 1,
            -(y / window.innerHeight) * 2 + 1
        );

        this.raycaster.setFromCamera(normalizedMouse, camera);

        const mesh = sideScrollArea.getMesh();
        const intersect = this.raycaster.intersectObject(mesh);

        if (intersect.length > 0) {
            console.log('detect sideScrollArea!')
            return mesh;
        }

        return null;
    }

}