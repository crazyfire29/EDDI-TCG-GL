import * as THREE from "three";

import {RaceButtonClickDetectService} from "./RaceButtonClickDetectService";
import {RaceButton} from "../../race_button/entity/RaceButton";
import {RaceButtonRepository} from "../../race_button/repository/RaceButtonRepository";
import {RaceButtonRepositoryImpl} from "../../race_button/repository/RaceButtonRepositoryImpl";

import {RaceButtonClickDetectRepository} from "../repository/RaceButtonClickDetectRepository";
import {RaceButtonClickDetectRepositoryImpl} from "../repository/RaceButtonClickDetectRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

import {RaceButtonStateManager} from "../../race_button_manager/RaceButtonStateManager";
import {RaceButtonEffectStateManager} from "../../race_button_manager/RaceButtonEffectStateManager";

export class RaceButtonClickDetectServiceImpl implements RaceButtonClickDetectService {
    private static instance: RaceButtonClickDetectServiceImpl | null = null;

    private raceButtonRepository: RaceButtonRepositoryImpl;
    private raceButtonClickDetectRepository: RaceButtonClickDetectRepositoryImpl;

    private raceButtonStateManager: RaceButtonStateManager;
    private raceButtonEffectStateManager: RaceButtonEffectStateManager;

    private cameraRepository: CameraRepository
    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.raceButtonRepository = RaceButtonRepositoryImpl.getInstance();
        this.raceButtonClickDetectRepository = RaceButtonClickDetectRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();

        this.raceButtonStateManager = RaceButtonStateManager.getInstance();
        this.raceButtonEffectStateManager = RaceButtonEffectStateManager.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): RaceButtonClickDetectServiceImpl {
        if (!RaceButtonClickDetectServiceImpl.instance) {
            RaceButtonClickDetectServiceImpl.instance = new RaceButtonClickDetectServiceImpl(camera, scene);
        }
        return RaceButtonClickDetectServiceImpl.instance;
    }

    setLeftMouseDown(state: boolean): void {
        this.leftMouseDown = state;
    }

    isLeftMouseDown(): boolean {
        return this.leftMouseDown;
    }

    async handleLeftClick(clickPoint: { x: number; y: number }): Promise<RaceButton | null> {
        const { x, y } = clickPoint;
        const raceButtonList = this.getAllRaceButtons();
        const clickedRaceButton = this.raceButtonClickDetectRepository.isDeckRaceButtonClicked(
            { x, y },
            raceButtonList,
            this.camera
        );

        if (clickedRaceButton) {
            console.log(`[DEBUG] Clicked Race Button ID: ${clickedRaceButton.id}`);
            this.saveCurrentClickedRaceButtonId(clickedRaceButton.id);
            const currentClickedButtonId = this.getCurrentClickedRaceButtonId();

            const hiddenButton = raceButtonList.find(
                (button) => this.getRaceButtonVisibility(button.id) == false
            );

            if (hiddenButton && hiddenButton.id !== currentClickedButtonId) {
                this.setRaceButtonVisibility(hiddenButton.id, true);
                this.setRaceButtonEffectVisibility(hiddenButton.id, false);
            }

            if (currentClickedButtonId !== null) {
                this.setRaceButtonVisibility(currentClickedButtonId, false);
                this.setRaceButtonEffectVisibility(currentClickedButtonId, true);
            }

//             switch(currentClickedButtonId) {
//                 case 0:
//                     console.log(`Clicked Human Button!: ${currentClickedButtonId}`);
//                     break;
//                 case 1:
//                     console.log(`Clicked Undead Button!: ${currentClickedButtonId}`);
//                     break;
//                 case 2:
//                     console.log(`Clicked Trent Button! ${currentClickedButtonId}`);
//                     break;
//                 default:
//                     console.warn(`[WARN] Not Found Race Button Id: ${currentClickedButtonId}`);
//             }

            return clickedRaceButton;
        }

        return null;
    }


    public async onMouseDown(event: MouseEvent): Promise<RaceButton | null> {
        if (event.button === 0) {
            const clickPoint = { x: event.clientX, y: event.clientY };
            return await this.handleLeftClick(clickPoint);
        }
        return null;
    }

    public getAllRaceButtons(): RaceButton[] {
        return this.raceButtonRepository.findAll();
    }

    public saveCurrentClickedRaceButtonId(buttonId: number): void {
        this.raceButtonClickDetectRepository.saveCurrentClickedRaceButtonId(buttonId);
    }

    public getCurrentClickedRaceButtonId(): number | null {
        return this.raceButtonClickDetectRepository.findCurrentClickedRaceButtonId();
    }

    public setRaceButtonVisibility(buttonId: number, isVisible: boolean): void {
        this.raceButtonStateManager.setVisibility(buttonId, isVisible);
    }

    public getRaceButtonVisibility(buttonId: number): boolean {
        return this.raceButtonStateManager.findVisibility(buttonId);
    }

    public setRaceButtonEffectVisibility(effectId: number, isVisible: boolean): void {
        this.raceButtonEffectStateManager.setVisibility(effectId, isVisible);
    }

}
