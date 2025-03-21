import * as THREE from 'three';
import {SideScrollArea} from "../entity/SideScrollArea";
import {SideScrollAreaType} from "../entity/SideScrollAreaType";

export interface SideScrollAreaRepository {
    createSideScrollArea(
        id: string, type: SideScrollAreaType, width: number, height: number, positionX: number, positionY: number
    ): Promise<SideScrollArea>;
}