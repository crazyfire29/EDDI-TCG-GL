import * as THREE from "three";

import {SideScrollService} from "./SideScrollService";
import {SideScrollRepositoryImpl} from "../repository/SideScrollRepositoryImpl";

import {SideScrollArea} from "../../side_scroll_area/entity/SideScrollArea";
import {SideScrollAreaRepositoryImpl} from "../../side_scroll_area/repository/SideScrollAreaRepositoryImpl";
import {SelectedCardBlockRepositoryImpl} from "../../selected_card_block/repository/SelectedCardBlockRepositoryImpl";
import {SideScrollAreaDetectRepositoryImpl} from "../../side_scroll_area_detect/repository/SideScrollAreaDetectRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

export class SideScrollServiceImpl implements SideScrollService {
    private static instance: SideScrollServiceImpl | null = null;
    private sideScrollRepository: SideScrollRepositoryImpl;
    private sideScrollAreaRepository: SideScrollAreaRepositoryImpl;
    private selectedCardBlockRepository: SelectedCardBlockRepositoryImpl;
    private sideScrollAreaDetectRepository: SideScrollAreaDetectRepositoryImpl;

    private renderer: THREE.WebGLRenderer;
    private cameraRepository: CameraRepository;

    private constructor(camera: THREE.Camera, scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
        this.renderer = renderer;
        this.cameraRepository = CameraRepositoryImpl.getInstance();
        this.sideScrollRepository = SideScrollRepositoryImpl.getInstance(renderer);
        this.sideScrollAreaRepository = SideScrollAreaRepositoryImpl.getInstance();
        this.selectedCardBlockRepository = SelectedCardBlockRepositoryImpl.getInstance();
        this.sideScrollAreaDetectRepository = SideScrollAreaDetectRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene, renderer: THREE.WebGLRenderer): SideScrollServiceImpl {
        if (!SideScrollServiceImpl.instance) {
            SideScrollServiceImpl.instance = new SideScrollServiceImpl(camera, scene, renderer);
        }
        return SideScrollServiceImpl.instance;
    }

    public async onWheelScroll(event: WheelEvent): Promise<void> {
        if (this.getScrollEnabled() === true && this.getBlockCount() > 9) {
            const scrollTarget = this.getAllBlockGroups();
            const sideScrollArea = this.getSideScrollArea();

            if (!scrollTarget || !sideScrollArea) return;

            event.preventDefault(); // 기본 스크롤 방지

            const scrollSpeed = 0.05;
            scrollTarget.position.y += event.deltaY * scrollSpeed;

            const totalBlockHeight = (this.getBlockCount() - 1) * (-0.0706);
            const areaTop = 0.36 * window.innerHeight;
            const areaBottom = 0.36 * window.innerHeight + totalBlockHeight;

            if (areaBottom == null) {
                return;
            }

            scrollTarget.position.y = Math.max(Math.min(scrollTarget.position.y, areaTop), areaBottom);

            // 스크롤할 때 클리핑 업데이트
            this.setClippingPlanes(sideScrollArea);
        }
    }

    public setClippingPlanes(sideScrollArea: SideScrollArea): THREE.Plane[] {
        return this.sideScrollRepository.setClippingPlanes(sideScrollArea);
    }

    private getAllBlockGroups(): THREE.Group {
        return this.selectedCardBlockRepository.findAllBlockGroups() || new THREE.Group();
    }

    private getBlockCount(): number {
        return this.selectedCardBlockRepository.blockCount();
    }

    public getSideScrollArea(): SideScrollArea | null {
        return this.sideScrollAreaRepository.findArea();
    }

    public getScrollEnabled(): boolean {
        return this.sideScrollAreaDetectRepository.findScrollEnabled();
    }
}
