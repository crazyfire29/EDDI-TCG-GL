import * as THREE from "three";
import {SideScrollArea} from "../side_scroll_area/entity/SideScrollArea";

export class ClippingMaskManager {
    private static instance: ClippingMaskManager;
    private clippingPlanesMap: Map<number, THREE.Plane[]> = new Map();
    private raycaster = new THREE.Raycaster();
    private renderer: THREE.WebGLRenderer | null = null;;

    private constructor() {}

    public static getInstance(): ClippingMaskManager {
        if (!ClippingMaskManager.instance) {
            ClippingMaskManager.instance = new ClippingMaskManager();
        }
        return ClippingMaskManager.instance;
    }

    public setRenderer(renderer: THREE.WebGLRenderer): void {
        this.renderer = renderer;
        this.renderer.localClippingEnabled = true;
    }

    public setClippingPlanes(id: number, sideScrollArea: SideScrollArea): THREE.Plane[] {
        if (!sideScrollArea) {
            console.error("SideScrollArea is null. Clipping planes cannot be set.");
            return [];
        }

        // 이미 존재하면 새로 추가하지 않음
//         if (this.clippingPlanesMap.has(id)) {
//             console.warn(`Clipping planes for id ${id} already exist. Skipping update.`);
//             return this.clippingPlanesMap.get(id) || [];
//         }

        const sideScrollAreaX = sideScrollArea.position.x;
        const sideScrollAreaY = sideScrollArea.position.y;
        const sideScrollAreaWidth = sideScrollArea.width;
        const sideScrollAreaHeight = sideScrollArea.height;

        if (sideScrollAreaWidth !== null && sideScrollAreaHeight !== null) {
            const clippingPlanes = [
                new THREE.Plane(new THREE.Vector3(-1, 0, 0),  sideScrollAreaX + sideScrollAreaWidth / 2),
                new THREE.Plane(new THREE.Vector3(1, 0, 0), - (sideScrollAreaX - sideScrollAreaWidth / 2)),
                new THREE.Plane(new THREE.Vector3(0, -1, 0), sideScrollAreaY + sideScrollAreaHeight / 2),
                new THREE.Plane(new THREE.Vector3(0, 1, 0), -(sideScrollAreaY - sideScrollAreaHeight / 2)),
            ];

            this.clippingPlanesMap.set(id, clippingPlanes);
            return clippingPlanes;
        }
        return [];
    }

    public applyClippingPlanesToMesh(mesh: THREE.Mesh, clippingPlanes: THREE.Plane[]): void {
        if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => {
                if (material instanceof THREE.Material) {
                    material.clippingPlanes = clippingPlanes;
                }
            });
        } else if (mesh.material instanceof THREE.Material) {
            mesh.material.clippingPlanes = clippingPlanes;
        }
    }

    public getClippingPlanes(id: number): THREE.Plane[] {
        return this.clippingPlanesMap.get(id) || [];
    }

    public removeClippingPlanes(id: number): void {
        this.clippingPlanesMap.delete(id);
    }
}
