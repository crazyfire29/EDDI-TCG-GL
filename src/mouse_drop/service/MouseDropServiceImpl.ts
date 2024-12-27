// MouseDropServiceImpl.ts
import * as THREE from 'three';
import { MouseDropService } from './MouseDropService';
import {MouseDropFieldRepositoryImpl} from "../repository/MouseDropRepositoryImpl";
import {MouseDropFieldRepository} from "../repository/MouseDropRepository";
import {DragMoveRepository} from "../../drag_move/repository/DragMoveRepository";
import {DragMoveRepositoryImpl} from "../../drag_move/repository/DragMoveRepositoryImpl";
import {BattleFieldCardScene} from "../../battle_field_card_scene/entity/BattleFieldCardScene";
import {BattleFieldHandRepository} from "../../battle_field_hand/repository/BattleFieldHandRepository";
import {BattleFieldHandRepositoryImpl} from "../../battle_field_hand/repository/BattleFieldHandRepositoryImpl";
import {BattleFieldCardAttributeMarkRepository} from "../../battle_field_card_attribute_mark/repository/BattleFieldCardAttributeMarkRepository";
import {BattleFieldCardAttributeMarkRepositoryImpl} from "../../battle_field_card_attribute_mark/repository/BattleFieldCardAttributeMarkRepositoryImpl";
import {BattleFieldCardAttributeMark} from "../../battle_field_card_attribute_mark/entity/BattleFieldCardAttributeMark";
import {BattleFieldCardAttributeMarkPositionRepository} from "../../battle_field_card_attribute_mark_position/repository/BattleFieldCardAttributeMarkPositionRepository";
import {BattleFieldCardAttributeMarkPositionRepositoryImpl} from "../../battle_field_card_attribute_mark_position/repository/BattleFieldCardAttributeMarkPositionRepositoryImpl";
import {BattleFieldHandCardPositionRepositoryImpl} from "../../battle_field_card_position/repository/BattleFieldHandCardPositionRepositoryImpl";
import {BattleFieldHandCardPositionRepository} from "../../battle_field_card_position/repository/BattleFieldHandCardPositionRepository";
import {BattleFieldCardPosition} from "../../battle_field_card_position/entity/BattleFieldCardPosition";
import {BattleFieldCardAttributeMarkScene} from "../../battle_field_card_attribute_mark_scene/entity/BattleFieldCardAttributeMarkScene";
import {BattleFieldCardAttributeMarkSceneRepositoryImpl} from "../../battle_field_card_attribute_mark_scene/repository/BattleFieldCardAttributeMarkSceneRepositoryImpl";
import {BattleFieldCardAttributeMarkSceneRepository} from "../../battle_field_card_attribute_mark_scene/repository/BattleFieldCardAttributeMarkSceneRepository";

export class MouseDropServiceImpl implements MouseDropService {
    private static instance: MouseDropServiceImpl | null = null;

    private raycaster: THREE.Raycaster;
    private mouseDropFieldRepository: MouseDropFieldRepository;
    private dragMoveRepository: DragMoveRepository;

    private battleFieldHandRepository: BattleFieldHandRepository
    private battleFieldHandCardPositionRepository: BattleFieldHandCardPositionRepository

    private battleFieldCardAttributeMarkRepository: BattleFieldCardAttributeMarkRepository
    private battleFieldCardAttributeMarkPositionRepository: BattleFieldCardAttributeMarkPositionRepository
    private battleFieldCardAttributeMarkSceneRepository: BattleFieldCardAttributeMarkSceneRepository

    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.mouseDropFieldRepository = MouseDropFieldRepositoryImpl.getInstance();
        this.dragMoveRepository = DragMoveRepositoryImpl.getInstance()
        this.battleFieldHandRepository = BattleFieldHandRepositoryImpl.getInstance()
        this.battleFieldHandCardPositionRepository = BattleFieldHandCardPositionRepositoryImpl.getInstance()
        this.battleFieldCardAttributeMarkRepository = BattleFieldCardAttributeMarkRepositoryImpl.getInstance()
        this.battleFieldCardAttributeMarkPositionRepository = BattleFieldCardAttributeMarkPositionRepositoryImpl.getInstance()
        this.battleFieldCardAttributeMarkSceneRepository = BattleFieldCardAttributeMarkSceneRepositoryImpl.getInstance()
    }

    public static getInstance(): MouseDropServiceImpl {
        if (!MouseDropServiceImpl.instance) {
            MouseDropServiceImpl.instance = new MouseDropServiceImpl();
        }
        return MouseDropServiceImpl.instance;
    }

    public onMouseUp(): void {
        const selectedObject = this.dragMoveRepository.getSelectedObject();
        if (!selectedObject) {
            console.log("No object selected.");
            return;
        }

        const isDroppedInField = this.mouseDropFieldRepository.isYourFieldAreaDropped(selectedObject, this.raycaster);
        if (isDroppedInField) {
            console.log("Dropped inside YourFieldArea.");
            if (selectedObject instanceof BattleFieldCardScene) {
                this.handleValidDrop(selectedObject);
            }
        } else {
            console.log("Dropped outside YourFieldArea.");
            this.restoreOriginalPosition(selectedObject);
        }

        this.dragMoveRepository.deleteSelectedObject();
        this.dragMoveRepository.deleteSelectedGroup();
    }

    private handleValidDrop(selectedObject: BattleFieldCardScene): void {
        const cardScene = selectedObject as BattleFieldCardScene; // 안전하게 타입 캐스팅
        const cardSceneMesh = cardScene.getMesh();

        cardSceneMesh.userData.state = 'YourField';
        console.log("Updated object state to 'YourField'.");
    }

    private async restoreOriginalPosition(selectedObject: THREE.Object3D): Promise<void> {
        if (selectedObject instanceof BattleFieldCardScene) {
            const cardSceneId = selectedObject.getId();
            const cardPositionId = this.battleFieldHandRepository.findPositionIdByCardSceneId(cardSceneId)
            // TODO: 여기서 main Card 원위치, attribute Mark 원위치
            if (cardPositionId !== null) {
                const cardPositionEntity = this.battleFieldHandCardPositionRepository.findById(cardPositionId);
                console.log(`restoreOriginalPosition() -> cardPosition: ${JSON.stringify(cardPositionEntity)}`);

                if (cardPositionEntity instanceof BattleFieldCardPosition) { // 타입 검사
                    const x = cardPositionEntity.getX();
                    const y = cardPositionEntity.getY();
                    console.log(`Card Position -> X: ${x}, Y: ${y}`);

                    const mainCardSceneMesh = selectedObject.getMesh()

                    if (mainCardSceneMesh) {
                        // 원위치로 복원
                        mainCardSceneMesh.position.set(x, y, mainCardSceneMesh.position.z);
                        console.log(`Main card mesh restored to position X: ${x}, Y: ${y}`);
                    }
                }
            }

            const attributeMarkIdList = this.battleFieldHandRepository.findAttributeMarkIdListByCardSceneId(cardSceneId);
            console.log(`restoreOriginalPosition() -> attributeMarkIdList: ${attributeMarkIdList}`);

            if (attributeMarkIdList && attributeMarkIdList.length > 0) {
                const attributeMarkList = await Promise.all(
                    attributeMarkIdList.map(id =>
                        this.battleFieldCardAttributeMarkRepository.findById(id)
                    )
                );
                console.log("restoreOriginalPosition() Attribute marks found:", attributeMarkList.map(mark => JSON.stringify(mark)));

                const attributeMarkPositionPromises = attributeMarkList
                    .filter((attributeMark): attributeMark is BattleFieldCardAttributeMark => attributeMark !== null)
                    .map(attributeMark =>
                        this.battleFieldCardAttributeMarkPositionRepository.findById(attributeMark.attributeMarkPositionId)
                    );

                const validAttributePositions = await Promise.all(attributeMarkPositionPromises);
                console.log("restoreOriginalPosition() Attribute marks position:", validAttributePositions.map(position => JSON.stringify(position)));

                const attributeMarkScenePromises = attributeMarkList
                    .filter((attributeMark): attributeMark is BattleFieldCardAttributeMark => attributeMark !== null)
                    .map(attributeMark =>
                        this.battleFieldCardAttributeMarkSceneRepository.findById(attributeMark.attributeMarkSceneId)
                    );

                const validAttributeScenes = await Promise.all(attributeMarkScenePromises);
                console.log("restoreOriginalPosition() Attribute marks position:", validAttributeScenes);

                const validAttributeSceneList = validAttributeScenes.filter(
                    (scene): scene is BattleFieldCardAttributeMarkScene => scene !== null
                );

                validAttributeSceneList.forEach((attributeScene, index) => {
                    const attributePosition = validAttributePositions[index]; // 매칭된 Position
                    if (attributePosition) {
                        const x = attributePosition.position.getX(); // X 값 추출
                        const y = attributePosition.position.getY(); // Y 값 추출
                        const mesh = attributeScene.getMesh()

                        if (mesh) {
                            mesh.position.set(x, y, mesh.position.z); // 위치 복원
                            console.log(`Attribute mark scene restored to position X: ${x}, Y: ${y}`);
                        } else {
                            console.log(`Mesh not found for attribute scene ID: ${attributeScene.getId()}`);
                        }
                    }
                });
            }
        } else {
            console.log("Selected object is not a BattleFieldCardScene.");
        }
    }
}
