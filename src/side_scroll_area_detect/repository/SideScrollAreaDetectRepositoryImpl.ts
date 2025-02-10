import * as THREE from "three";

import {SideScrollAreaDetectRepository} from "./SideScrollAreaDetectRepository";
import {SideScrollArea} from "../../side_scroll_area/entity/SideScrollArea";

export class SideScrollAreaDetectRepositoryImpl implements SideScrollAreaDetectRepository {
    private static instance: SideScrollAreaDetectRepositoryImpl;
    private isScrollEnabled: boolean = false;
    private raycaster = new THREE.Raycaster();

    public static getInstance(): SideScrollAreaDetectRepositoryImpl {
        if (!SideScrollAreaDetectRepositoryImpl.instance) {
            SideScrollAreaDetectRepositoryImpl.instance = new SideScrollAreaDetectRepositoryImpl();
        }
        return SideScrollAreaDetectRepositoryImpl.instance;
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

    public setScrollEnabled(enable: boolean): void {
        this.isScrollEnabled = enable;
    }

    public findScrollEnabled(): boolean {
        return this.isScrollEnabled;
    }

}