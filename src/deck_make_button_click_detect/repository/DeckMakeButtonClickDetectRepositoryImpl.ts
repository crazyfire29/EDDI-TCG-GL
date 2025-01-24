import * as THREE from "three";

import {DeckMakeButtonClickDetectRepository} from "./DeckMakeButtonClickDetectRepository";
import {DeckMakeButton} from "../../deck_make_button/entity/DeckMakeButton";

export class DeckMakeButtonClickDetectRepositoryImpl implements DeckMakeButtonClickDetectRepository {
    private static instance: DeckMakeButtonClickDetectRepositoryImpl;
    private currentButtonClickState: DeckMakeButton | null = null;
    private raycaster = new THREE.Raycaster();

    public static getInstance(): DeckMakeButtonClickDetectRepositoryImpl {
        if (!DeckMakeButtonClickDetectRepositoryImpl.instance) {
            DeckMakeButtonClickDetectRepositoryImpl.instance = new DeckMakeButtonClickDetectRepositoryImpl();
        }
        return DeckMakeButtonClickDetectRepositoryImpl.instance;
    }

    isDeckMakeButtonClicked(clickPoint: { x: number; y: number },
                          deckMakeButton: DeckMakeButton,
                          camera: THREE.Camera): any | null {
        const { x, y } = clickPoint;

        const normalizedMouse = new THREE.Vector2(
            (x / window.innerWidth) * 2 - 1,
            -(y / window.innerHeight) * 2 + 1
        );

        this.raycaster.setFromCamera(normalizedMouse, camera);

        const mesh = deckMakeButton.getMesh();
        const intersect = this.raycaster.intersectObject(mesh);

        if (intersect.length > 0) {
            console.log('detect clicked DeckMakeButton!')
            return mesh;
        }

        return null;
    }

    saveCurrentButtonClickState(button: DeckMakeButton): void {
        this.currentButtonClickState = button;
    }

    getCurrentButtonClickState(): DeckMakeButton | null {
        return this.currentButtonClickState;
    }

    resetCurrentButtonClickState(): void {
        this.currentButtonClickState = null;
    }


}