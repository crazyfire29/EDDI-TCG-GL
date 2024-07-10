import * as THREE from 'three';
import {BattleFieldUnit} from "../entity/BattleFieldUnit";

export class BattleFieldUnitScene {
    private scene: THREE.Scene
    private unitList: BattleFieldUnit[] = []

    constructor() {
        this.scene = new THREE.Scene()
    }
}