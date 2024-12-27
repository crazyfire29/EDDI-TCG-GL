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

export class LeftClickDetectServiceImpl implements LeftClickDetectService {
    private static instance: LeftClickDetectServiceImpl | null = null;

    private battleFieldCardAttributeMarkSceneRepository: BattleFieldCardAttributeMarkSceneRepository
    private battleFieldCardAttributeMarkRepository: BattleFieldCardAttributeMarkRepository
    private battleFieldCardSceneRepository: BattleFieldCardSceneRepository;
    private battleFieldHandRepository: BattleFieldHandRepository;

    private leftClickHandDetectRepository: LeftClickHandDetectRepository;

    private cameraRepository: CameraRepository
    private dragMoveRepository: DragMoveRepository;

    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
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
}
