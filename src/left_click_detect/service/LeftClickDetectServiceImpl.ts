import { LeftClickDetectService } from "./LeftClickDetectService";
import {BattleFieldCardSceneRepositoryImpl} from "../../battle_field_card_scene/repository/BattleFieldCardSceneRepositoryImpl";
import {BattleFieldCardSceneRepository} from "../../battle_field_card_scene/repository/BattleFieldCardSceneRepository";
import {LeftClickHandDetectRepositoryImpl} from "../repository/LeftClickHandDetectRepositoryImpl";
import {LeftClickHandDetectRepository} from "../repository/LeftClickHandDetectRepository";
import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";
import * as THREE from "three";

export class LeftClickDetectServiceImpl implements LeftClickDetectService {
    private static instance: LeftClickDetectServiceImpl | null = null;

    private battleFieldCardSceneRepository: BattleFieldCardSceneRepository;
    private leftClickHandDetectRepository: LeftClickHandDetectRepository;
    private cameraRepository: CameraRepository

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.battleFieldCardSceneRepository = BattleFieldCardSceneRepositoryImpl.getInstance();
        this.leftClickHandDetectRepository = LeftClickHandDetectRepositoryImpl.getInstance()
        this.cameraRepository = CameraRepositoryImpl.getInstance()
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): LeftClickDetectServiceImpl {
        if (!LeftClickDetectServiceImpl.instance) {
            LeftClickDetectServiceImpl.instance = new LeftClickDetectServiceImpl(camera, scene);
        }
        return LeftClickDetectServiceImpl.instance;
    }

    handleLeftClick(
        clickPoint: { x: number; y: number },
    ): any | null {
        const { x, y } = clickPoint;
        // const adjustedY = window.innerHeight - y;

        const handSceneList = this.battleFieldCardSceneRepository.findAll()
        const clickedHandCard = this.leftClickHandDetectRepository.isYourHandAreaClicked(
            { x, y },
            handSceneList,
            this.camera
        );
        if (clickedHandCard) return clickedHandCard;

        // Add additional detection logic here...
        return null;
    }
}
