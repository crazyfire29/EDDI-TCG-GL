// MouseDropServiceImpl.ts
import * as THREE from 'three';
import { MouseDropService } from './MouseDropService';
import {MouseDropFieldRepositoryImpl} from "../repository/MouseDropRepositoryImpl";
import {MouseDropFieldRepository} from "../repository/MouseDropRepository";
import {DragMoveRepository} from "../../drag_move/repository/DragMoveRepository";
import {DragMoveRepositoryImpl} from "../../drag_move/repository/DragMoveRepositoryImpl";
import {BattleFieldCardScene} from "../../battle_field_card_scene/entity/BattleFieldCardScene";

export class MouseDropServiceImpl implements MouseDropService {
    private static instance: MouseDropServiceImpl | null = null;

    private raycaster: THREE.Raycaster;
    private mouseDropFieldRepository: MouseDropFieldRepository;
    private dragMoveRepository: DragMoveRepository;

    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.mouseDropFieldRepository = MouseDropFieldRepositoryImpl.getInstance();
        this.dragMoveRepository = DragMoveRepositoryImpl.getInstance()
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
            // this.restoreOriginalPosition(selectedObject, originalPositionMap);
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

    private restoreOriginalPosition(selectedObject: THREE.Object3D, originalPositionMap: Map<THREE.Object3D, THREE.Vector3>): void {
        const originalPosition = originalPositionMap.get(selectedObject);
        if (originalPosition) {
            selectedObject.position.copy(originalPosition);
            console.log("Object returned to original position:", originalPosition);
        } else {
            console.log("No original position found for selectedObject.");
        }
    }
}
