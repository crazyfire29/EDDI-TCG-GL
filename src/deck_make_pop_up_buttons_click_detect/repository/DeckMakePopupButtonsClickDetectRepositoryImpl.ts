import * as THREE from "three";

import {DeckMakePopupButtonsClickDetectRepository} from "./DeckMakePopupButtonsClickDetectRepository";
import {DeckMakePopupButtons} from "../../deck_make_pop_up_buttons/entity/DeckMakePopupButtons";

export class DeckMakePopupButtonsClickDetectRepositoryImpl implements DeckMakePopupButtonsClickDetectRepository {
    private static instance: DeckMakePopupButtonsClickDetectRepositoryImpl;
    private currentButtonClickState: DeckMakePopupButtons | null = null;
    private raycaster = new THREE.Raycaster();

    public static getInstance(): DeckMakePopupButtonsClickDetectRepositoryImpl {
        if (!DeckMakePopupButtonsClickDetectRepositoryImpl.instance) {
            DeckMakePopupButtonsClickDetectRepositoryImpl.instance = new DeckMakePopupButtonsClickDetectRepositoryImpl();
        }
        return DeckMakePopupButtonsClickDetectRepositoryImpl.instance;
    }

    isDeckMakePopupButtonsClicked(clickPoint: { x: number; y: number },
                          deckMakePopupButtonsList: DeckMakePopupButtons[],
                          camera: THREE.Camera): any | null {
        const { x, y } = clickPoint;

        const normalizedMouse = new THREE.Vector2(
            (x / window.innerWidth) * 2 - 1,
            -(y / window.innerHeight) * 2 + 1
        );

        this.raycaster.setFromCamera(normalizedMouse, camera);

        const meshes = deckMakePopupButtonsList.map(deckMakePopupButton => deckMakePopupButton.getMesh());
        const intersects = this.raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
            const intersectedMesh = intersects[0].object;
            const clickedDeckMakePopupButton = deckMakePopupButtonsList.find(
                deckMakePopupButton => deckMakePopupButton.getMesh() === intersectedMesh
            );

            if (clickedDeckMakePopupButton) {
                console.log('Detect clicked DeckMakePopupButton!')
                return clickedDeckMakePopupButton;
            }
        }

        return null;
    }

    saveCurrentButtonClickState(button: DeckMakePopupButtons): void {
        this.currentButtonClickState = button;
    }

    getCurrentButtonClickState(): DeckMakePopupButtons | null {
        return this.currentButtonClickState;
    }

    resetCurrentButtonClickState(): void {
        this.currentButtonClickState = null;
    }

}