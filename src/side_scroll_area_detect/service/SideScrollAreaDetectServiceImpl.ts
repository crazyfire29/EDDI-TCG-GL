import * as THREE from "three";

import {SideScrollAreaDetectService} from "./SideScrollAreaDetectService";
import {SideScrollArea} from "../../side_scroll_area/entity/SideScrollArea";
import {SideScrollAreaRepositoryImpl} from "../../side_scroll_area/repository/SideScrollAreaRepositoryImpl";
import {SideScrollAreaDetectRepositoryImpl} from "../repository/SideScrollAreaDetectRepositoryImpl";
import {SelectedCardBlockRepositoryImpl} from "../../selected_card_block/repository/SelectedCardBlockRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

export class SideScrollAreaDetectServiceImpl implements SideScrollAreaDetectService {
    private static instance: SideScrollAreaDetectServiceImpl | null = null;
    private sideScrollAreaDetectRepository: SideScrollAreaDetectRepositoryImpl;
    private sideScrollAreaRepository: SideScrollAreaRepositoryImpl;
    private selectedCardBlockRepository: SelectedCardBlockRepositoryImpl;

    private cameraRepository: CameraRepository;
    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.sideScrollAreaDetectRepository = SideScrollAreaDetectRepositoryImpl.getInstance();
        this.sideScrollAreaRepository = SideScrollAreaRepositoryImpl.getInstance();
        this.selectedCardBlockRepository = SelectedCardBlockRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): SideScrollAreaDetectServiceImpl {
        if (!SideScrollAreaDetectServiceImpl.instance) {
            SideScrollAreaDetectServiceImpl.instance = new SideScrollAreaDetectServiceImpl(camera, scene);
        }
        return SideScrollAreaDetectServiceImpl.instance;
    }

    setLeftMouseDown(state: boolean): void {
        this.leftMouseDown = state;
    }

    isLeftMouseDown(): boolean {
        return this.leftMouseDown;
    }

    async detectSideScrollArea(detectPoint: { x: number; y: number }): Promise<SideScrollArea | null> {
        const { x, y } = detectPoint;
        const sideScrollArea = this.getSideScrollArea();
        if (sideScrollArea == null) {
            console.error("Side Scroll Area is null.");
            return null;
        }
        const detectSideScrollArea = this.sideScrollAreaDetectRepository.isSideScrollAreaDetect(
            { x, y },
            sideScrollArea,
            this.camera
        );

        if (detectSideScrollArea) {
            this.setScrollEnabled(true);
//             console.log(`Detect Side Scroll Area!`);

            return detectSideScrollArea;

        } else {
            this.setScrollEnabled(false);
        }

        return null;
    }

    public async onMouseMove(event: MouseEvent): Promise<void> {
        if (event.button === 0) {
            const detectPoint = { x: event.clientX, y: event.clientY };
            await this.detectSideScrollArea(detectPoint);
        }
    }

    public setScrollEnabled(enable: boolean): void {
        this.sideScrollAreaDetectRepository.setScrollEnabled(enable);
    }

    public getScrollEnabled(): boolean {
        return this.sideScrollAreaDetectRepository.findScrollEnabled();
    }

    private getSideScrollArea(): SideScrollArea | null {
        return this.sideScrollAreaRepository.findArea();
    }

}
