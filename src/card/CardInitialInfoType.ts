import * as THREE from "three";
import {Vector2d} from "../common/math/Vector2d";

export interface CardInitialInfo {
    cardMesh: THREE.Mesh;
    initialPosition: Vector2d;
    textureId: string;
    width: number;
    height: number;
    cardIndex: number;
}