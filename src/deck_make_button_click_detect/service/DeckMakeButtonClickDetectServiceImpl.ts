import {DeckMakeButtonClickDetectService} from "./DeckMakeButtonClickDetectService";

import {DeckMakeButton} from "../../deck_make_button/entity/DeckMakeButton";
import {DeckMakeButtonRepositoryImpl} from "../../deck_make_button/repository/DeckMakeButtonRepositoryImpl";

import {DeckMakeButtonClickDetectRepository} from "../repository/DeckMakeButtonClickDetectRepository";
import {DeckMakeButtonClickDetectRepositoryImpl} from "../repository/DeckMakeButtonClickDetectRepositoryImpl";

import {TransparentBackground} from "../../transparent_background/entity/TransparentBackground";
import {TransparentBackgroundRepositoryImpl} from "../../transparent_background/repository/TransparentBackgroundRepositoryImpl";

import {DeckMakePopupBackground} from "../../deck_make_pop_up_background/entity/DeckMakePopupBackground";
import {DeckMakePopupBackgroundRepositoryImpl} from "../../deck_make_pop_up_background/repository/DeckMakePopupBackgroundRepositoryImpl";

import {DeckMakePopupButtonsRepositoryImpl} from "../../deck_make_pop_up_buttons/repository/DeckMakePopupButtonsRepositoryImpl";
import {DeckMakePopupInputContainerRepositoryImpl} from "../../deck_make_pop_up_input_container/repository/DeckMakePopupInputContainerRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

import * as THREE from "three";

export class DeckMakeButtonClickDetectServiceImpl implements DeckMakeButtonClickDetectService {
    private static instance: DeckMakeButtonClickDetectServiceImpl | null = null;
    private deckMakeButtonClickDetectRepository: DeckMakeButtonClickDetectRepositoryImpl;
    private deckMakeButtonRepository: DeckMakeButtonRepositoryImpl;
    private transparentBackgroundRepository: TransparentBackgroundRepositoryImpl;
    private deckMakePopupBackgroundRepository: DeckMakePopupBackgroundRepositoryImpl;
    private deckMakePopupButtonsRepository: DeckMakePopupButtonsRepositoryImpl;
    private deckMakePopupInputContainerRepository: DeckMakePopupInputContainerRepositoryImpl;

    private cameraRepository: CameraRepository;
    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.deckMakeButtonClickDetectRepository = DeckMakeButtonClickDetectRepositoryImpl.getInstance();
        this.deckMakeButtonRepository = DeckMakeButtonRepositoryImpl.getInstance();
        this.transparentBackgroundRepository = TransparentBackgroundRepositoryImpl.getInstance();
        this.deckMakePopupBackgroundRepository = DeckMakePopupBackgroundRepositoryImpl.getInstance();
        this.deckMakePopupButtonsRepository = DeckMakePopupButtonsRepositoryImpl.getInstance();
        this.deckMakePopupInputContainerRepository = DeckMakePopupInputContainerRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): DeckMakeButtonClickDetectServiceImpl {
        if (!DeckMakeButtonClickDetectServiceImpl.instance) {
            DeckMakeButtonClickDetectServiceImpl.instance = new DeckMakeButtonClickDetectServiceImpl(camera, scene);
        }
        return DeckMakeButtonClickDetectServiceImpl.instance;
    }

    setLeftMouseDown(state: boolean): void {
        this.leftMouseDown = state;
    }

    isLeftMouseDown(): boolean {
        return this.leftMouseDown;
    }

    async handleLeftClick(clickPoint: { x: number; y: number }): Promise<DeckMakeButton | null> {
        const { x, y } = clickPoint;
        const deckMakeButton = this.getDeckMakeButton();
        if (deckMakeButton == null) {
            console.error("DeckMakeButton is null.");
            return null;
        }
        const clickedDeckMakeButton = this.deckMakeButtonClickDetectRepository.isDeckMakeButtonClicked(
            { x, y },
            deckMakeButton,
            this.camera
        );

        if (clickedDeckMakeButton) {
            console.log(`Clicked Deck Make Button`);
            this.saveCurrentButtonClickState(clickedDeckMakeButton);
            this.setTransparentBackgroundVisible(true);
            this.setDeckMakePopupBackgroundVisible(true);
            this.setDeckMakePopupButtonsVisible(true);
            this.setDeckMakePopupInputContainerVisible(true);

            return clickedDeckMakeButton;
        }
        this.resetCurrentButtonClickState();

        return null;
    }

    public async onMouseDown(event: MouseEvent): Promise<void> {
        if (event.button === 0) {
            const clickPoint = { x: event.clientX, y: event.clientY };
            await this.handleLeftClick(clickPoint);
        }
    }

    private getDeckMakeButton(): DeckMakeButton | null {
        return this.deckMakeButtonRepository.findButton();
    }

    private setTransparentBackgroundVisible(isVisible: boolean): void {
        if (isVisible == true) {
            this.transparentBackgroundRepository.showTransparentBackground();
        } else {
            this.transparentBackgroundRepository.hideTransparentBackground();
        }
    }

    private setDeckMakePopupBackgroundVisible(isVisible: boolean): void {
        if (isVisible == true) {
            this.deckMakePopupBackgroundRepository.showDeckMakePopupBackground();
        } else {
            this.deckMakePopupBackgroundRepository.hideDeckMakePopupBackground();
        }
    }

    private setDeckMakePopupButtonsVisible(isVisible: boolean): void {
        const buttonIds = this.deckMakePopupButtonsRepository.findAllButtonIds();
        if (isVisible == true){
           buttonIds.forEach((buttonId) => {
               this.deckMakePopupButtonsRepository.showDeckMakePopupButton(buttonId);
           });
        } else {
            buttonIds.forEach((buttonId) => {
                this.deckMakePopupButtonsRepository.hideDeckMakePopupButton(buttonId);
            });
        }
    }

    private setDeckMakePopupInputContainerVisible(isVisible: boolean): void {
        if (isVisible == true) {
            this.deckMakePopupInputContainerRepository.showDeckMakePopupInputContainer();
        } else {
            this.deckMakePopupInputContainerRepository.hideDeckMakePopupInputContainer();
        }
    }

    private saveCurrentButtonClickState(button: DeckMakeButton): void {
        this.deckMakeButtonClickDetectRepository.saveCurrentButtonClickState(button);
    }

    public getCurrentButtonClickState(): DeckMakeButton | null {
        return this.deckMakeButtonClickDetectRepository.getCurrentButtonClickState();
    }

    private resetCurrentButtonClickState(): void {
        this.deckMakeButtonClickDetectRepository.resetCurrentButtonClickState();
    }

}
