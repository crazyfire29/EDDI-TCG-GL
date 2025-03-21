import {MyCardRaceButton} from "../../my_card_race_button/entity/MyCardRaceButton";

import * as THREE from "three";

export interface MyCardRaceButtonClickDetectRepository {
    isRaceButtonClicked(clickPoint: { x: number; y: number },
                            raceButtonList: MyCardRaceButton[],
                            camera: THREE.Camera): any | null;
    }