import * as THREE from "three";

import {PageMovementButtonClickDetectService} from "./PageMovementButtonClickDetectService";
import {CardPageMovementButton} from "../../make_deck_card_page_movement_button/entity/CardPageMovementButton";
import {CardPageMovementButtonRepositoryImpl} from "../../make_deck_card_page_movement_button/repository/CardPageMovementButtonRepositoryImpl";
import {PageMovementButtonClickDetectRepositoryImpl} from "../repository/PageMovementButtonClickDetectRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

export class PageMovementButtonClickDetectServiceImpl implements PageMovementButtonClickDetectService {
    private static instance: PageMovementButtonClickDetectServiceImpl | null = null;

    private cardPageMovementButtonRepository: CardPageMovementButtonRepositoryImpl;
    private pageMovementButtonClickDetectRepository: PageMovementButtonClickDetectRepositoryImpl;

    private cameraRepository: CameraRepository
    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.cardPageMovementButtonRepository = CardPageMovementButtonRepositoryImpl.getInstance();
        this.pageMovementButtonClickDetectRepository = PageMovementButtonClickDetectRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): PageMovementButtonClickDetectServiceImpl {
        if (!PageMovementButtonClickDetectServiceImpl.instance) {
            PageMovementButtonClickDetectServiceImpl.instance = new PageMovementButtonClickDetectServiceImpl(camera, scene);
        }
        return PageMovementButtonClickDetectServiceImpl.instance;
    }

    setLeftMouseDown(state: boolean): void {
        this.leftMouseDown = state;
    }

    isLeftMouseDown(): boolean {
        return this.leftMouseDown;
    }

    async handleLeftClick(clickPoint: { x: number; y: number }): Promise<CardPageMovementButton | null> {
        const { x, y } = clickPoint;
        const cardPageMovementButtonList = this.getAllCardPageMovementButtons();
        const clickedPageMovementButton = this.pageMovementButtonClickDetectRepository.isPageMovementButtonClicked(
            { x, y },
            cardPageMovementButtonList,
            this.camera
        );

        if (clickedPageMovementButton) {
            this.saveCurrentClickedCardPageMovementButtonId(clickedPageMovementButton.id);
            const currentClickedButtonId = this.getCurrentClickedCardPageMovementButtonId();

            switch(currentClickedButtonId) {
                case 0:
                    console.log(`Clicked Prev Button!: ${currentClickedButtonId}`);
                    break;
                case 1:
                    console.log(`Clicked Next Button!: ${currentClickedButtonId}`);
                    break;
                default:
                    console.warn(`[WARN] Not Found Page Movement Button Id: ${currentClickedButtonId}`);
            }

            return clickedPageMovementButton;
        }

        return null;
    }


    public async onMouseDown(event: MouseEvent): Promise<CardPageMovementButton | null> {
        if (event.button === 0) {
            const clickPoint = { x: event.clientX, y: event.clientY };
            return await this.handleLeftClick(clickPoint);
        }
        return null;
    }

    private getAllCardPageMovementButtons(): CardPageMovementButton[] {
        return this.cardPageMovementButtonRepository.findAll();
    }

    private saveCurrentClickedCardPageMovementButtonId(buttonId: number): void {
        this.pageMovementButtonClickDetectRepository.saveCurrentClickedPageMovementButtonId(buttonId);
    }

    private getCurrentClickedCardPageMovementButtonId(): number | null {
        return this.pageMovementButtonClickDetectRepository.findCurrentClickedPageMovementButtonId();
    }

}
