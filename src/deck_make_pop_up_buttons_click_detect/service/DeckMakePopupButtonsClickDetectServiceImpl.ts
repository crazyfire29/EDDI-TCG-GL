import * as THREE from "three";

import {DeckMakePopupButtonsClickDetectService} from "./DeckMakePopupButtonsClickDetectService";
import {DeckMakePopupButtonsClickDetectRepository} from "../repository/DeckMakePopupButtonsClickDetectRepository";
import {DeckMakePopupButtonsClickDetectRepositoryImpl} from "../repository/DeckMakePopupButtonsClickDetectRepositoryImpl";

import {DeckMakePopupButtons} from "../../deck_make_pop_up_buttons/entity/DeckMakePopupButtons";
import {DeckMakePopupButtonsRepositoryImpl} from "../../deck_make_pop_up_buttons/repository/DeckMakePopupButtonsRepositoryImpl";
import {DeckMakePopupBackgroundRepositoryImpl} from "../../deck_make_pop_up_background/repository/DeckMakePopupBackgroundRepositoryImpl";
import {TransparentBackgroundRepositoryImpl} from "../../transparent_background/repository/TransparentBackgroundRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

export class DeckMakePopupButtonsClickDetectServiceImpl implements DeckMakePopupButtonsClickDetectService {
    private static instance: DeckMakePopupButtonsClickDetectServiceImpl | null = null;
    private deckMakePopupButtonsClickDetectRepository: DeckMakePopupButtonsClickDetectRepositoryImpl;
    private deckMakePopupButtonsRepository: DeckMakePopupButtonsRepositoryImpl;
    private deckMakePopupBackgroundRepository: DeckMakePopupBackgroundRepositoryImpl;
    private transparentBackgroundRepository: TransparentBackgroundRepositoryImpl;

    private cameraRepository: CameraRepository
    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.deckMakePopupButtonsClickDetectRepository = DeckMakePopupButtonsClickDetectRepositoryImpl.getInstance();
        this.deckMakePopupButtonsRepository = DeckMakePopupButtonsRepositoryImpl.getInstance();
        this.deckMakePopupBackgroundRepository = DeckMakePopupBackgroundRepositoryImpl.getInstance();
        this.transparentBackgroundRepository = TransparentBackgroundRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): DeckMakePopupButtonsClickDetectServiceImpl {
        if (!DeckMakePopupButtonsClickDetectServiceImpl.instance) {
            DeckMakePopupButtonsClickDetectServiceImpl.instance = new DeckMakePopupButtonsClickDetectServiceImpl(camera, scene);
        }
        return DeckMakePopupButtonsClickDetectServiceImpl.instance;
    }

    setLeftMouseDown(state: boolean): void {
        this.leftMouseDown = state;
    }

    isLeftMouseDown(): boolean {
        return this.leftMouseDown;
    }

    async handleLeftClick(clickPoint: { x: number; y: number }): Promise<DeckMakePopupButtons | null> {
        const { x, y } = clickPoint;
        const deckMakePopupButtonsList = this.getAllDeckMakePopupButtons();
        const clickedDeckMakePopupButton = this.deckMakePopupButtonsClickDetectRepository.isDeckMakePopupButtonsClicked(
            { x, y },
            deckMakePopupButtonsList,
            this.camera
        );

        if (clickedDeckMakePopupButton) {
            console.log(`Clicked Deck Make Pop-up Button ID: ${clickedDeckMakePopupButton.id}`);

            if (clickedDeckMakePopupButton.id === 0) {
                console.log(`click cancel button!`);
                this.setTransparentBackgroundVisible(false);
                this.setDeckMakePopupBackgroundVisible(false);
                this.setDeckMakePopupButtonsVisible(false);
            }

            if (clickedDeckMakePopupButton.id === 1) {
                console.log(`click create button!`);
            }
            return clickedDeckMakePopupButton;
        }

        return null;
    }

    public async onMouseDown(event: MouseEvent): Promise<DeckMakePopupButtons | null> {
        if (event.button === 0) {
            const clickPoint = { x: event.clientX, y: event.clientY };
            return await this.handleLeftClick(clickPoint);
        }
        return null;
    }

    private getAllDeckMakePopupButtons(): DeckMakePopupButtons[] {
        return this.deckMakePopupButtonsRepository.findAll();
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


}