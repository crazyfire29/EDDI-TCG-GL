import * as THREE from "three";

import {DeckCardPageMoveButtonClickDetectRepository} from "./DeckCardPageMoveButtonClickDetectRepository";
import {MyDeckCardPageMovementButton} from "../../my_deck_card_page_movement_button/entity/MyDeckCardPageMovementButton";

export class DeckCardPageMoveButtonClickDetectRepositoryImpl implements DeckCardPageMoveButtonClickDetectRepository {
    private static instance: DeckCardPageMoveButtonClickDetectRepositoryImpl;
    private currentClickDeckCardPageMoveButtonId: number | null = null;
    private raycaster = new THREE.Raycaster();

    public static getInstance(): DeckCardPageMoveButtonClickDetectRepositoryImpl {
        if (!DeckCardPageMoveButtonClickDetectRepositoryImpl.instance) {
            DeckCardPageMoveButtonClickDetectRepositoryImpl.instance = new DeckCardPageMoveButtonClickDetectRepositoryImpl();
        }
        return DeckCardPageMoveButtonClickDetectRepositoryImpl.instance;
    }

    public isDeckCardPageMoveButtonClicked(clickPoint: { x: number; y: number },
        cardPageMoveButtonList: MyDeckCardPageMovementButton[],
        camera: THREE.Camera): any | null {
            const { x, y } = clickPoint;

            const normalizedMouse = new THREE.Vector2(
                (x / window.innerWidth) * 2 - 1,
                -(y / window.innerHeight) * 2 + 1
            );

            this.raycaster.setFromCamera(normalizedMouse, camera);

            const meshes = cardPageMoveButtonList.map(cardPageMoveButton => cardPageMoveButton.getMesh());
            const intersects = this.raycaster.intersectObjects(meshes);

            if (intersects.length > 0) {
                const intersectedMesh = intersects[0].object;
                const clickedCardPageMoveButton = cardPageMoveButtonList.find(
                    cardPageMoveButton => cardPageMoveButton.getMesh() === intersectedMesh
                );

                if (clickedCardPageMoveButton) {
                    console.log('detect clicked Card Page Movement Button!')
                    return clickedCardPageMoveButton;
                }
            }

            return null;
        }

    saveCurrentClickedDeckCardPageMoveButtonId(id: number): void {
        this.currentClickDeckCardPageMoveButtonId = id;
    }

    getCurrentClickedDeckCardPageMoveButtonId(): number | null {
        return this.currentClickDeckCardPageMoveButtonId;
    }

}