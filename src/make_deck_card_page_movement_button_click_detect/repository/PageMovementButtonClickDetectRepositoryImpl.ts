import * as THREE from "three";

import {PageMovementButtonClickDetectRepository} from "./PageMovementButtonClickDetectRepository";
import {CardPageMovementButton} from "../../make_deck_card_page_movement_button/entity/CardPageMovementButton";

export class PageMovementButtonClickDetectRepositoryImpl implements PageMovementButtonClickDetectRepository {
    private static instance: PageMovementButtonClickDetectRepositoryImpl;
    private currentClickedButtonId: number | null = null;
    private raycaster = new THREE.Raycaster();

    public static getInstance(): PageMovementButtonClickDetectRepositoryImpl {
        if (!PageMovementButtonClickDetectRepositoryImpl.instance) {
            PageMovementButtonClickDetectRepositoryImpl.instance = new PageMovementButtonClickDetectRepositoryImpl();
        }
        return PageMovementButtonClickDetectRepositoryImpl.instance;
    }

    isPageMovementButtonClicked(clickPoint: { x: number; y: number },
                          pageMovementButtonList: CardPageMovementButton[],
                          camera: THREE.Camera): any | null {
        const { x, y } = clickPoint;

        const normalizedMouse = new THREE.Vector2(
            (x / window.innerWidth) * 2 - 1,
            -(y / window.innerHeight) * 2 + 1
        );

        this.raycaster.setFromCamera(normalizedMouse, camera);

        const meshes = pageMovementButtonList.map(pageMovementButton => pageMovementButton.getMesh());
        const intersects = this.raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
            const intersectedMesh = intersects[0].object;
            const clickedPageMovementButton = pageMovementButtonList.find(
                pageMovementButton => pageMovementButton.getMesh() === intersectedMesh
            );

            if (clickedPageMovementButton) {
                console.log('Detect clicked Page Movement Button!')
                return clickedPageMovementButton;
            }
        }

        return null;
    }

    saveCurrentClickedPageMovementButtonId(id: number): void {
        this.currentClickedButtonId = id;
    }

    findCurrentClickedPageMovementButtonId(): number | null {
        console.log(`Current Click Page Movement Button: ${this.currentClickedButtonId}`);
        return this.currentClickedButtonId;
    }

}