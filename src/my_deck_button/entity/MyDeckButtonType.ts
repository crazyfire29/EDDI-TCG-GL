import * as THREE from "three";
import {Vector2d} from "../../common/math/Vector2d";

export enum MyDeckButtonType {
    NOT_CLICK_DECK_BUTTON = 1,
    CLICK_DECK_BUTTON = 2
}

export interface MyDeckButtonInitialInfo {
    buttonMesh: THREE.Mesh;
    initialPosition: Vector2d;
    width: number;
    height: number;
}