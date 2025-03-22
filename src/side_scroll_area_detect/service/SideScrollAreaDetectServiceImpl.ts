import * as THREE from "three";

import {SideScrollAreaDetectService} from "./SideScrollAreaDetectService";
import {SideScrollArea} from "../../side_scroll_area/entity/SideScrollArea";
import {SideScrollAreaRepositoryImpl} from "../../side_scroll_area/repository/SideScrollAreaRepositoryImpl";
import {SideScrollAreaDetectRepositoryImpl} from "../repository/SideScrollAreaDetectRepositoryImpl";
import {SelectedCardBlockRepositoryImpl} from "../../selected_card_block/repository/SelectedCardBlockRepositoryImpl";
import {SideScrollAreaType} from "../../side_scroll_area/entity/SideScrollAreaType";

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

    async detectMakeDeckSideScrollArea(detectPoint: { x: number; y: number }): Promise<SideScrollArea | null> {
        const { x, y } = detectPoint;
        const sideScrollArea = this.getSideScrollAreasByType(1);
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
            console.log(`[DEBUG] Detected Side Scroll Area ID: ${detectSideScrollArea.id}`);

            if (detectSideScrollArea.id == 0) {
                this.setMakeDeckScrollEnabled(detectSideScrollArea.id, true);

                return detectSideScrollArea;

            } else {
                this.setMakeDeckScrollEnabled(detectSideScrollArea.id, false);
            }

        }

        return null;
    }

    async detectMyCardSideScrollArea(detectPoint: { x: number; y: number }): Promise<SideScrollArea | null> {
        const { x, y } = detectPoint;
        const sideScrollArea = this.getSideScrollAreasByType(2);
        if (sideScrollArea == null) {
            console.error("[ERROR]Side Scroll Area is null.");
            return null;
        }

        const detectSideScrollArea = this.sideScrollAreaDetectRepository.isSideScrollAreaDetect(
            { x, y },
            sideScrollArea,
            this.camera
        );

        if (detectSideScrollArea) {
            console.log(`[DEBUG] Detected Side Scroll Area`);
            this.setMyCardScrollEnabled(true);

        } else {
            console.log(`No Detected Side Scroll Area`);
            this.setMyCardScrollEnabled(false);
        }

        return null;
    }

    // To-do: 메서드명 변경 필요
    public async onMouseMove(event: MouseEvent): Promise<void> {
        if (event.button === 0) {
            const detectPoint = { x: event.clientX, y: event.clientY };
            await this.detectMakeDeckSideScrollArea(detectPoint);
        }
    }

    // To-do: 메서드명 변경 필요
    public async onMouseMoveMyCard(event: MouseEvent): Promise<void> {
        if (event.button === 0) {
            const detectPoint = { x: event.clientX, y: event.clientY };
            await this.detectMyCardSideScrollArea(detectPoint);
        }
    }

    public setScrollEnabled(enable: boolean): void {
        this.sideScrollAreaDetectRepository.setScrollEnabled(enable);
    }

    public setMakeDeckScrollEnabled(areaId: number, enable: boolean): void {
        this.sideScrollAreaDetectRepository.setMakeDeckScrollEnabled(areaId, enable);
    }

    public getScrollEnabled(): boolean {
        return this.sideScrollAreaDetectRepository.findScrollEnabled();
    }

    public getMakeDeckScrollEnabledById(areaId: number): boolean {
        return this.sideScrollAreaDetectRepository.findMakeDeckScrollEnabledById(areaId);
    }

    private getSideScrollAreasByType(type: SideScrollAreaType): SideScrollArea[] | null {
        return this.sideScrollAreaRepository.findAreasByType(type);
    }

    public setMyCardScrollEnabled(enable: boolean): void {
        this.sideScrollAreaDetectRepository.setMyCardScrollEnabled(enable);
    }

    public getMyCardScrollEnabled(): boolean {
        return this.sideScrollAreaDetectRepository.findMyCardScrollEnabled();
    }

}
