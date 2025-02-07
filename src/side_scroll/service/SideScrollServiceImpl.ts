import * as THREE from "three";

import {SideScrollService} from "./SideScrollService";
import {SideScrollArea} from "../../side_scroll_area/entity/SideScrollArea";
import {SideScrollAreaRepositoryImpl} from "../../side_scroll_area/repository/SideScrollAreaRepositoryImpl";
import {SideScrollRepositoryImpl} from "../repository/SideScrollRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

export class SideScrollServiceImpl implements SideScrollService {
    private static instance: SideScrollServiceImpl | null = null;
    private sideScrollRepository: SideScrollRepositoryImpl;
    private sideScrollAreaRepository: SideScrollAreaRepositoryImpl;

    private cameraRepository: CameraRepository;
    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.sideScrollRepository = SideScrollRepositoryImpl.getInstance();
        this.sideScrollAreaRepository = SideScrollAreaRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): SideScrollServiceImpl {
        if (!SideScrollServiceImpl.instance) {
            SideScrollServiceImpl.instance = new SideScrollServiceImpl(camera, scene);
        }
        return SideScrollServiceImpl.instance;
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
        const detectSideScrollArea = this.sideScrollRepository.isSideScrollAreaDetect(
            { x, y },
            sideScrollArea,
            this.camera
        );

        if (detectSideScrollArea) {
//             console.log(`Detect Side Scroll Area!`);

            return detectSideScrollArea;
        }
        return null;
    }

    public async onMouseMove(event: MouseEvent): Promise<void> {
        if (event.button === 0) {
            const detectPoint = { x: event.clientX, y: event.clientY };
            await this.detectSideScrollArea(detectPoint);
        }
    }

    private getSideScrollArea(): SideScrollArea | null {
        return this.sideScrollAreaRepository.findArea();
    }

}
