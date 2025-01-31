import * as THREE from "three";

import {RightClickDetectService} from "./RightClickDetectService";
import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

export class RightClickDetectServiceImpl implements RightClickDetectService {
    private static instance: RightClickDetectServiceImpl | null = null;

    private cameraRepository: CameraRepository

    private rightMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera) {
        this.cameraRepository = CameraRepositoryImpl.getInstance()
    }

    static getInstance(camera: THREE.Camera): RightClickDetectServiceImpl {
        if (!RightClickDetectServiceImpl.instance) {
            RightClickDetectServiceImpl.instance = new RightClickDetectServiceImpl(camera);
        }
        return RightClickDetectServiceImpl.instance;
    }

    handleRightClick(clickPoint: { x: number; y: number }): any {
        console.log(`handleRightClick: (${clickPoint})`)
    }

    setRightMouseDown(state: boolean): void {
        this.rightMouseDown = state;
    }

    isRightMouseDown(): boolean {
        return this.rightMouseDown;
    }
}
