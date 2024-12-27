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
import {YourFieldRepositoryImpl} from "../../your_field/repository/YourFieldRepositoryImpl";
import {YourFieldRepository} from "../../your_field/repository/YourFieldRepository";
import {getCardById} from "../../card/utility";
import {CardKind} from "../../card/kind";
import {BattleFieldCardSceneRepository} from "../../battle_field_card_scene/repository/BattleFieldCardSceneRepository";
import {BattleFieldCardSceneRepositoryImpl} from "../../battle_field_card_scene/repository/BattleFieldCardSceneRepositoryImpl";
import {YourFieldCardSceneRepository} from "../../your_field_card_scene/repository/YourFieldCardSceneRepository";
import {YourFieldCardSceneRepositoryImpl} from "../../your_field_card_scene/repository/YourFieldCardSceneRepositoryImpl";

export class MouseDropServiceImpl implements MouseDropService {
    private static instance: MouseDropServiceImpl | null = null;

    private raycaster: THREE.Raycaster;
    private mouseDropFieldRepository: MouseDropFieldRepository;
    private dragMoveRepository: DragMoveRepository;

    private battleFieldHandRepository: BattleFieldHandRepository
    private battleFieldHandCardPositionRepository: BattleFieldHandCardPositionRepository
    private battleFieldCardSceneRepository: BattleFieldCardSceneRepository

    private battleFieldCardAttributeMarkRepository: BattleFieldCardAttributeMarkRepository
    private battleFieldCardAttributeMarkPositionRepository: BattleFieldCardAttributeMarkPositionRepository
    private battleFieldCardAttributeMarkSceneRepository: BattleFieldCardAttributeMarkSceneRepository

    private yourFieldRepository: YourFieldRepository
    private yourFieldCardSceneRepository: YourFieldCardSceneRepository

    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.mouseDropFieldRepository = MouseDropFieldRepositoryImpl.getInstance();
        this.dragMoveRepository = DragMoveRepositoryImpl.getInstance()

        this.battleFieldHandRepository = BattleFieldHandRepositoryImpl.getInstance()
        this.battleFieldHandCardPositionRepository = BattleFieldHandCardPositionRepositoryImpl.getInstance()
        this.battleFieldCardSceneRepository = BattleFieldCardSceneRepositoryImpl.getInstance()

        this.battleFieldCardAttributeMarkRepository = BattleFieldCardAttributeMarkRepositoryImpl.getInstance()
        this.battleFieldCardAttributeMarkPositionRepository = BattleFieldCardAttributeMarkPositionRepositoryImpl.getInstance()
        this.battleFieldCardAttributeMarkSceneRepository = BattleFieldCardAttributeMarkSceneRepositoryImpl.getInstance()

        this.yourFieldRepository = YourFieldRepositoryImpl.getInstance()
        this.yourFieldCardSceneRepository = YourFieldCardSceneRepositoryImpl.getInstance()
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

        if (this.mouseDropFieldRepository.isYourFieldAreaDropped(selectedObject, this.raycaster)) {
            console.log("Dropped inside YourFieldArea.");
            if (selectedObject instanceof BattleFieldCardScene) {
                this.handleValidDrop(selectedObject);
            }
        } else {
            console.log("Dropped outside YourFieldArea.");
            this.restoreOriginalPosition(selectedObject);
        }

        this.clearSelection();
    }

    private handleValidDrop(selectedObject: BattleFieldCardScene): void {
        const cardSceneMesh = selectedObject.getMesh();
        const cardSceneId = selectedObject.getId()

        const handCard = this.battleFieldHandRepository.findByCardSceneId(cardSceneId);

        const cardId = handCard?.getCardId() ?? 0; // 기본값 0
        const card = getCardById(cardId)

        if (!card) {
            console.error(`Card not found for cardId: ${cardId}`);
            throw new Error(`Card not found for cardId: ${cardId}`);
        }

        const cardKind = parseInt(card.종류, 10) as CardKind;

        if (cardKind !== CardKind.UNIT) {
            this.restoreOriginalPosition(selectedObject as unknown as THREE.Object3D);
            return
        }

        // UNIT 카드에 대한 처리 로직
        console.log("Handling UNIT card:", card);

        const positionId = handCard?.getPositionId() ?? 0; // 기본값 0
        const attributeMarkIdList = handCard?.getAttributeMarkIdList() ?? [];

        this.yourFieldRepository.save(cardSceneId, positionId, attributeMarkIdList, cardId);
        console.log("handleValidDrop() yourFieldRepository saved");

        const handCardIndex = this.battleFieldHandRepository.findCardIndexByCardSceneId(cardSceneId)

        if (handCardIndex === null) {
            console.error(`sceneId ${cardSceneId} 존재하지 않음`);
            return
        }

        console.log(`handCardIndex: ${handCardIndex}`)
        const willBePlaceYourFieldCardScene = this.battleFieldCardSceneRepository.extractByIndex(handCardIndex)
        const willBePlaceYourFieldCardSceneMesh = willBePlaceYourFieldCardScene?.getMesh()
        if (willBePlaceYourFieldCardSceneMesh) {
            this.yourFieldCardSceneRepository.create(willBePlaceYourFieldCardSceneMesh);
        }
    }

    private async restoreOriginalPosition(selectedObject: THREE.Object3D): Promise<void> {
        if (selectedObject instanceof BattleFieldCardScene) {
            const cardSceneId = selectedObject.getId();
            const cardPositionId = this.battleFieldHandRepository.findPositionIdByCardSceneId(cardSceneId);
            if (cardPositionId !== null) {
                const cardPositionEntity = await this.battleFieldHandCardPositionRepository.findById(cardPositionId);
                if (cardPositionEntity) {
                    this.restoreCardPosition(selectedObject, cardPositionEntity);
                }
            }

            await this.restoreAttributeMarksPosition(cardSceneId);
        } else {
            console.log("Selected object is not a BattleFieldCardScene.");
        }
    }

    private restoreCardPosition(selectedObject: BattleFieldCardScene, cardPositionEntity: BattleFieldCardPosition): void {
        const x = cardPositionEntity.getX();
        const y = cardPositionEntity.getY();
        const mainCardSceneMesh = selectedObject.getMesh();
        if (mainCardSceneMesh) {
            mainCardSceneMesh.position.set(x, y, mainCardSceneMesh.position.z);
            console.log(`Main card mesh restored to position X: ${x}, Y: ${y}`);
        }
    }

    private async restoreAttributeMarksPosition(cardSceneId: number): Promise<void> {
        const attributeMarkIdList = this.battleFieldHandRepository.findAttributeMarkIdListByCardSceneId(cardSceneId);
        if (attributeMarkIdList?.length) {
            const attributeMarkList = await this.getAttributeMarks(attributeMarkIdList);
            const validAttributePositions = await this.getValidAttributePositions(attributeMarkList);
            const validAttributeScenes = await this.getValidAttributeScenes(attributeMarkList);
            this.restoreAttributeMarkScenes(validAttributePositions, validAttributeScenes);
        }
    }

    private async getAttributeMarks(attributeMarkIdList: number[]): Promise<BattleFieldCardAttributeMark[]> {
        const marks = await Promise.all(attributeMarkIdList.map(id => this.battleFieldCardAttributeMarkRepository.findById(id)));
        return marks.filter((mark): mark is BattleFieldCardAttributeMark => mark !== null); // Type guard to filter null values
    }

    private async getValidAttributePositions(attributeMarkList: BattleFieldCardAttributeMark[]): Promise<any[]> {
        return Promise.all(attributeMarkList.map(attributeMark =>
            this.battleFieldCardAttributeMarkPositionRepository.findById(attributeMark.attributeMarkPositionId)
        ));
    }

    private async getValidAttributeScenes(attributeMarkList: BattleFieldCardAttributeMark[]): Promise<any[]> {
        return Promise.all(attributeMarkList.map(attributeMark =>
            this.battleFieldCardAttributeMarkSceneRepository.findById(attributeMark.attributeMarkSceneId)
        ));
    }

    private restoreAttributeMarkScenes(validAttributePositions: any[], validAttributeScenes: any[]): void {
        validAttributeScenes.forEach((attributeScene, index) => {
            const attributePosition = validAttributePositions[index];
            if (attributePosition) {
                const x = attributePosition.position.getX();
                const y = attributePosition.position.getY();
                const mesh = attributeScene.getMesh();

                if (mesh) {
                    mesh.position.set(x, y, mesh.position.z);
                    console.log(`Attribute mark scene restored to position X: ${x}, Y: ${y}`);
                }
            }
        });
    }

    private clearSelection(): void {
        this.dragMoveRepository.deleteSelectedObject();
        this.dragMoveRepository.deleteSelectedGroup();
    }
}
