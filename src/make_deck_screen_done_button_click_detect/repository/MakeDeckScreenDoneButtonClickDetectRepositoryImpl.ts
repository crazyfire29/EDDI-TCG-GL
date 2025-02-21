import * as THREE from "three";

import {MakeDeckScreenDoneButtonClickDetectRepository} from "./MakeDeckScreenDoneButtonClickDetectRepository";
import {MakeDeckScreenDoneButton} from "../../make_deck_screen_done_button/entity/MakeDeckScreenDoneButton";

export class MakeDeckScreenDoneButtonClickDetectRepositoryImpl implements MakeDeckScreenDoneButtonClickDetectRepository {
    private static instance: MakeDeckScreenDoneButtonClickDetectRepositoryImpl;
    private currentClickedButtonId: number | null = null;
    private raycaster = new THREE.Raycaster();

    public static getInstance(): MakeDeckScreenDoneButtonClickDetectRepositoryImpl {
        if (!MakeDeckScreenDoneButtonClickDetectRepositoryImpl.instance) {
            MakeDeckScreenDoneButtonClickDetectRepositoryImpl.instance = new MakeDeckScreenDoneButtonClickDetectRepositoryImpl();
        }
        return MakeDeckScreenDoneButtonClickDetectRepositoryImpl.instance;
    }

    public isDoneButtonClicked(clickPoint: { x: number; y: number },
        buttonList: MakeDeckScreenDoneButton[],
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

    public saveCurrentClickedDoneButtonId(id: number): void {
        this.currentClickedButtonId = id;
    }

    public findCurrentClickedDoneButtonId(): number | null {
        return this.currentClickedButtonId;
    }

}