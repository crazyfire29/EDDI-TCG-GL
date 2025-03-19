import * as THREE from "three";

import {MakeDeckScreenDoneButtonClickDetectService} from "./MakeDeckScreenDoneButtonClickDetectService";
import {MakeDeckScreenDoneButtonClickDetectRepositoryImpl} from "../repository/MakeDeckScreenDoneButtonClickDetectRepositoryImpl";
import {MakeDeckScreenDoneButton} from "../../make_deck_screen_done_button/entity/MakeDeckScreenDoneButton";
import {MakeDeckScreenDoneButtonRepositoryImpl} from "../../make_deck_screen_done_button/repository/MakeDeckScreenDoneButtonRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

export class MakeDeckScreenDoneButtonClickDetectServiceImpl implements MakeDeckScreenDoneButtonClickDetectService {
    private static instance: MakeDeckScreenDoneButtonClickDetectServiceImpl | null = null;
    private makeDeckScreenDoneButtonClickDetectRepository: MakeDeckScreenDoneButtonClickDetectRepositoryImpl;
    private makeDeckScreenDoneButtonRepository: MakeDeckScreenDoneButtonRepositoryImpl;
    private cameraRepository: CameraRepository;
    private leftMouseDown: boolean = false;
    private deactivationButtonClickState: boolean = true;
    private activationDoneButtonClickState: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.makeDeckScreenDoneButtonClickDetectRepository = MakeDeckScreenDoneButtonClickDetectRepositoryImpl.getInstance();
        this.makeDeckScreenDoneButtonRepository = MakeDeckScreenDoneButtonRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();

    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): MakeDeckScreenDoneButtonClickDetectServiceImpl {
        if (!MakeDeckScreenDoneButtonClickDetectServiceImpl.instance) {
            MakeDeckScreenDoneButtonClickDetectServiceImpl.instance = new MakeDeckScreenDoneButtonClickDetectServiceImpl(camera, scene);
        }
        return MakeDeckScreenDoneButtonClickDetectServiceImpl.instance;
    }

    setLeftMouseDown(state: boolean): void {
        this.leftMouseDown = state;
    }

    isLeftMouseDown(): boolean {
        return this.leftMouseDown;
    }

    setDeactivationButtonClick(state: boolean): void {
        this.deactivationButtonClickState = state;
    }

    isDeactivationButtonClick(): boolean {
        return this.deactivationButtonClickState;
    }

    setActivationButtonClick(state: boolean): void {
        this.activationDoneButtonClickState = state;
    }

    isActivationButtonClick(): boolean {
        return this.activationDoneButtonClickState;
    }

//     async handleLeftClick(clickPoint: { x: number; y: number }): Promise<MakeDeckScreenDoneButton | null> {
//         const { x, y } = clickPoint;
//         const buttonList = this.getAllDoneButtons();
//         const clickedButton = this.makeDeckScreenDoneButtonClickDetectRepository.isDoneButtonClicked(
//             { x, y },
//             buttonList,
//             this.camera
//         );
//
//         if (clickedButton) {
//             console.log(`[DEBUG] Clicked Done Button ID: ${clickedButton.id}`);
//             this.saveCurrentClickedDoneButtonId(clickedButton.id);
//
//             const currentClickedButtonId = this.getCurrentClickedDoneButtonId();
//
//             if (currentClickedButtonId == 0) {
//                 console.log(`Current Click Deactivation Done Button`);
//             }
//
//             if (currentClickedButtonId == 1) {
//                 console.log(`Current Click Activation Done Button`);
//             }
//
//             return clickedButton;
//         }
//
//         return null;
//     }

    public async deactivationDoneButtonClick(
        clickPoint: { x: number; y: number }): Promise<MakeDeckScreenDoneButton | null> {
            const { x, y } = clickPoint;
            const button = this.getDeactivationButton();
            if (button !== null) {
                const clickedButton = this.makeDeckScreenDoneButtonClickDetectRepository.isDoneButtonClicked(
                    { x, y },
                    button,
                    this.camera);

                if (clickedButton) {
                    console.log(`[DEBUG] Clicked Deactivation Done Button ID: ${clickedButton.id}`);
                    return clickedButton;
                }
            }
            return null;
    }

    public async activationDoneButtonClick(
        clickPoint: { x: number; y: number }): Promise<MakeDeckScreenDoneButton | null> {
            const { x, y } = clickPoint;
            const button = this.getActivationButton();
            if (button !== null) {
                const clickedButton = this.makeDeckScreenDoneButtonClickDetectRepository.isDoneButtonClicked(
                    { x, y },
                    button,
                    this.camera);

                if (clickedButton) {
                    console.log(`[DEBUG] Clicked Activation Done Button ID: ${clickedButton.id}`);
                    return clickedButton;
                }
            }
            return null;
    }


//     public async onMouseDown(event: MouseEvent): Promise<MakeDeckScreenDoneButton | null> {
//         if (event.button === 0) {
//             const clickPoint = { x: event.clientX, y: event.clientY };
//             return await this.handleLeftClick(clickPoint);
//         }
//         return null;
//     }

    public async onMouseDownForDeactivation(event: MouseEvent): Promise<MakeDeckScreenDoneButton | null> {
        if (event.button === 0) {
            const clickPoint = { x: event.clientX, y: event.clientY };
            return await this.deactivationDoneButtonClick(clickPoint);
        }
        return null;
    }

    public async onMouseDownForActivation(event: MouseEvent): Promise<MakeDeckScreenDoneButton | null> {
        if (event.button === 0) {
            const clickPoint = { x: event.clientX, y: event.clientY };
            return await this.activationDoneButtonClick(clickPoint);
        }
        return null;
    }

    private getAllDoneButtons(): MakeDeckScreenDoneButton[] {
        return this.makeDeckScreenDoneButtonRepository.findAll();
    }

    private getDeactivationButton(): MakeDeckScreenDoneButton | null {
        return this.makeDeckScreenDoneButtonRepository.findById(0);
    }

    private getActivationButton(): MakeDeckScreenDoneButton | null {
        return this.makeDeckScreenDoneButtonRepository.findById(1);
    }

    private saveCurrentClickedDoneButtonId(buttonId: number): void {
        this.makeDeckScreenDoneButtonClickDetectRepository.saveCurrentClickedDoneButtonId(buttonId);
    }

    private getCurrentClickedDoneButtonId(): number | null {
        return this.makeDeckScreenDoneButtonClickDetectRepository.findCurrentClickedDoneButtonId();
    }

}
