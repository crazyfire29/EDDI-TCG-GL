import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

import {SideScrollAreaService} from './SideScrollAreaService';
import {SideScrollArea} from "../entity/SideScrollArea";
import {SideScrollAreaRepositoryImpl} from "../repository/SideScrollAreaRepositoryImpl";

export class SideScrollAreaServiceImpl implements SideScrollAreaService {
    private static instance: SideScrollAreaServiceImpl;
    private sideScrollAreaRepository: SideScrollAreaRepositoryImpl;

    private constructor() {
        this.sideScrollAreaRepository = SideScrollAreaRepositoryImpl.getInstance();
    }

    public static getInstance(): SideScrollAreaServiceImpl {
        if (!SideScrollAreaServiceImpl.instance) {
            SideScrollAreaServiceImpl.instance = new SideScrollAreaServiceImpl();
        }
        return SideScrollAreaServiceImpl.instance;
    }

    public async createSideScrollArea(): Promise<THREE.Mesh | null> {
        const area = await this.sideScrollAreaRepository.createSideScrollArea('sideScrollArea');
        const areaMesh = area.getMesh();

        return areaMesh;
    }

    public adjustSideScrollAreaPosition(): void {
        const area = this.getSideScrollArea();
        if (!area) {
            console.error("DeckMakeButton is null. Cannot adjust position.");
            return;
        }

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const areaMesh = area.getMesh();
        const initialPosition = area.position;

        const areaWidth = 0.255 * windowWidth;
        const areaHeight = 0.735 * windowHeight;

        const newPositionX = 0.3895 * windowWidth;
        const newPositionY = 0.04 * windowHeight;

        areaMesh.geometry.dispose();
        areaMesh.geometry = new THREE.PlaneGeometry(areaWidth, areaHeight);

        areaMesh.position.set(newPositionX, newPositionY, 0);

    }

    public getSideScrollArea(): SideScrollArea | null {
        return this.sideScrollAreaRepository.findArea();
    }

    public deleteSideScrollArea(): void {
        this.sideScrollAreaRepository.deleteArea();
    }

}
