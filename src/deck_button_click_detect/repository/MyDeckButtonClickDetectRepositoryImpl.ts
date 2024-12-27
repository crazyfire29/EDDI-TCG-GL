import * as THREE from "three";

import {MyDeckButtonClickDetectRepository} from "./MyDeckButtonClickDetectRepository";
import {MyDeckButtonScene} from "../../my_deck_button_scene/entity/MyDeckButtonScene";

export class MyDeckButtonClickDetectRepositoryImpl implements MyDeckButtonClickDetectRepository {
    private static instance: MyDeckButtonClickDetectRepositoryImpl;
    private currentClickDeckButtonId: number | null = null;
    private raycaster = new THREE.Raycaster();

    public static getInstance(): MyDeckButtonClickDetectRepositoryImpl {
        if (!MyDeckButtonClickDetectRepositoryImpl.instance) {
            MyDeckButtonClickDetectRepositoryImpl.instance = new MyDeckButtonClickDetectRepositoryImpl();
        }
        return MyDeckButtonClickDetectRepositoryImpl.instance;
    }

    isMyDeckButtonClicked(clickPoint: { x: number; y: number },
                          deckSceneList: MyDeckButtonScene[],
                          camera: THREE.Camera): any | null {
        const { x, y } = clickPoint;

        const normalizedMouse = new THREE.Vector2(
            (x / window.innerWidth) * 2 - 1,
            -(y / window.innerHeight) * 2 + 1
        );

        this.raycaster.setFromCamera(normalizedMouse, camera);

        const meshes = deckSceneList.map(deckScene => deckScene.getMesh());
        const intersects = this.raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
            const intersectedMesh = intersects[0].object;
            const clickedDeckScene = deckSceneList.find(
                deckScene => deckScene.getMesh() === intersectedMesh
            );

            if (clickedDeckScene) {
                console.log('detect clicked deck Button!')
                return clickedDeckScene;
            }
        }

        return null;
    }

    saveCurrentClickDeckButtonId(id: number): void {
        this.currentClickDeckButtonId = id;
    }

    getCurrentClickDeckButtonId(): number | null {
        return this.currentClickDeckButtonId;
    }

}