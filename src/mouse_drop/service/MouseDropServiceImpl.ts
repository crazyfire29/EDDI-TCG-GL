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
import {YourFieldCardPositionRepository} from "../../your_field_card_position/repository/YourFieldCardPositionRepository";
import {YourFieldCardPositionRepositoryImpl} from "../../your_field_card_position/repository/YourFieldCardPositionRepositoryImpl";
import {Vector2d} from "../../common/math/Vector2d";
import {MarkSceneType} from "../../battle_field_card_attribute_mark_scene/entity/MarkSceneType";
import {AttributeMarkPositionCalculator} from "../../common/attribute_mark/AttributeMarkPositionCalculator";
import {YourFieldCardPosition} from "../../your_field_card_position/entity/YourFieldCardPosition";
import {YourField} from "../../your_field/entity/YourField";

export class MouseDropServiceImpl implements MouseDropService {
    private static instance: MouseDropServiceImpl | null = null;

    private readonly HALF: number = 0.5;
    private readonly GAP_OF_EACH_CARD: number = 0.094696
    private readonly HAND_X_CRITERIA: number = 0.311904
    // 0.862217 + 0.06493506493 * 1.615 = 0.1048701
    // 0.862217 + 0.1048701
    private readonly HAND_Y_CRITERIA: number = 0.972107
    private readonly HAND_INITIAL_X: number = this.HAND_X_CRITERIA - this.HALF;
    private readonly HAND_INITIAL_Y: number = this.HALF - this.HAND_Y_CRITERIA;

    private readonly YOUR_FIELD_X_CRITERIA: number = 0.186458
    // private readonly YOUR_FIELD_Y_CRITERIA: number = 0.972107
    // private readonly YOUR_FIELD_Y_CRITERIA: number = 0.328463
    private readonly YOUR_FIELD_Y_CRITERIA: number = 0.653391 + 0.1048701
    // private readonly YOUR_FIELD_Y_CRITERIA: number = 0.770721
    private readonly YOUR_FIELD_INITIAL_X: number = this.YOUR_FIELD_X_CRITERIA - this.HALF
    private readonly YOUR_FIELD_INITIAL_Y: number = this.HALF - this.YOUR_FIELD_Y_CRITERIA;

    private readonly CARD_WIDTH: number = 0.06493506493
    private readonly CARD_HEIGHT: number = this.CARD_WIDTH * 1.615

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
    private yourFieldCardPositionRepository: YourFieldCardPositionRepository

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
        this.yourFieldCardPositionRepository = YourFieldCardPositionRepositoryImpl.getInstance()
    }

    public static getInstance(): MouseDropServiceImpl {
        if (!MouseDropServiceImpl.instance) {
            MouseDropServiceImpl.instance = new MouseDropServiceImpl();
        }
        return MouseDropServiceImpl.instance;
    }

    public async onMouseUp(): Promise<void> {
        const selectedObject = this.dragMoveRepository.getSelectedObject();
        if (!selectedObject) {
            console.log("No object selected.");
            return;
        }

        if (this.mouseDropFieldRepository.isYourFieldAreaDropped(selectedObject, this.raycaster)) {
            console.log("Dropped inside YourFieldArea.");
            if (selectedObject instanceof BattleFieldCardScene) {
                const createdYourField = await this.handleValidDrop(selectedObject);

                if (createdYourField) {
                    this.alignHandCard();
                    this.alignYourField(createdYourField);
                } else {
                    console.log("Failed to create YourField.");
                }
            }
        } else {
            console.log("Dropped outside YourFieldArea.");
            this.restoreOriginalPosition(selectedObject);
        }

        this.clearSelection();
    }

    private alignYourField(createdYourField: YourField): void {
        console.log(`createdYourField: ${JSON.stringify(createdYourField, null, 2)}`)
        // x = 1920, y = 1848
        // (358, 607)
        const yourFieldCount = this.yourFieldRepository.count()
        console.log(`yourFieldCount: ${yourFieldCount}`)

        const calculatedYourFieldPosition = this.calculateYourFieldPositionByIndex(yourFieldCount - 1)
        const yourFieldPositionId = createdYourField.getPositionId()
        const cardPosition = this.battleFieldHandCardPositionRepository.findById(yourFieldPositionId)

        if (!cardPosition) {
            console.error(`yourFieldPosition: ${cardPosition}`);
            return;
        }

        const yourFieldSceneId = createdYourField.getCardSceneId()
        console.log(`alignYourField() yourFieldSceneId: ${yourFieldSceneId}`)
        const yourFieldScene = this.yourFieldCardSceneRepository.findById(yourFieldSceneId)

        if (!yourFieldScene) {
            console.error(`yourFieldScene: ${yourFieldScene}`);
            return;
        }

        const yourFieldSceneMesh = yourFieldScene.getMesh()
        if (yourFieldSceneMesh) {
            yourFieldSceneMesh.position.x = calculatedYourFieldPosition.getX();
            yourFieldSceneMesh.position.y = calculatedYourFieldPosition.getY();
        } else {
            console.error(`Mesh not found`);
        }
    }

    private calculateYourFieldPositionByIndex(index: number): Vector2d {
        const yourFieldPositionX = (this.YOUR_FIELD_INITIAL_X + index * this.GAP_OF_EACH_CARD) * window.innerWidth;
        const yourFieldPositionY = this.YOUR_FIELD_INITIAL_Y * window.innerHeight
            + (this.CARD_HEIGHT * this.HALF * window.innerWidth);
        return new Vector2d(yourFieldPositionX, yourFieldPositionY);
    }

    private async alignHandCard(): Promise<void> {
        const currentHandCardList = this.battleFieldHandRepository.findAll();

        await Promise.all(currentHandCardList.map(async (handCard, index) => {
            const calculatedPosition = this.calculateHandPositionByIndex(index);
            const positionId = handCard.getPositionId();
            const cardSceneId = handCard.getCardSceneId();

            console.log(`cardSceneId: ${cardSceneId}`);
            const cardSceneList = this.battleFieldCardSceneRepository.findAll();
            console.log(`cardSceneList: ${cardSceneList}`);

            const cardPosition = this.battleFieldHandCardPositionRepository.findById(positionId);
            const mainCardScene = await this.battleFieldCardSceneRepository.findById(cardSceneId); // 비동기 처리

            if (!cardPosition) {
                console.error(`Position not found for Card Scene ID: ${handCard.getCardSceneId()}, PositionId: ${positionId}`);
                return;
            }

            if (!mainCardScene) {
                console.error(`Scene not found for Card Scene ID: ${handCard.getCardSceneId()}`);
                return;
            }

            cardPosition.setPosition(calculatedPosition.getX(), calculatedPosition.getY());
            console.log(`Card Scene ID: ${handCard.getCardSceneId()}, New Position: (${calculatedPosition.getX()}, ${calculatedPosition.getY()})`);

            const mainCardSceneMesh = mainCardScene.getMesh();
            if (mainCardSceneMesh) {
                mainCardSceneMesh.position.x = calculatedPosition.getX();
                mainCardSceneMesh.position.y = calculatedPosition.getY();
                console.log(`Mesh updated for Card Scene ID: ${handCard.getCardSceneId()}, Position: (${mainCardSceneMesh.position.x}, ${mainCardSceneMesh.position.y})`);
            } else {
                console.error(`Mesh not found for Card Scene ID: ${handCard.getCardSceneId()}`);
            }

            const attributeMarkList = handCard.getAttributeMarkIdList();
            if (!attributeMarkList) {
                console.error(`attributeMarkList 없다: ${attributeMarkList}`);
                return;
            }
            console.log(`attributeMarkSceneList: ${attributeMarkList}`);

            // 각 attributeMarkSceneId에 대해 비동기 작업을 처리
            await Promise.all(attributeMarkList.map(async (attributeMarkId) => {
                try {
                    const attributeMark = await this.battleFieldCardAttributeMarkRepository.findById(attributeMarkId); // 비동기 처리
                    if (!attributeMark) {
                        console.error(`AttributeMark not found for ID: ${attributeMarkId}`);
                        return;
                    }

                    const attributeMarkPosition = await this.battleFieldCardAttributeMarkPositionRepository.findById(attributeMark.attributeMarkPositionId);
                    if (!attributeMarkPosition) {
                        console.error(`AttributeMarkPosition not found for ID: ${attributeMark.attributeMarkPositionId}`);
                        return;
                    }

                    const attributeMarkScene = await this.battleFieldCardAttributeMarkSceneRepository.findById(attributeMark.attributeMarkSceneId); // Scene 가져오기
                    if (!attributeMarkScene) {
                        console.error(`AttributeMarkScene not found for ID: ${attributeMark.attributeMarkSceneId}`);
                        return;
                    }

                    const attributeMesh = attributeMarkScene.getMesh();
                    if (attributeMesh) {
                        const markSceneType = attributeMarkScene.getMarkSceneType();

                        // AttributeMarkPositionCalculator를 사용하여 위치 계산
                        const calculatedAttributeMarkPosition = AttributeMarkPositionCalculator.getPositionForType(
                            markSceneType,
                            calculatedPosition, // 여기서 calculatedPosition을 사용
                            this.CARD_WIDTH,
                            this.CARD_HEIGHT
                        );

                        // 계산된 위치로 attributeMesh의 포지션 업데이트
                        attributeMesh.position.x = calculatedAttributeMarkPosition.getX();
                        attributeMesh.position.y = calculatedAttributeMarkPosition.getY();

                        // attributeMarkPosition에 계산된 값 설정
                        attributeMarkPosition.setPosition(calculatedAttributeMarkPosition.getX(), calculatedAttributeMarkPosition.getY());

                        console.log(`Attribute Mark Mesh updated for AttributeMarkScene ID: ${attributeMark.attributeMarkSceneId}`);
                    } else {
                        console.error(`Mesh not found for AttributeMarkScene ID: ${attributeMark.attributeMarkSceneId}`);
                    }
                } catch (error) {
                    console.error(`Error processing AttributeMark ID: ${attributeMarkId}`, error);
                }
            }));
        }));
    }

    private calculateHandPositionByIndex(index: number): Vector2d {
        const handPositionX = (this.HAND_INITIAL_X + index * this.GAP_OF_EACH_CARD) * window.innerWidth;
        const handPositionY = this.HAND_INITIAL_Y * window.innerHeight
            + (this.CARD_HEIGHT * this.HALF * window.innerWidth);
        return new Vector2d(handPositionX, handPositionY);
    }

    private async handleValidDrop(selectedObject: BattleFieldCardScene): Promise<YourField> {
        const cardSceneId = selectedObject.getId()

        const willBePlacedYourFieldHandCard = this.battleFieldHandRepository.findByCardSceneId(cardSceneId);

        const cardId = willBePlacedYourFieldHandCard?.getCardId() ?? 0; // 기본값 0
        const card = getCardById(cardId)

        if (!card) {
            console.error(`Card not found for cardId: ${cardId}`);
            throw new Error(`Card not found for cardId: ${cardId}`);
        }

        const cardKind = parseInt(card.종류, 10) as CardKind;

        if (cardKind !== CardKind.UNIT) {
            this.restoreOriginalPosition(selectedObject as unknown as THREE.Object3D);
            throw new Error('유닛이 아닙니다')
        }

        // UNIT 카드에 대한 처리 로직
        console.log("Handling UNIT card:", card);

        const positionId = willBePlacedYourFieldHandCard?.getPositionId() ?? 0; // 기본값 0
        const attributeMarkIdList = willBePlacedYourFieldHandCard?.getAttributeMarkIdList() ?? [];

        const handCardIndex = this.battleFieldHandRepository.findCardIndexByCardSceneId(cardSceneId)
        if (handCardIndex === null) {
            throw new Error(`sceneId ${cardSceneId} 존재하지 않음`);
        }

        let yourFieldCardScene;
        const willBePlaceYourFieldCardScene = this.battleFieldCardSceneRepository.extractByIndex(handCardIndex)
        const willBePlaceYourFieldCardSceneMesh = willBePlaceYourFieldCardScene?.getMesh()

        if (willBePlaceYourFieldCardSceneMesh) {
            yourFieldCardScene = await this.yourFieldCardSceneRepository.create(willBePlaceYourFieldCardSceneMesh);
        }

        if (!yourFieldCardScene) {
            throw new Error("yourFieldCardScene이 생성되지 않았습니다.");
        }

        const createdYourField = this.yourFieldRepository.save(yourFieldCardScene.getId(), positionId, attributeMarkIdList, cardId);
        console.log(`handleValidDrop() yourFieldRepository saved: ${JSON.stringify(createdYourField, null, 2)}`);

        // const handCardPositionId = this.battleFieldHandRepository.findPositionIdByCardSceneId(cardSceneId)
        // if (handCardPositionId === null) {
        //     throw new Error('Position ID를 찾을 수 없습니다');
        // }
        //
        // const willBePlaceYourFieldCardPosition = this.battleFieldHandCardPositionRepository.extractById(handCardPositionId)
        // if (willBePlaceYourFieldCardPosition) {
        //     const positionX = willBePlaceYourFieldCardPosition.getX()
        //     const positionY = willBePlaceYourFieldCardPosition.getY()
        //     const yourFieldCardPosition = new YourFieldCardPosition(positionX, positionY)
        //     this.yourFieldCardPositionRepository.save(yourFieldCardPosition);
        // }

        const handCardId = willBePlacedYourFieldHandCard?.getId()
        if (handCardId === undefined) {
            throw new Error("Hand card ID를 찾을 수 없습니다.");
        }

        this.battleFieldHandRepository.deleteById(handCardId)
        console.log(`handCard: ${JSON.stringify(this.battleFieldHandRepository.findAll(), null, 2)}`);

        return createdYourField
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
