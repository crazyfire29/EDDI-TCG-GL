import * as THREE from "three";

import {SideScrollService} from "./SideScrollService";
import {SideScrollRepositoryImpl} from "../repository/SideScrollRepositoryImpl";

import {SideScrollArea} from "../../side_scroll_area/entity/SideScrollArea";
import {SideScrollAreaRepositoryImpl} from "../../side_scroll_area/repository/SideScrollAreaRepositoryImpl";
import {SelectedCardBlockRepositoryImpl} from "../../selected_card_block/repository/SelectedCardBlockRepositoryImpl";
import {SideScrollAreaDetectRepositoryImpl} from "../../side_scroll_area_detect/repository/SideScrollAreaDetectRepositoryImpl";
import {SelectedCardBlockPositionRepositoryImpl} from "../../selected_card_block_position/repository/SelectedCardBlockPositionRepositoryImpl";
import {SelectedCardBlockPosition} from "../../selected_card_block_position/entity/SelectedCardBlockPosition";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

export class SideScrollServiceImpl implements SideScrollService {
    private static instance: SideScrollServiceImpl | null = null;
    private sideScrollRepository: SideScrollRepositoryImpl;
    private sideScrollAreaRepository: SideScrollAreaRepositoryImpl;
    private selectedCardBlockRepository: SelectedCardBlockRepositoryImpl;
    private sideScrollAreaDetectRepository: SideScrollAreaDetectRepositoryImpl;
    private selectedCardBlockPositionRepository: SelectedCardBlockPositionRepositoryImpl;
    private isFirstScroll: boolean = true;

    private renderer: THREE.WebGLRenderer;
    private cameraRepository: CameraRepository;

    private constructor(camera: THREE.Camera, scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
        this.renderer = renderer;
        this.cameraRepository = CameraRepositoryImpl.getInstance();
        this.sideScrollRepository = SideScrollRepositoryImpl.getInstance(renderer);
        this.sideScrollAreaRepository = SideScrollAreaRepositoryImpl.getInstance();
        this.selectedCardBlockRepository = SelectedCardBlockRepositoryImpl.getInstance();
        this.sideScrollAreaDetectRepository = SideScrollAreaDetectRepositoryImpl.getInstance();
        this.selectedCardBlockPositionRepository = SelectedCardBlockPositionRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene, renderer: THREE.WebGLRenderer): SideScrollServiceImpl {
        if (!SideScrollServiceImpl.instance) {
            SideScrollServiceImpl.instance = new SideScrollServiceImpl(camera, scene, renderer);
        }
        return SideScrollServiceImpl.instance;
    }

    public async onWheelScroll(event: WheelEvent): Promise<void> {
        const totalBlockCounts = this.getBlockCount();
        const scrollTarget = this.getAllBlockGroups();
        console.log("Scroll Target Group:", scrollTarget);
        console.log("Scroll Target Children Count:", scrollTarget.children.length);
        const sideScrollArea = this.getSideScrollArea();

        if (!scrollTarget || !sideScrollArea) return;

        const blockPositions = this.getAllBlockPosition().map(pos => pos.getY());
        console.log(`Block Position? ${blockPositions}`);

        console.log(`Before Scroll- scrollTarget.position: ${scrollTarget.position.y}`);

        if (this.getScrollEnabled() === true) {
            event.preventDefault(); // 기본 스크롤 방지

            const scrollSpeed = 0.02;
            scrollTarget.position.y += event.deltaY * scrollSpeed;

            const maxScroll = 0.0706 * window.innerHeight * (totalBlockCounts - 2);
            const lowerLimit = 0.0706 * window.innerHeight * (totalBlockCounts - 10); // 보이지 않는 블록들이 차지하는 전체 높이
            const upperLimit = 0;
            console.log(`upperLimit: ${upperLimit}`); // 최대로 올릴 수 있는 범위
            console.log(`lowerLimit: ${lowerLimit}`); // 최대로 내릴 수 있는 범위

            scrollTarget.position.y = Math.max(Math.min(scrollTarget.position.y, lowerLimit), upperLimit);
            console.log('After Scroll- scrollTarget.position.y', scrollTarget.position.y);

            // 스크롤할 때 클리핑 업데이트
//             this.setClippingPlanes(sideScrollArea);
        }
    }

    public setClippingPlanes(sideScrollArea: SideScrollArea): THREE.Plane[] {
        return this.sideScrollRepository.setClippingPlanes(sideScrollArea);
    }

    private getAllBlockGroups(): THREE.Group {
        return this.selectedCardBlockRepository.findAllBlockGroups();
    }

    public getBlockCount(): number {
        return this.selectedCardBlockRepository.blockCount();
    }

    public getSideScrollArea(): SideScrollArea | null {
        return this.sideScrollAreaRepository.findArea();
    }

    public getScrollEnabled(): boolean {
        return this.sideScrollAreaDetectRepository.findScrollEnabled();
    }

    private getAllBlockPosition(): SelectedCardBlockPosition[] {
        return this.selectedCardBlockPositionRepository.findAllPosition();
    }

}
