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
    private battleFieldhandRepository: BattleFieldHandRepository;

    private leftClickHandDetectRepository: LeftClickHandDetectRepository;

    private cameraRepository: CameraRepository
    private dragMoveRepository: DragMoveRepository;

    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.battleFieldCardAttributeMarkSceneRepository = BattleFieldCardAttributeMarkSceneRepositoryImpl.getInstance()
        this.battleFieldCardAttributeMarkRepository = BattleFieldCardAttributeMarkRepositoryImpl.getInstance()
        this.battleFieldCardSceneRepository = BattleFieldCardSceneRepositoryImpl.getInstance();
        this.battleFieldhandRepository = BattleFieldHandRepositoryImpl.getInstance()

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

    async handleLeftClick(
        clickPoint: { x: number; y: number },
    ): Promise<any | null> {
        const { x, y } = clickPoint;

        await this.dragMoveRepository.deleteSelectedObject()
        await this.dragMoveRepository.deleteSelectedGroup()

        const handSceneList = this.battleFieldCardSceneRepository.findAll()
        const clickedHandCard = this.leftClickHandDetectRepository.isYourHandAreaClicked(
            { x, y },
            handSceneList,
            this.camera
        );
        if (clickedHandCard) {
            this.dragMoveRepository.setSelectedObject(clickedHandCard);

            try {
                const attributeMarkIdList = this.battleFieldhandRepository.findAttributeMarkIdListByCardSceneId(
                    clickedHandCard.getId()
                );
                console.log(`LeftClickDetectServiceImpl -> attributeMarkIdList: ${attributeMarkIdList}`)

                if (attributeMarkIdList && attributeMarkIdList.length > 0) {
                    const attributeMarkList = await Promise.all(
                        attributeMarkIdList.map(id =>
                            // this.battleFieldCardAttributeMarkSceneRepository.findById(id)
                            this.battleFieldCardAttributeMarkRepository.findById(id)
                        )
                    );
                    console.log(`LeftClickDetectServiceImpl -> attributeMarkList: ${attributeMarkList}`)

                    const scenePromises = attributeMarkList
                        .filter((attributeMark): attributeMark is BattleFieldCardAttributeMark => attributeMark !== null)
                        .map(attributeMark =>
                            this.battleFieldCardAttributeMarkSceneRepository.findById(attributeMark.attributeMarkSceneId)
                        );

                    const validAttributeScenes = await Promise.all(scenePromises);

                    const validAttributeSceneList = validAttributeScenes.filter(
                        (scene): scene is BattleFieldCardAttributeMarkScene => scene !== null
                    );

                    this.dragMoveRepository.setSelectedGroup(validAttributeSceneList);
                }
            } catch (error) {
                console.error("Error fetching attribute mark scenes:", error);
            }

            return clickedHandCard;
        }

        return null;
    }
}
