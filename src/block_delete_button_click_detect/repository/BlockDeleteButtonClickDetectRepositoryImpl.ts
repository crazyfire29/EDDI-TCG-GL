import * as THREE from "three";

import {BlockDeleteButtonClickDetectRepository} from "./BlockDeleteButtonClickDetectRepository";
import {BlockDeleteButton} from "../../block_delete_button/entity/BlockDeleteButton";

export class BlockDeleteButtonClickDetectRepositoryImpl implements BlockDeleteButtonClickDetectRepository {
    private static instance: BlockDeleteButtonClickDetectRepositoryImpl;
    private raycaster = new THREE.Raycaster();
    private currentClickedButtonId: number | null = null;

    public static getInstance(): BlockDeleteButtonClickDetectRepositoryImpl {
        if (!BlockDeleteButtonClickDetectRepositoryImpl.instance) {
            BlockDeleteButtonClickDetectRepositoryImpl.instance = new BlockDeleteButtonClickDetectRepositoryImpl();
        }
        return BlockDeleteButtonClickDetectRepositoryImpl.instance;
    }

    public isButtonClicked(clickPoint: { x: number; y: number }, buttonList: BlockDeleteButton[], camera: THREE.Camera): BlockDeleteButton | null {
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
                console.log('Detect Clicked Block Delete Button!')
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

    public resetCurrentClickedButtonId(): void {
        this.currentClickedButtonId = null;
    }

}