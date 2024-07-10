import * as THREE from 'three'
import {BattleFieldUnitRepository} from "../repository/BattleFieldUnitRepository";
import {ResourceManager} from "../../resouce_manager/ResourceManager";

export class BattleFieldUnitRenderer {
    private scene: THREE.Scene
    // TODO: Service로 수정해야함
    private battleFieldUnitRepository: BattleFieldUnitRepository
    private resourceManager: ResourceManager

    constructor(scene: THREE.Scene, resourceManager: ResourceManager) {
        this.scene = scene
        this.battleFieldUnitRepository = BattleFieldUnitRepository.getInstance()
        this.resourceManager = resourceManager
    }

    public renderBattleFieldUnit(): void {
        const battleFieldUnitList = this.battleFieldUnitRepository.getBattleFieldUnitList()

        battleFieldUnitList.forEach(battleFieldUnit => {
            const cardPath = this.resourceManager.getCardPath(battleFieldUnit.getCardId())
        })
    }
}