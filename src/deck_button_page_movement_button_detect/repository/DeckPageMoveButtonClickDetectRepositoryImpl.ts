import * as THREE from "three";

import {DeckPageMovementButtonClickDetectRepository} from "./DeckPageMoveButtonClickDetectRepository";
import {MyDeckButtonPageMovementButton} from "../../my_deck_button_page_movement_button/entity/MyDeckButtonPageMovementButton";

export class DeckPageMovementButtonClickDetectRepositoryImpl implements DeckPageMovementButtonClickDetectRepository {
    private static instance: DeckPageMovementButtonClickDetectRepositoryImpl;
    private currentClickDeckPageMoveButtonId: number | null = null;
    private raycaster = new THREE.Raycaster();

    public static getInstance(): DeckPageMovementButtonClickDetectRepositoryImpl {
        if (!DeckPageMovementButtonClickDetectRepositoryImpl.instance) {
            DeckPageMovementButtonClickDetectRepositoryImpl.instance = new DeckPageMovementButtonClickDetectRepositoryImpl();
        }
        return DeckPageMovementButtonClickDetectRepositoryImpl.instance;
    }

    isDeckMoveButtonClicked(clickPoint: { x: number; y: number },
                          deckMoveButtonList: MyDeckButtonPageMovementButton[],
                          camera: THREE.Camera): any | null {
        const { x, y } = clickPoint;

        const normalizedMouse = new THREE.Vector2(
            (x / window.innerWidth) * 2 - 1,
            -(y / window.innerHeight) * 2 + 1
        );

        this.raycaster.setFromCamera(normalizedMouse, camera);

        const meshes = deckMoveButtonList.map(deckMoveButton => deckMoveButton.getMesh());
        const intersects = this.raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
            const intersectedMesh = intersects[0].object;
            const clickedDeckMoveButton = deckMoveButtonList.find(
                deckMoveButton => deckMoveButton.getMesh() === intersectedMesh
            );

            if (clickedDeckMoveButton) {
                console.log('detect clicked Deck Page Movement Button!')
                return clickedDeckMoveButton;
            }
        }

        return null;
    }

    saveCurrentClickedDeckPageMoveButtonId(id: number): void {
        this.currentClickDeckPageMoveButtonId = id;
    }

    getCurrentClickedDeckPageMoveButtonId(): number | null {
        return this.currentClickDeckPageMoveButtonId;
    }

}