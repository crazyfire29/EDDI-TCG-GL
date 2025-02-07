import * as THREE from 'three';
import {SideScrollArea} from "../entity/SideScrollArea";

export interface SideScrollAreaRepository {
    createSideScrollArea(id: string): Promise<SideScrollArea>;
    findArea(): SideScrollArea | null;
    deleteArea(): void;
}