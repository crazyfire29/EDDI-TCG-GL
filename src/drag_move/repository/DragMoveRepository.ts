import * as THREE from 'three';
import {BattleFieldCardAttributeMarkScene} from "../../battle_field_card_attribute_mark_scene/entity/BattleFieldCardAttributeMarkScene";
import {LeftClickedArea} from "../../left_click_detect/entity/LeftClickedArea";

export interface DragMoveRepository {
    getSelectedObject(): THREE.Object3D | null;
    setSelectedObject(object: THREE.Object3D | null): void;

    getSelectedGroup(): BattleFieldCardAttributeMarkScene[];
    setSelectedGroup(group: BattleFieldCardAttributeMarkScene[]): void;

    getSelectedArea(): LeftClickedArea | null;
    setSelectedArea(area: LeftClickedArea | null): void

    deleteSelectedObject(): void
    deleteSelectedGroup(): void
    deleteSelectedArea(): void
}
