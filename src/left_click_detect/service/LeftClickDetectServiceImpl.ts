import { LeftClickDetectService } from "./LeftClickDetectService";
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
import {NeonBorderStatus} from "../../neon_border/entity/NeonBorderStatus";
import {NeonShape} from "../../neon/NeonShape";

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

    private battleFieldCardAttributeMarkSceneRepository: BattleFieldCardAttributeMarkSceneRepository
    private battleFieldCardAttributeMarkRepository: BattleFieldCardAttributeMarkRepository
    private battleFieldCardSceneRepository: BattleFieldCardSceneRepository;
    private battleFieldHandRepository: BattleFieldHandRepository;

    private leftClickHandDetectRepository: LeftClickHandDetectRepository;

    private cameraRepository: CameraRepository
    private dragMoveRepository: DragMoveRepository;

    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.neonBorderRepository = NeonBorderRepositoryImpl.getInstance();
        this.neonShape = NeonShape.getInstance()

        this.battleFieldCardAttributeMarkSceneRepository = BattleFieldCardAttributeMarkSceneRepositoryImpl.getInstance()
        this.battleFieldCardAttributeMarkRepository = BattleFieldCardAttributeMarkRepositoryImpl.getInstance()
        this.battleFieldCardSceneRepository = BattleFieldCardSceneRepositoryImpl.getInstance();
        this.battleFieldHandRepository = BattleFieldHandRepositoryImpl.getInstance()

        this.leftClickHandDetectRepository = LeftClickHandDetectRepositoryImpl.getInstance()

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

    async handleLeftClick(clickPoint: { x: number; y: number }): Promise<any | null> {
        const { x, y } = clickPoint;

        // 선택 상태 초기화
        await this.dragMoveRepository.deleteSelectedObject();
        await this.dragMoveRepository.deleteSelectedGroup();

        // 핸드 카드 클릭 감지
        const handSceneList = this.battleFieldCardSceneRepository.findAll();
        const clickedHandCard = this.leftClickHandDetectRepository.isYourHandAreaClicked(
            { x, y },
            handSceneList,
            this.camera
        );

        if (!clickedHandCard) {
            return null;
        }

        // 선택된 카드 설정
        this.dragMoveRepository.setSelectedObject(clickedHandCard);

        try {
            // 속성 마크 ID 목록 가져오기
            const attributeMarkIdList = this.getAttributeMarkIdList(clickedHandCard.getId());

            if (attributeMarkIdList.length > 0) {
                // 속성 마크 객체 목록 가져오기
                const attributeMarkList = await this.getAttributeMarkList(attributeMarkIdList);

                // 유효한 속성 마크 장면 가져오기
                const validAttributeSceneList = await this.getValidAttributeScenes(attributeMarkList);

                // 선택된 그룹 설정
                this.dragMoveRepository.setSelectedGroup(validAttributeSceneList);
            }

            this.createNeonBorder(clickedHandCard)
        } catch (error) {
            console.error("Error fetching attribute mark scenes:", error);
        }

        return clickedHandCard;
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
        // 카드의 위치와 크기를 계산하여 테두리를 생성
        const cardMesh = clickedHandCard.getMesh();
        cardMesh.renderOrder = 1
        const cardPosition = cardMesh.position;

        this.dragMoveRepository.getSelectedGroup().forEach((obj) => {
            const attributeMesh = obj.getMesh();
            attributeMesh.renderOrder = 2
        });

        const halfWidth = this.CARD_WIDTH * window.innerWidth / 2;
        const halfHeight = this.CARD_HEIGHT * window.innerWidth / 2;

        const topLeft = new THREE.Vector3(cardPosition.x - halfWidth, cardPosition.y + halfHeight, cardPosition.z);
        const topRight = new THREE.Vector3(cardPosition.x + halfWidth, cardPosition.y + halfHeight, cardPosition.z);
        const bottomLeft = new THREE.Vector3(cardPosition.x - halfWidth, cardPosition.y - halfHeight, cardPosition.z);
        const bottomRight = new THREE.Vector3(cardPosition.x + halfWidth, cardPosition.y - halfHeight, cardPosition.z);

        const lineWidth = 5
        const halfLineWidth = lineWidth / 2.0

        // 네온 경계선을 생성
        const neonLinePromises = [
            this.neonShape.addNeonLine(topLeft.x + halfLineWidth, topLeft.y,
                                    topRight.x - halfLineWidth, topRight.y, lineWidth), // 상단
            this.neonShape.addNeonLine(topRight.x, topRight.y + halfLineWidth,
                                        bottomRight.x, bottomRight.y + lineWidth, lineWidth), // 우측
            this.neonShape.addNeonLine(bottomRight.x + halfLineWidth, bottomRight.y + halfLineWidth,
                                    bottomLeft.x - halfLineWidth, bottomLeft.y + halfLineWidth, lineWidth), // 하단
            this.neonShape.addNeonLine(bottomLeft.x, bottomLeft.y + lineWidth,
                                        topLeft.x, topLeft.y + halfLineWidth, lineWidth) // 좌측
        ];

        // Ensure that addNeonLine is returning the neon line objects and each has a uuid
        const neonLines = await Promise.all(neonLinePromises);

        // Assuming neonLine contains the neon object with uuid (if not modify this part accordingly)
        // const neonBorder = new NeonBorder(
        //     neonLines.map(line => line.id), // Scene ID로 라인 저장
        //     [], // Position ID (필요 시 추가)
        //     NeonBorderStatus.ACTIVE
        // );
        // this.neonBorderRepository.save(neonBorder);
    }
}
