import * as THREE from "three";

import {GnbButtonHoverDetectRepository} from "./GnbButtonHoverDetectRepository";
import {GlobalNavigationBar} from "../../global_navigation_bar/entity/GlobalNavigationBar";

export class GnbButtonHoverDetectRepositoryImpl implements GnbButtonHoverDetectRepository {
    private static instance: GnbButtonHoverDetectRepositoryImpl;
    private raycaster = new THREE.Raycaster();
    private currentHoverButtonId: number | null = null;

    public static getInstance(): GnbButtonHoverDetectRepositoryImpl {
        if (!GnbButtonHoverDetectRepositoryImpl.instance) {
            GnbButtonHoverDetectRepositoryImpl.instance = new GnbButtonHoverDetectRepositoryImpl();
        }
        return GnbButtonHoverDetectRepositoryImpl.instance;
    }

    public isGnbButtonHover(hoverPoint: { x: number; y: number },
        buttonList: GlobalNavigationBar[],
        camera: THREE.Camera): any | null {
            const { x, y } = hoverPoint;

            const normalizedMouse = new THREE.Vector2(
                (x / window.innerWidth) * 2 - 1,
                -(y / window.innerHeight) * 2 + 1
            );

            this.raycaster.setFromCamera(normalizedMouse, camera);

            const meshes = buttonList.map(button => button.getMesh());
            const intersects = this.raycaster.intersectObjects(meshes);

            if (intersects.length > 0) {
                const intersectedMesh = intersects[0].object;
                const hoveredButton = buttonList.find(
                    button => button.getMesh() === intersectedMesh
                );

                if (hoveredButton) {
                    console.log('Detect Hovered Button!')
                    return hoveredButton;
                }
            }
            return null;
        }

    public saveCurrentHoveredButtonId(id: number): void {
        this.currentHoverButtonId = id;
    }

    public findCurrentHoveredButtonId(): number | null {
        return this.currentHoverButtonId;
    }

}