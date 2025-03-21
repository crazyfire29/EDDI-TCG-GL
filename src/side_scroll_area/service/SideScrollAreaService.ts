import * as THREE from 'three';
import {SideScrollAreaType} from "../entity/SideScrollAreaType";

export interface SideScrollAreaService {
    createSideScrollArea(
        id: string, type: SideScrollAreaType, width: number, height: number, positionX: number, positionY: number
    ): Promise<THREE.Mesh | null>;
}