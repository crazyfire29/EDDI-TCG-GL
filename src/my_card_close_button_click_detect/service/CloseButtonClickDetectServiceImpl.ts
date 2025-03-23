import * as THREE from "three";

import {CloseButtonClickDetectService} from "./CloseButtonClickDetectService";
import {CloseButtonClickDetectRepositoryImpl} from "../repository/CloseButtonClickDetectRepositoryImpl";
import {MyCardCloseButton} from "../../my_card_close_button/entity/MyCardCloseButton";
import {MyCardCloseButtonRepositoryImpl} from "../../my_card_close_button/repository/MyCardCloseButtonRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

export class CloseButtonClickDetectServiceImpl implements CloseButtonClickDetectService {
    private static instance: CloseButtonClickDetectServiceImpl | null = null;
    private closeButtonClickDetectRepository: CloseButtonClickDetectRepositoryImpl;
    private myCardCloseButtonRepository: MyCardCloseButtonRepositoryImpl;
    private cameraRepository: CameraRepository;

    private hasCloseButtonBeenClicked: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.closeButtonClickDetectRepository = CloseButtonClickDetectRepositoryImpl.getInstance();
        this.myCardCloseButtonRepository = MyCardCloseButtonRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): CloseButtonClickDetectServiceImpl {
        if (!CloseButtonClickDetectServiceImpl.instance) {
            CloseButtonClickDetectServiceImpl.instance = new CloseButtonClickDetectServiceImpl(camera, scene);
        }
        return CloseButtonClickDetectServiceImpl.instance;
    }

    public setCloseButtonClickState(state: boolean): void {
        this.hasCloseButtonBeenClicked = state;
    }

    public getCloseButtonClickState(): boolean {
        return this.hasCloseButtonBeenClicked;
    }

    public async handleCloseButtonClickEvent(clickPoint: { x: number; y: number }): Promise<MyCardCloseButton | null> {
        const { x, y } = clickPoint;
        const button = this.getCloseButton();
        if (button !== null) {
            const clickedButton = this.closeButtonClickDetectRepository.isCloseButtonClicked(
                { x, y },
                button,
                this.camera);

            if (clickedButton) {
                console.log(`!!![DEBUG] Clicked Close Button ID: ${clickedButton.id}`);
                return clickedButton;
            }
        }
        return null;
    }

    public async onMouseDown(event: MouseEvent): Promise<MyCardCloseButton | null> {
        if (event.button === 0) {
            const clickPoint = { x: event.clientX, y: event.clientY };
            return await this.handleCloseButtonClickEvent(clickPoint);
        }
        return null;
    }

    private getCloseButton(): MyCardCloseButton | null {
        return this.myCardCloseButtonRepository.findButtonById(0);
    }

}
