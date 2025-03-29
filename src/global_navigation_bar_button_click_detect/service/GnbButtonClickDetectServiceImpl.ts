import * as THREE from "three";
import {getCardById} from "../../card/utility";

import {GnbButtonClickDetectService} from "./GnbButtonClickDetectService";
import {GnbButtonClickDetectRepositoryImpl} from "../repository/GnbButtonClickDetectRepositoryImpl";
import {GlobalNavigationBar} from "../../global_navigation_bar/entity/GlobalNavigationBar";
import {GlobalNavigationBarRepositoryImpl} from "../../global_navigation_bar/repository/GlobalNavigationBarRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

export class GnbButtonClickDetectServiceImpl implements GnbButtonClickDetectService {
    private static instance: GnbButtonClickDetectServiceImpl | null = null;
    private gnbButtonClickDetectRepository: GnbButtonClickDetectRepositoryImpl;
    private gnbButtonRepository: GlobalNavigationBarRepositoryImpl;
    private cameraRepository: CameraRepository;
    private buttonClickState: boolean = true;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.cameraRepository = CameraRepositoryImpl.getInstance();
        this.gnbButtonClickDetectRepository = GnbButtonClickDetectRepositoryImpl.getInstance();
        this.gnbButtonRepository = GlobalNavigationBarRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): GnbButtonClickDetectServiceImpl {
        if (!GnbButtonClickDetectServiceImpl.instance) {
            GnbButtonClickDetectServiceImpl.instance = new GnbButtonClickDetectServiceImpl(camera, scene);
        }
        return GnbButtonClickDetectServiceImpl.instance;
    }

    public setButtonClickDetectState(state: boolean): void {
        this.buttonClickState = state;
    }

    public getButtonClickDetectState(): boolean {
        return this.buttonClickState;
    }

    async handleClick(clickPoint: { x: number; y: number }): Promise<GlobalNavigationBar | null> {
        const { x, y } = clickPoint;
        const buttonList = this.getGnbButtonList();
        const clickedButton = this.gnbButtonClickDetectRepository.isGnbButtonClicked(
            { x, y },
            buttonList,
            this.camera
        );

        if (clickedButton) {
            console.log(`[DEBUG] Clicked Button Unique Id: ${clickedButton.id}`);
            this.saveCurrentClickedButtonId(clickedButton.id);

            const currentClickedButtonId = this.getCurrentClickedButtonId();

            return clickedButton;

        }
        return null;
    }

    public async onMouseDown(event: MouseEvent): Promise<GlobalNavigationBar | null> {
        if (event.button === 0) {
            const hoverPoint = { x: event.clientX, y: event.clientY };
            return await this.handleClick(hoverPoint);
        }
        return null;
    }

    public getGnbButtonList(): GlobalNavigationBar[] {
        return this.gnbButtonRepository.findAllButton();
    }

    private saveCurrentClickedButtonId(buttonId: number): void {
        this.gnbButtonClickDetectRepository.saveCurrentClickedButtonId(buttonId);
    }

    private getCurrentClickedButtonId(): number | null {
        return this.gnbButtonClickDetectRepository.findCurrentClickedButtonId();
    }

    private getAllButtonIdList(): number[] {
        return this.gnbButtonRepository.findAllButtonIdList();
    }

}
