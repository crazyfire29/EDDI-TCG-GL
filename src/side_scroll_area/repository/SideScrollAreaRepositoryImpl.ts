import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

import {SideScrollAreaRepository} from './SideScrollAreaRepository';
import {SideScrollArea} from "../entity/SideScrollArea";
import {TransparentRectangle} from "../../shape/TransparentRectangle";

export class SideScrollAreaRepositoryImpl implements SideScrollAreaRepository {
    private static instance: SideScrollAreaRepositoryImpl;
    private area: SideScrollArea | null;

    private readonly AREA_WIDTH: number = 0.255
    private readonly AREA_HEIGHT: number = 0.735
    private readonly POSITION_X: number = 0.3895
    private readonly POSITION_Y: number = 0.04

    private constructor() {
        this.area = null;
    }

    public static getInstance(): SideScrollAreaRepositoryImpl {
        if (!SideScrollAreaRepositoryImpl.instance) {
            SideScrollAreaRepositoryImpl.instance = new SideScrollAreaRepositoryImpl();
        }
        return SideScrollAreaRepositoryImpl.instance;
    }

    public async createSideScrollArea(
        id: string,
    ): Promise<SideScrollArea> {

        const areaWidth = this.AREA_WIDTH * window.innerWidth;
        const areaHeight = this.AREA_HEIGHT * window.innerHeight;

        const positionX = this.POSITION_X * window.innerWidth;
        const positionY = this.POSITION_Y * window.innerHeight;
        const position = new THREE.Vector2(positionX, positionY);

        const area = new TransparentRectangle(position, areaWidth, areaHeight, 0x000000, 0.2, id);
        const areaMesh = area.getMesh();

        const newArea = new SideScrollArea(areaMesh, position);
        this.area = newArea;

        return newArea;
    }


    public findArea(): SideScrollArea | null {
        return this.area;
    }

    public deleteArea(): void {
        this.area = null;
    }
}
