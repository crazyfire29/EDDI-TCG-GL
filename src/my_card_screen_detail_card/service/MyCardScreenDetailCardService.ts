import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

export interface MyCardScreenDetailCardService {
    createMyCardDetailCard(cardId: number): Promise<THREE.Group | null>;
}