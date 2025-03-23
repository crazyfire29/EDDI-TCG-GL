import * as THREE from "three";

import {CloseButtonClickDetectRepository} from "./CloseButtonClickDetectRepository";
import {MyCardCloseButton} from "../../my_card_close_button/entity/MyCardCloseButton";

export class CloseButtonClickDetectRepositoryImpl implements CloseButtonClickDetectRepository {
    private static instance: CloseButtonClickDetectRepositoryImpl;
    private currentClickedButtonId: number | null = null;
    private raycaster = new THREE.Raycaster();

    public static getInstance(): CloseButtonClickDetectRepositoryImpl {
        if (!CloseButtonClickDetectRepositoryImpl.instance) {
            CloseButtonClickDetectRepositoryImpl.instance = new CloseButtonClickDetectRepositoryImpl();
        }
        return CloseButtonClickDetectRepositoryImpl.instance;
    }

    public isCloseButtonClicked(clickPoint: { x: number; y: number },
        button: MyCardCloseButton,
        camera: THREE.Camera): any | null {
            const { x, y } = clickPoint;
            const normalizedMouse = new THREE.Vector2(
                (x / window.innerWidth) * 2 - 1,
                -(y / window.innerHeight) * 2 + 1
            );

            this.raycaster.setFromCamera(normalizedMouse, camera);

            const mesh = button.getMesh();
            const intersects = this.raycaster.intersectObject(mesh);

            if (intersects.length > 0) {
                return button;
            } else {
                return null;
            }

        }

}