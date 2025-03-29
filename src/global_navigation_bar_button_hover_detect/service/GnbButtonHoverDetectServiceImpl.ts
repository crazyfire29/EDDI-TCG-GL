import * as THREE from "three";
import {getCardById} from "../../card/utility";

import {GnbButtonHoverDetectService} from "./GnbButtonHoverDetectService";
import {GnbButtonHoverDetectRepositoryImpl} from "../repository/GnbButtonHoverDetectRepositoryImpl";

import {GlobalNavigationBar} from "../../global_navigation_bar/entity/GlobalNavigationBar";
import {GlobalNavigationBarRepositoryImpl} from "../../global_navigation_bar/repository/GlobalNavigationBarRepositoryImpl";
import {GlobalNavigationBarStateManager} from "../../global_navigation_bar_manager/GlobalNavigationBarStateManager";
import {GlobalNavigationBarEffectStateManager} from "../../global_navigation_bar_manager/GlobalNavigationBarEffectStateManager";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

export class GnbButtonHoverDetectServiceImpl implements GnbButtonHoverDetectService {
    private static instance: GnbButtonHoverDetectServiceImpl | null = null;
    private gnbButtonHoverDetectRepository: GnbButtonHoverDetectRepositoryImpl;
    private gnbButtonRepository: GlobalNavigationBarRepositoryImpl;
    private gnbButtonStateManager: GlobalNavigationBarStateManager;
    private gnbButtonEffectStateManager: GlobalNavigationBarEffectStateManager;
    private cameraRepository: CameraRepository;
    private buttonDetectState: boolean = true;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.cameraRepository = CameraRepositoryImpl.getInstance();
        this.gnbButtonHoverDetectRepository = GnbButtonHoverDetectRepositoryImpl.getInstance();
        this.gnbButtonRepository = GlobalNavigationBarRepositoryImpl.getInstance();
        this.gnbButtonStateManager = GlobalNavigationBarStateManager.getInstance();
        this.gnbButtonEffectStateManager = GlobalNavigationBarEffectStateManager.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): GnbButtonHoverDetectServiceImpl {
        if (!GnbButtonHoverDetectServiceImpl.instance) {
            GnbButtonHoverDetectServiceImpl.instance = new GnbButtonHoverDetectServiceImpl(camera, scene);
        }
        return GnbButtonHoverDetectServiceImpl.instance;
    }

    setButtonHoverDetectState(state: boolean): void {
        this.buttonDetectState = state;
    }

    getButtonHoverDetectState(): boolean {
        return this.buttonDetectState;
    }

    async handleHover(hoverPoint: { x: number; y: number }): Promise<GlobalNavigationBar | null> {
        const { x, y } = hoverPoint;
        const buttonList = this.getGnbButtonList();
        const hoveredButton = this.gnbButtonHoverDetectRepository.isGnbButtonHover(
            { x, y },
            buttonList,
            this.camera
        );

        if (hoveredButton) {
            console.log(`[DEBUG] Hovered Button Unique Id: ${hoveredButton.id}`);
            this.saveCurrentHoveredButtonId(hoveredButton.id);

            const currentHoveredButtonId = this.getCurrentHoveredButtonId();

            const hiddenButton = buttonList.find(
                (button) => this.getGnbButtonVisibility(button.id) == false
            );

            if (currentHoveredButtonId !== null && currentHoveredButtonId !== 2) {
                this.setButtonVisibility(currentHoveredButtonId, false);
                this.setButtonEffectVisibility(currentHoveredButtonId, true);
            }

            if (hiddenButton && hiddenButton.id !== currentHoveredButtonId && hiddenButton.id !== 2) {
                this.setButtonVisibility(hiddenButton.id, true);
                this.setButtonEffectVisibility(hiddenButton.id, false);
            }
            return hoveredButton;

        } else {
            const allButtonIdList = this.getAllButtonIdList();
            allButtonIdList.forEach((buttonId) => {
                if (buttonId !== 2) {
                    this.setButtonVisibility(buttonId, true);
                    this.setButtonEffectVisibility(buttonId, false);
                }
            });
        }
        return null;
    }

    public async onMouseMove(event: MouseEvent): Promise<GlobalNavigationBar | null> {
        if (event.button === 0) {
            const hoverPoint = { x: event.clientX, y: event.clientY };
            return await this.handleHover(hoverPoint);
        }
        return null;
    }

    public getGnbButtonList(): GlobalNavigationBar[] {
        return this.gnbButtonRepository.findAllButton();
    }

    public saveCurrentHoveredButtonId(buttonId: number): void {
        this.gnbButtonHoverDetectRepository.saveCurrentHoveredButtonId(buttonId);
    }

    public getCurrentHoveredButtonId(): number | null {
        return this.gnbButtonHoverDetectRepository.findCurrentHoveredButtonId();
    }

    private getGnbButtonVisibility(buttonId: number): boolean {
        return this.gnbButtonStateManager.findVisibility(buttonId);
    }

    private setButtonVisibility(buttonId: number, isVisible: boolean): void {
        this.gnbButtonStateManager.setVisibility(buttonId, isVisible);
    }

    private setButtonEffectVisibility(effectId: number, isVisible: boolean): void {
        this.gnbButtonEffectStateManager.setVisibility(effectId, isVisible);
    }

    private getAllButtonIdList(): number[] {
        return this.gnbButtonRepository.findAllButtonIdList();
    }

}
