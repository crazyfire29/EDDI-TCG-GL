import {RaceButton} from "../../race_buttons/entity/RaceButton";

import * as THREE from "three";

export interface RaceButtonClickDetectRepository {
    isDeckRaceButtonClicked(clickPoint: { x: number; y: number },
                          raceButtonList: RaceButton[],
                          camera: THREE.Camera): any | null;
}