import * as THREE from 'three'
import {BattleFieldUnitRepository} from "../repository/BattleFieldUnitRepository";
import {ResourceManager} from "../../resouce_manager/ResourceManager";
import {BattleFieldUnitScene} from "../scene/BattleFieldUnitScene";
import {BattleFieldUnit} from "../entity/BattleFieldUnit";

export class BattleFieldUnitRenderer {
    private unitScene: BattleFieldUnitScene
    // TODO: Service로 수정해야함
    private battleFieldUnitRepository: BattleFieldUnitRepository
    private resourceManager: ResourceManager

    constructor(unitScene: BattleFieldUnitScene, resourceManager: ResourceManager) {
        this.unitScene = unitScene
        this.battleFieldUnitRepository = BattleFieldUnitRepository.getInstance()
        this.resourceManager = resourceManager

        this.battleFieldUnitRepository.setUnitAddedCallback((unit: BattleFieldUnit) => {
            this.unitScene.addUnit(unit, this.resourceManager);
        });
    }

    // public renderBattleFieldUnit(): void {
    //     const battleFieldUnitList = this.battleFieldUnitRepository.getBattleFieldUnitList()
    //
    //     battleFieldUnitList.forEach(battleFieldUnit => {
    //         this.unitScene.addUnit(battleFieldUnit, this.resourceManager);
    //     });
    // }

    public render(renderer: THREE.WebGLRenderer, camera: THREE.OrthographicCamera): void {
        // this.renderBattleFieldUnit();
        renderer.render(this.unitScene.getScene(), camera);
    }

    public animate(renderer: THREE.WebGLRenderer, camera: THREE.OrthographicCamera): void {
        requestAnimationFrame(() => this.animate(renderer, camera));
        this.render(renderer, camera);
    }

    public scaleUnitList(scaleX: number, scaleY: number): void {
        const unitList = this.unitScene.getUnitList();
        console.log('battle field unit renderer -> unitList:', unitList)
        for (const unitId in unitList) {
            const { card, weapon, hp, energy, race } = unitList[unitId];
            if (card) card.setScale(scaleX, scaleY);
            if (weapon) weapon.setScale(scaleX, scaleY);
            if (hp) hp.setScale(scaleX, scaleY);
            if (energy) energy.setScale(scaleX, scaleY);
            if (race) race.setScale(scaleX, scaleY);
        }
    }
}