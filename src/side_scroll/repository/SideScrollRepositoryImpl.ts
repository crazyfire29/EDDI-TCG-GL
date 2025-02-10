import * as THREE from "three";

import {SideScrollRepository} from "./SideScrollRepository";
import {SideScrollArea} from "../../side_scroll_area/entity/SideScrollArea";

export class SideScrollRepositoryImpl implements SideScrollRepository {
    private static instance: SideScrollRepositoryImpl;
    private raycaster = new THREE.Raycaster();
    private renderer: THREE.WebGLRenderer;

    private constructor(renderer: THREE.WebGLRenderer) {
        this.renderer = renderer;
    }

    public static getInstance(renderer: THREE.WebGLRenderer): SideScrollRepositoryImpl {
        if (!SideScrollRepositoryImpl.instance) {
            SideScrollRepositoryImpl.instance = new SideScrollRepositoryImpl(renderer);
        }
        return SideScrollRepositoryImpl.instance;
    }

     public setClippingPlanes(sideScrollArea: SideScrollArea): THREE.Plane[] {
         if (!sideScrollArea) {
             console.error("SideScrollArea is null. Clipping planes cannot be set.");
             return [];
         }
         const sideScrollAreaX = sideScrollArea.position.x;
         const sideScrollAreaY = sideScrollArea.position.y;
         const sideScrollAreaWidth = sideScrollArea.width;
         const sideScrollAreaHeight = sideScrollArea.height;

         if (sideScrollAreaWidth !== null && sideScrollAreaHeight !== null) {
             const clippingPlanes = [
                 new THREE.Plane(new THREE.Vector3(-1, 0, 0),  sideScrollAreaX + sideScrollAreaWidth / 2), // 왼쪽
                 new THREE.Plane(new THREE.Vector3(1, 0, 0), - (sideScrollAreaX - sideScrollAreaWidth / 2)),  // 오른쪽
                 new THREE.Plane(new THREE.Vector3(0, -1, 0), sideScrollAreaY + sideScrollAreaHeight / 2), // 아래쪽
                 new THREE.Plane(new THREE.Vector3(0, 1, 0), -(sideScrollAreaY - sideScrollAreaHeight / 2)),  // 위쪽
             ];

             this.renderer.localClippingEnabled = true;
//              this.renderer.clippingPlanes = clippingPlanes;

             return clippingPlanes;
         }
         return [];
     }

}