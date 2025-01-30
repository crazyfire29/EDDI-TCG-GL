import * as THREE from "three";

import {RaceButtonClickDetectRepository} from "./RaceButtonClickDetectRepository";
import {RaceButton} from "../../race_button/entity/RaceButton";

export class RaceButtonClickDetectRepositoryImpl implements RaceButtonClickDetectRepository {
    private static instance: RaceButtonClickDetectRepositoryImpl;
    private currentClickedButtonId: number | null = null;
    private raycaster = new THREE.Raycaster();

    public static getInstance(): RaceButtonClickDetectRepositoryImpl {
        if (!RaceButtonClickDetectRepositoryImpl.instance) {
            RaceButtonClickDetectRepositoryImpl.instance = new RaceButtonClickDetectRepositoryImpl();
        }
        return RaceButtonClickDetectRepositoryImpl.instance;
    }

    isDeckRaceButtonClicked(clickPoint: { x: number; y: number },
                          raceButtonList: RaceButton[],
                          camera: THREE.Camera): any | null {
        const { x, y } = clickPoint;

        const normalizedMouse = new THREE.Vector2(
            (x / window.innerWidth) * 2 - 1,
            -(y / window.innerHeight) * 2 + 1
        );

        this.raycaster.setFromCamera(normalizedMouse, camera);

        const meshes = raceButtonList.map(raceButton => raceButton.getMesh());
        const intersects = this.raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
            const intersectedMesh = intersects[0].object;
            const clickedRaceButton = raceButtonList.find(
                raceButton => raceButton.getMesh() === intersectedMesh
            );

            if (clickedRaceButton) {
                console.log('Detect clicked Race Button!')
                return clickedRaceButton;
            }
        }

        return null;
    }

    saveCurrentClickedRaceButtonId(id: number): void {
        this.currentClickedButtonId = id;
    }

    findCurrentClickedRaceButtonId(): number | null {
        console.log(`Current Click Race Button: ${this.currentClickedButtonId}`);
        return this.currentClickedButtonId;
    }

}