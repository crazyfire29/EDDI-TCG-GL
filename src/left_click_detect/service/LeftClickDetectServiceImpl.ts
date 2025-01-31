import {LeftClickDetectService} from "./LeftClickDetectService";
import {BattleFieldCardSceneRepositoryImpl} from "../../battle_field_card_scene/repository/BattleFieldCardSceneRepositoryImpl";
import {BattleFieldCardSceneRepository} from "../../battle_field_card_scene/repository/BattleFieldCardSceneRepository";
import {LeftClickHandDetectRepositoryImpl} from "../repository/LeftClickHandDetectRepositoryImpl";
import {LeftClickHandDetectRepository} from "../repository/LeftClickHandDetectRepository";
import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";
import * as THREE from "three";
import {DragMoveRepository} from "../../drag_move/repository/DragMoveRepository";
import {DragMoveRepositoryImpl} from "../../drag_move/repository/DragMoveRepositoryImpl";
import {BattleFieldHandRepository} from "../../battle_field_hand/repository/BattleFieldHandRepository";
import {BattleFieldHandRepositoryImpl} from "../../battle_field_hand/repository/BattleFieldHandRepositoryImpl";
import {BattleFieldCardAttributeMarkSceneRepository} from "../../battle_field_card_attribute_mark_scene/repository/BattleFieldCardAttributeMarkSceneRepository";
import {BattleFieldCardAttributeMarkSceneRepositoryImpl} from "../../battle_field_card_attribute_mark_scene/repository/BattleFieldCardAttributeMarkSceneRepositoryImpl";
import {BattleFieldCardAttributeMarkScene} from "../../battle_field_card_attribute_mark_scene/entity/BattleFieldCardAttributeMarkScene";
import {BattleFieldCardAttributeMarkRepositoryImpl} from "../../battle_field_card_attribute_mark/repository/BattleFieldCardAttributeMarkRepositoryImpl";
import {BattleFieldCardAttributeMarkRepository} from "../../battle_field_card_attribute_mark/repository/BattleFieldCardAttributeMarkRepository";
import {BattleFieldCardAttributeMark} from "../../battle_field_card_attribute_mark/entity/BattleFieldCardAttributeMark";
import {NeonBorderRepository} from "../../neon_border/repository/NeonBorderRepository";
import {NeonBorderRepositoryImpl} from "../../neon_border/repository/NeonBorderRepositoryImpl";
import {BattleFieldCardScene} from "../../battle_field_card_scene/entity/BattleFieldCardScene";
import {NeonBorder} from "../../neon_border/entity/NeonBorder";
import {NeonShape} from "../../neon/NeonShape";
import {NeonBorderLineSceneRepository} from "../../neon_border_line_scene/repository/NeonBorderLineSceneRepository";
import {NeonBorderLineSceneRepositoryImpl} from "../../neon_border_line_scene/repository/NeonBorderLineSceneRepositoryImpl";
import {NeonBorderLineScene} from "../../neon_border_line_scene/entity/NeonBorderLineScene";
import {NeonBorderLinePosition} from "../../neon_border_line_position/entity/NeonBorderLinePosition";
import {Vector2d} from "../../common/math/Vector2d";
import {NeonBorderLinePositionRepository} from "../../neon_border_line_position/repository/NeonBorderLinePositionRepository";
import {NeonBorderLinePositionRepositoryImpl} from "../../neon_border_line_position/repository/NeonBorderLinePositionRepositoryImpl";
import {NeonBorderSceneType} from "../../neon_border/entity/NeonBorderSceneType";
import chalk from "chalk";
import {YourFieldCardSceneRepository} from "../../your_field_card_scene/repository/YourFieldCardSceneRepository";
import {YourFieldCardSceneRepositoryImpl} from "../../your_field_card_scene/repository/YourFieldCardSceneRepositoryImpl";
import {LeftClickYourFieldDetectRepository} from "../repository/LeftClickYourFieldDetectRepository";
import {LeftClickYourFieldDetectRepositoryImpl} from "../repository/LeftClickYourFieldDetectRepositoryImpl";
import {LeftClickedArea} from "../entity/LeftClickedArea";

export class LeftClickDetectServiceImpl implements LeftClickDetectService {
    private static instance: LeftClickDetectServiceImpl | null = null;

    private readonly HALF: number = 0.5;
    private readonly GAP_OF_EACH_CARD: number = 0.094696
    private readonly HAND_X_CRITERIA: number = 0.311904
    // 0.862217 + 0.06493506493 * 1.615 = 0.1048701
    // 0.862217 + 0.1048701
    private readonly HAND_Y_CRITERIA: number = 0.972107
    private readonly HAND_INITIAL_X: number = this.HAND_X_CRITERIA - this.HALF;
    private readonly HAND_INITIAL_Y: number = this.HALF - this.HAND_Y_CRITERIA;

    private readonly CARD_WIDTH: number = 0.06493506493
    private readonly CARD_HEIGHT: number = this.CARD_WIDTH * 1.615

    private neonBorderRepository: NeonBorderRepository;
    private neonShape: NeonShape

    private neonBorderLineSceneRepository: NeonBorderLineSceneRepository;
    private neonBorderLinePositionRepository: NeonBorderLinePositionRepository;

    private battleFieldCardAttributeMarkSceneRepository: BattleFieldCardAttributeMarkSceneRepository
    private battleFieldCardAttributeMarkRepository: BattleFieldCardAttributeMarkRepository
    private battleFieldCardSceneRepository: BattleFieldCardSceneRepository;
    private battleFieldHandRepository: BattleFieldHandRepository;

    private yourFieldCardSceneRepository: YourFieldCardSceneRepository

    private leftClickHandDetectRepository: LeftClickHandDetectRepository;
    private leftClickYourFieldDetectRepository: LeftClickYourFieldDetectRepository;

    private cameraRepository: CameraRepository
    private dragMoveRepository: DragMoveRepository;

    private leftMouseDown: boolean = false;

    private areaHandlers: Record<LeftClickedArea, (selectedCard: any) => Promise<void>> = {
        [LeftClickedArea.YOUR_HAND]: this.handleYourHandClick.bind(this),
        [LeftClickedArea.YOUR_FIELD]: this.handleYourFieldClick.bind(this),
        [LeftClickedArea.OPPONENT_FIELD]: this.handleOpponentFieldClick.bind(this),
        [LeftClickedArea.OPPONENT_HAND]: this.handleOpponentHandClick.bind(this),
        [LeftClickedArea.FIELD_ENERGY]: this.handleFieldEnergyClick.bind(this),
        [LeftClickedArea.TOMB]: this.handleTombClick.bind(this),
        [LeftClickedArea.LOSTZONE]: this.handleLostZoneClick.bind(this),
    };

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.neonBorderRepository = NeonBorderRepositoryImpl.getInstance();
        this.neonShape = NeonShape.getInstance()

        this.neonBorderLineSceneRepository = NeonBorderLineSceneRepositoryImpl.getInstance()
        this.neonBorderLinePositionRepository = NeonBorderLinePositionRepositoryImpl.getInstance()

        this.battleFieldCardAttributeMarkSceneRepository = BattleFieldCardAttributeMarkSceneRepositoryImpl.getInstance()
        this.battleFieldCardAttributeMarkRepository = BattleFieldCardAttributeMarkRepositoryImpl.getInstance()
        this.battleFieldCardSceneRepository = BattleFieldCardSceneRepositoryImpl.getInstance();
        this.battleFieldHandRepository = BattleFieldHandRepositoryImpl.getInstance()

        this.yourFieldCardSceneRepository = YourFieldCardSceneRepositoryImpl.getInstance()

        this.leftClickHandDetectRepository = LeftClickHandDetectRepositoryImpl.getInstance()
        this.leftClickYourFieldDetectRepository = LeftClickYourFieldDetectRepositoryImpl.getInstance()

        this.cameraRepository = CameraRepositoryImpl.getInstance()
        this.dragMoveRepository = DragMoveRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): LeftClickDetectServiceImpl {
        if (!LeftClickDetectServiceImpl.instance) {
            LeftClickDetectServiceImpl.instance = new LeftClickDetectServiceImpl(camera, scene);
        }
        return LeftClickDetectServiceImpl.instance;
    }

    setLeftMouseDown(state: boolean): void {
        this.leftMouseDown = state;
    }

    isLeftMouseDown(): boolean {
        return this.leftMouseDown;
    }

    private determineClickedArea(x: number, y: number): { object: any; area: LeftClickedArea } | null {
        const handSceneList = this.battleFieldCardSceneRepository.findAll();
        const clickedHandCard = this.leftClickHandDetectRepository.isYourHandAreaClicked({ x, y }, handSceneList, this.camera);
        if (clickedHandCard) {
            return { object: clickedHandCard, area: LeftClickedArea.YOUR_HAND };
        }

        const yourFieldSceneList = this.yourFieldCardSceneRepository.findAll();
        const clickedYourFieldCard = this.leftClickYourFieldDetectRepository.isYourFieldAreaClicked({ x, y }, yourFieldSceneList, this.camera);
        if (clickedYourFieldCard) {
            return { object: clickedYourFieldCard, area: LeftClickedArea.YOUR_FIELD };
        }

        return null;
    }

    async handleLeftClick(clickPoint: { x: number; y: number }): Promise<any | null> {
        const { x, y } = clickPoint;

        // 선택 상태 초기화
        await this.dragMoveRepository.deleteSelectedObject();
        await this.dragMoveRepository.deleteSelectedGroup();

        const selectedObject = this.determineClickedArea(x, y);
        if (!selectedObject) {
            return null;
        }
        const selectedCard = selectedObject.object

        this.dragMoveRepository.setSelectedObject(selectedCard);

        const selectedArea = selectedObject.area

        try {
            // area에 해당하는 핸들러 실행
            const handler = this.areaHandlers[selectedArea];
            if (handler) {
                await handler(selectedCard);
            } else {
                console.warn(`No handler found for area: ${selectedArea}`);
            }
        } catch (error) {
            console.error(`Error handling click event for area: ${selectedArea}`, error);
        }

        return selectedCard;

        // try {
        //     // 속성 마크 ID 목록 가져오기
        //     const attributeMarkIdList = this.getAttributeMarkIdList(clickedHandCard.getId());
        //
        //     if (attributeMarkIdList.length > 0) {
        //         // 속성 마크 객체 목록 가져오기
        //         const attributeMarkList = await this.getAttributeMarkList(attributeMarkIdList);
        //
        //         // 유효한 속성 마크 장면 가져오기
        //         const validAttributeSceneList = await this.getValidAttributeScenes(attributeMarkList);
        //
        //         // 선택된 그룹 설정
        //         this.dragMoveRepository.setSelectedGroup(validAttributeSceneList);
        //     }
        //
        //     this.createNeonBorder(clickedHandCard)
        // } catch (error) {
        //     console.error("Error fetching attribute mark scenes:", error);
        // }
        //
        // return clickedHandCard;
    }

    // 속성 마크 ID 목록 가져오기
    private getAttributeMarkIdList(cardSceneId: number): number[] {
        const result = this.battleFieldHandRepository.findAttributeMarkIdListByCardSceneId(cardSceneId);
        return result || []; // null인 경우 빈 배열 반환
    }

    // 속성 마크 객체 목록 가져오기
    private async getAttributeMarkList(attributeMarkIdList: number[]): Promise<BattleFieldCardAttributeMark[]> {
        const attributeMarkPromises = attributeMarkIdList.map(id =>
            this.battleFieldCardAttributeMarkRepository.findById(id)
        );

        const attributeMarkResults = await Promise.all(attributeMarkPromises);

        // null 값을 제외한 속성 마크 반환
        return attributeMarkResults.filter(
            (attributeMark): attributeMark is BattleFieldCardAttributeMark => attributeMark !== null
        );
    }

    // 유효한 속성 마크 장면 가져오기
    private async getValidAttributeScenes(attributeMarkList: BattleFieldCardAttributeMark[]): Promise<BattleFieldCardAttributeMarkScene[]> {
        const scenePromises = attributeMarkList.map(attributeMark =>
            this.battleFieldCardAttributeMarkSceneRepository.findById(attributeMark.attributeMarkSceneId)
        );

        const sceneResults = await Promise.all(scenePromises);

        // null 값을 제외한 장면 반환
        return sceneResults.filter(
            (scene): scene is BattleFieldCardAttributeMarkScene => scene !== null
        );
    }

    private async createNeonBorder(clickedHandCard: BattleFieldCardScene): Promise<void> {
        const cardMesh = clickedHandCard.getMesh();
        cardMesh.renderOrder = 1;

        const cardPosition = cardMesh.position;
        this.dragMoveRepository.getSelectedGroup().forEach((obj) => {
            const attributeMesh = obj.getMesh();
            attributeMesh.renderOrder = 2;
        });

        const halfWidth = this.CARD_WIDTH * window.innerWidth / 2;
        const halfHeight = this.CARD_HEIGHT * window.innerWidth / 2;

        const cardSceneId = clickedHandCard.getId();

        const existingNeonBorder = this.neonBorderRepository.findByCardSceneIdWithPlacement(cardSceneId, NeonBorderSceneType.HAND);
        console.log(chalk.red.bold(`existingNeonBorder: ${existingNeonBorder}`));
        if (existingNeonBorder) {
            console.log(`NeonBorder already exists for cardSceneId: ${cardSceneId}, enabling visibility.`);
            existingNeonBorder.getNeonBorderLineSceneIdList().forEach((lineSceneId) => {
                const lineScene = this.neonBorderLineSceneRepository.findById(lineSceneId);
                if (lineScene) {
                    const lineMesh = lineScene.getLine();
                    if (lineMesh) {
                        lineMesh.visible = true; // Enable visibility
                        console.log(`Neon Border Line (ID: ${lineSceneId}) visibility set to true.`);
                    }
                }
            });
            return; // Exit early as we don't need to create a new border
        }

        const startX = cardPosition.x - halfWidth;
        const startY = cardPosition.y - halfHeight;
        const width = this.CARD_WIDTH * window.innerWidth;
        const height = this.CARD_HEIGHT * window.innerWidth;

        const { lines, neonMaterials } = await this.neonShape.addNeonShaderRectangle(startX, startY, width, height);

        const lineSceneIds = lines.map((line) => {
            const scene = new NeonBorderLineScene(line, line.material as THREE.ShaderMaterial);
            this.neonBorderLineSceneRepository.save(scene);
            return scene.getId();
        });

        const positionIds = lines.map((line) => {
            const position = new NeonBorderLinePosition(new Vector2d(line.position.x, line.position.y));
            this.neonBorderLinePositionRepository.save(position);
            return position.getId();
        });

        const neonBorder = new NeonBorder(lineSceneIds, positionIds, NeonBorderSceneType.HAND, cardSceneId);
        console.log(chalk.red.bold(`neonBorderSceneType: ${neonBorder.getNeonBorderSceneType()}`));
        console.log(chalk.red.bold(`Expected sceneType: ${NeonBorderSceneType.HAND}`));
        console.log(chalk.red.bold(`Created new NeonBorder for cardSceneId: ${cardSceneId}`));
        console.log(chalk.red.bold(`chalk.red.bold(Saving NeonBorder: ${JSON.stringify(neonBorder)}`));
        this.neonBorderRepository.save(neonBorder);
    }

    private async handleYourHandClick(selectedCard: any): Promise<void> {
        const attributeMarkIdList = this.getAttributeMarkIdList(selectedCard.getId());
        if (attributeMarkIdList.length > 0) {
            const attributeMarkList = await this.getAttributeMarkList(attributeMarkIdList);
            const validAttributeSceneList = await this.getValidAttributeScenes(attributeMarkList);
            this.dragMoveRepository.setSelectedGroup(validAttributeSceneList);
        }
        this.createNeonBorder(selectedCard);
    }

    private async handleYourFieldClick(selectedCard: any): Promise<void> {
        console.log("Your field card clicked:", selectedCard);
        this.createNeonBorder(selectedCard);
    }

    async handleOpponentFieldClick(selectedCard: any): Promise<void> {
        // OPPONENT_FIELD 영역에 대한 처리
    }

    async handleOpponentHandClick(selectedCard: any): Promise<void> {
        // OPPONENT_HAND 영역에 대한 처리
    }

    async handleFieldEnergyClick(selectedCard: any): Promise<void> {
        // FIELD_ENERGY 영역에 대한 처리
    }

    async handleTombClick(selectedCard: any): Promise<void> {
        // TOMB 영역에 대한 처리
    }

    async handleLostZoneClick(selectedCard: any): Promise<void> {
        // LOSTZONE 영역에 대한 처리
    }
}
