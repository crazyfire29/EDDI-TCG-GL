import * as THREE from "three";

import {GnbButtonClickDetectRepository} from "./GnbButtonClickDetectRepository";
import {GlobalNavigationBar} from "../../global_navigation_bar/entity/GlobalNavigationBar";

export class GnbButtonClickDetectRepositoryImpl implements GnbButtonClickDetectRepository {
    private static instance: GnbButtonClickDetectRepositoryImpl;
    private raycaster = new THREE.Raycaster();
    private currentClickedButtonId: number | null = null;

    public static getInstance(): GnbButtonClickDetectRepositoryImpl {
        if (!GnbButtonClickDetectRepositoryImpl.instance) {
            GnbButtonClickDetectRepositoryImpl.instance = new GnbButtonClickDetectRepositoryImpl();
        }
        return GnbButtonClickDetectRepositoryImpl.instance;
    }

    public isGnbButtonClicked(clickPoint: { x: number; y: number },
        buttonList: GlobalNavigationBar[],
        camera: THREE.Camera): any | null {
            const { x, y } = clickPoint;

            const normalizedMouse = new THREE.Vector2(
                (x / window.innerWidth) * 2 - 1,
                -(y / window.innerHeight) * 2 + 1
            );

            this.raycaster.setFromCamera(normalizedMouse, camera);

            const meshes = buttonList.map(button => button.getMesh());
            const intersects = this.raycaster.intersectObjects(meshes);

            if (intersects.length > 0) {
                const intersectedMesh = intersects[0].object;
                const clickedButton = buttonList.find(
                    button => button.getMesh() === intersectedMesh
                );

                if (clickedButton) {
                    console.log('Detect Clicked Button!')
                    return clickedButton;
                }
            }
            return null;
        }

    public saveCurrentClickedButtonId(id: number): void {
        this.currentClickedButtonId = id;
    }

    public findCurrentClickedButtonId(): number | null {
        return this.currentClickedButtonId;
    }

}