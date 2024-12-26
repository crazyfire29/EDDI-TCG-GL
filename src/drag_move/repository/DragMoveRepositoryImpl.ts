import * as THREE from 'three';
import { DragMoveRepository } from './DragMoveRepository';
import {BattleFieldCardAttributeMarkScene} from "../../battle_field_card_attribute_mark_scene/entity/BattleFieldCardAttributeMarkScene";

export class DragMoveRepositoryImpl implements DragMoveRepository {
    private static instance: DragMoveRepositoryImpl | null = null;

    private selectedObject: THREE.Object3D | null = null;
    private selectedGroup: BattleFieldCardAttributeMarkScene[] = [];

    private constructor() {}

    static getInstance(): DragMoveRepositoryImpl {
        if (!DragMoveRepositoryImpl.instance) {
            DragMoveRepositoryImpl.instance = new DragMoveRepositoryImpl();
        }
        return DragMoveRepositoryImpl.instance;
    }

    getSelectedObject(): THREE.Object3D | null {
        return this.selectedObject;
    }

    setSelectedObject(object: THREE.Object3D | null): void {
        this.selectedObject = object;
    }

    getSelectedGroup(): BattleFieldCardAttributeMarkScene[] {
        return this.selectedGroup;
    }

    setSelectedGroup(group: BattleFieldCardAttributeMarkScene[]): void {
        this.selectedGroup = group;
    }
}
