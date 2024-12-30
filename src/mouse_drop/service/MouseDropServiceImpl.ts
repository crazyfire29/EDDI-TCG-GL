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
import {YourFieldCardPositionRepository} from "../../your_field_card_position/repository/YourFieldCardPositionRepository";
import {YourFieldCardPositionRepositoryImpl} from "../../your_field_card_position/repository/YourFieldCardPositionRepositoryImpl";
import {YourFieldCardPosition} from "../../your_field_card_position/entity/YourFieldCardPosition";
import {Vector2d} from "../../common/math/Vector2d";

export class MouseDropServiceImpl implements MouseDropService {
    private static instance: MouseDropServiceImpl | null = null;

    private readonly HALF: number = 0.5;
    private readonly GAP_OF_EACH_CARD: number = 0.094696
    private readonly HAND_X_CRITERIA: number = 0.311904
    private readonly HAND_Y_CRITERIA: number = 0.972107
    private readonly HAND_INITIAL_X: number = this.HAND_X_CRITERIA - this.HALF;
    private readonly HAND_INITIAL_Y: number = this.HALF - this.HAND_Y_CRITERIA;

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
                this.alignHandCard()
            }
        } else {
            console.log("Dropped outside YourFieldArea.");
            this.restoreOriginalPosition(selectedObject);
        }

        this.clearSelection();
    }

    private alignHandCard(): void {
        const currentHandCardList = this.battleFieldHandRepository.findAll();

        currentHandCardList.forEach((handCard, index) => {
            const calculatedPosition = this.calculateHandPositionByIndex(index);
            const positionId = handCard.getPositionId();
            const cardSceneId = handCard.getCardSceneId();

            console.log(`cardSceneId: ${cardSceneId}`);
            const cardSceneList = this.battleFieldCardSceneRepository.findAll();
            console.log(`cardSceneList: ${cardSceneList}`);

            const cardPosition = this.battleFieldHandCardPositionRepository.findById(positionId);
            const mainCardScene = this.battleFieldCardSceneRepository.findById(cardSceneId);

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
        });
    }

    // private alignHandCard(): void {
    //     const currentHandCardList = this.battleFieldHandRepository.findAll();
    //
    //     currentHandCardList.forEach((handCard, index) => {
    //         // 현재 카드의 실제 위치를 계산
    //         const calculatedPosition = this.calculateHandPositionByIndex(index);
    //
    //         // 현재 카드의 PositionId를 가져옴
    //         const positionId = handCard.getPositionId();
    //
    //         // 해당 PositionId로 BattleFieldCardPosition을 찾음
    //         const cardPosition = this.battleFieldHandCardPositionRepository.findById(positionId);
    //         const cardSceneId = handCard.getCardSceneId()
    //         console.log(`cardSceneId: ${cardSceneId}`)
    //
    //         const cardSceneList = this.battleFieldCardSceneRepository.findAll()
    //         console.log(`cardSceneList: ${cardSceneList}`)
    //
    //         // Card Scene을 가져옴
    //         const mainCardScene = this.battleFieldCardSceneRepository.findById(cardSceneId);
    //         console.log(`mainCardScene: ${mainCardScene}`)
    //
    //         if (cardPosition && mainCardScene) {
    //             // 위치 갱신
    //             cardPosition.setPosition(calculatedPosition.getX(), calculatedPosition.getY());
    //             console.log(`Card Scene ID: ${handCard.getCardSceneId()}, New Position: (${calculatedPosition.getX()}, ${calculatedPosition.getY()})`);
    //
    //             // Mesh를 업데이트
    //             const mainCardSceneMesh = mainCardScene.getMesh();
    //             if (mainCardSceneMesh) {
    //                 mainCardSceneMesh.position.x = calculatedPosition.getX();
    //                 mainCardSceneMesh.position.y = calculatedPosition.getY();
    //                 console.log(`Mesh updated for Card Scene ID: ${handCard.getCardSceneId()}, Position: (${mainCardSceneMesh.position.x}, ${mainCardSceneMesh.position.y})`);
    //             }
    //
    //             // 추가적으로 Attribute Mark Scene도 업데이트
    //             // const attributeMarkSceneList = this.battleFieldCardAttributeMarkSceneRepository.findByCardSceneId(handCard.getCardSceneId());
    //             // attributeMarkSceneList.forEach((attributeMarkScene) => {
    //             //     const attributeMesh = attributeMarkScene.getMesh();
    //             //     if (attributeMesh) {
    //             //         attributeMesh.position.x = calculatedPosition.getX();
    //             //         attributeMesh.position.y = calculatedPosition.getY() - this.ATTRIBUTE_MARK_OFFSET;
    //             //         console.log(`Attribute Mark Mesh updated for Card Scene ID: ${handCard.getCardSceneId()}`);
    //             //     }
    //             // });
    //         } else {
    //             console.error(`Position or Scene not found for Card Scene ID: ${handCard.getCardSceneId()}`);
    //         }
    //     });
    // }

    private calculateHandPositionByIndex(index: number): Vector2d {
        const handPositionX = (this.HAND_INITIAL_X + index * this.GAP_OF_EACH_CARD) * window.innerWidth;
        const handPositionY = this.HAND_INITIAL_Y * window.innerHeight
            + (this.CARD_HEIGHT * this.HALF * window.innerWidth);
        return new Vector2d(handPositionX, handPositionY);
    }

    private handleValidDrop(selectedObject: BattleFieldCardScene): void {
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

        const handCardId = handCard?.getId()

        if (handCardId === undefined) {
            console.error("Hand card ID를 찾을 수 없습니다.");
            return
        }

        this.battleFieldHandRepository.deleteById(handCardId)
        console.log(`handCard: ${JSON.stringify(this.battleFieldHandRepository.findAll(), null, 2)}`);

        // const handCardIndex = this.battleFieldHandRepository.findCardIndexByCardSceneId(cardSceneId)
        //
        // if (handCardIndex === null) {
        //     console.error(`sceneId ${cardSceneId} 존재하지 않음`);
        //     return
        // }
        //
        // console.log(`handCardIndex: ${handCardIndex}`)
        // const willBePlaceYourFieldCardScene = this.battleFieldCardSceneRepository.extractByIndex(handCardIndex)
        // const willBePlaceYourFieldCardSceneMesh = willBePlaceYourFieldCardScene?.getMesh()
        // if (willBePlaceYourFieldCardSceneMesh) {
        //     this.yourFieldCardSceneRepository.create(willBePlaceYourFieldCardSceneMesh);
        // }
        //
        // const handCardPositionId = this.battleFieldHandRepository.findPositionIdByCardSceneId(cardSceneId)
        // if (handCardPositionId === null) {
        //     console.error('Position ID를 찾을 수 없습니다');
        //     return
        // }
        // const willBePlaceYourFieldCardPosition = this.battleFieldHandCardPositionRepository.extractById(handCardPositionId)
        // if (willBePlaceYourFieldCardPosition) {
        //     const positionX = willBePlaceYourFieldCardPosition.getX()
        //     const positionY = willBePlaceYourFieldCardPosition.getY()
        //     const yourFieldCardPosition = new YourFieldCardPosition(positionX, positionY)
        //     this.yourFieldCardPositionRepository.save(yourFieldCardPosition);
        // }

        // const remainHandCardSceneList = this.battleFieldCardSceneRepository.findAll()

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
