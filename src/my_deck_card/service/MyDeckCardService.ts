import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

export interface MyDeckCardService {
    createMyDeckCardSceneWithPosition(deckId: number, cardIdList: number[]): Promise<THREE.Group | null>;
}