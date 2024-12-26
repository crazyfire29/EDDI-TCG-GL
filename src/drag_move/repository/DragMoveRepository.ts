import * as THREE from 'three';
import {BattleFieldCardAttributeMarkScene} from "../../battle_field_card_attribute_mark_scene/entity/BattleFieldCardAttributeMarkScene";

export interface DragMoveRepository {
    getSelectedObject(): THREE.Object3D | null;
    setSelectedObject(object: THREE.Object3D | null): void;

    getSelectedGroup(): BattleFieldCardAttributeMarkScene[];

    setSelectedGroup(group: BattleFieldCardAttributeMarkScene[]): void;
}
