import * as THREE from "three";

import {LeftClickHandDetectRepository} from "./LeftClickHandDetectRepository";
import {BattleFieldCardScene} from "../../battle_field_card_scene/entity/BattleFieldCardScene";

export class LeftClickHandDetectRepositoryImpl implements LeftClickHandDetectRepository {
    private static instance: LeftClickHandDetectRepositoryImpl;
    private raycaster = new THREE.Raycaster();

    public static getInstance(): LeftClickHandDetectRepositoryImpl {
        if (!LeftClickHandDetectRepositoryImpl.instance) {
            LeftClickHandDetectRepositoryImpl.instance = new LeftClickHandDetectRepositoryImpl();
        }
        return LeftClickHandDetectRepositoryImpl.instance;
    }

    isYourHandAreaClicked(clickPoint: { x: number; y: number },
                          cardSceneList: BattleFieldCardScene[],
                          camera: THREE.Camera): any | null {
        const { x, y } = clickPoint;

        // 1. Normalize mouse coordinates
        const normalizedMouse = new THREE.Vector2(
            (x / window.innerWidth) * 2 - 1,
            -(y / window.innerHeight) * 2 + 1
        );

        // 2. Set raycaster from camera and normalized mouse coordinates
        this.raycaster.setFromCamera(normalizedMouse, camera);

        // 3. Get meshes from cardSceneList
        const meshes = cardSceneList.map(cardScene => cardScene.getMesh());

        // 4. Check for intersections
        const intersects = this.raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
            const intersectedMesh = intersects[0].object;

            // 5. Find the corresponding card scene
            const clickedCardScene = cardSceneList.find(
                cardScene => cardScene.getMesh() === intersectedMesh
            );

            if (clickedCardScene) {
                console.log('detect clicked card!')
                return clickedCardScene;
            }
        }

        return null;
    }
}