import * as THREE from "three";

import {MyCardRaceButtonClickDetectRepository} from "./MyCardRaceButtonClickDetectRepository";
import {MyCardRaceButton} from "../../my_card_race_button/entity/MyCardRaceButton";

export class MyCardRaceButtonClickDetectRepositoryImpl implements MyCardRaceButtonClickDetectRepository {
    private static instance: MyCardRaceButtonClickDetectRepositoryImpl;
    private currentClickedButtonId: number | null = null;
    private raycaster = new THREE.Raycaster();

    public static getInstance(): MyCardRaceButtonClickDetectRepositoryImpl {
        if (!MyCardRaceButtonClickDetectRepositoryImpl.instance) {
            MyCardRaceButtonClickDetectRepositoryImpl.instance = new MyCardRaceButtonClickDetectRepositoryImpl();
        }
        return MyCardRaceButtonClickDetectRepositoryImpl.instance;
    }

    isRaceButtonClicked(clickPoint: { x: number; y: number },
                        raceButtonList: MyCardRaceButton[],
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
        return this.currentClickedButtonId;
    }

}