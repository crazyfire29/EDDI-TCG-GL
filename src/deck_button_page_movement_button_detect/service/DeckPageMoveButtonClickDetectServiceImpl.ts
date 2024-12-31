import {DeckPageMovementButtonClickDetectService} from "./DeckPageMoveButtonClickDetectService";

import {MyDeckButtonPageMovementButtonRepositoryImpl} from "../../my_deck_button_page_movement_button/repository/MyDeckButtonPageMovementButtonRepositoryImpl";
import {MyDeckButtonPageMovementButtonRepository} from "../../my_deck_button_page_movement_button/repository/MyDeckButtonPageMovementButtonRepository";
import {MyDeckButtonPageMovementButton} from "../../my_deck_button_page_movement_button/entity/MyDeckButtonPageMovementButton";

import {DeckPageMovementButtonClickDetectRepositoryImpl} from "../repository/DeckPageMoveButtonClickDetectRepositoryImpl";
import {DeckPageMovementButtonClickDetectRepository} from "../repository/DeckPageMoveButtonClickDetectRepository";
import {MyDeckButtonRepositoryImpl} from "../../my_deck_button/repository/MyDeckButtonRepositoryImpl";
import {MyDeckButton} from "../../my_deck_button/entity/MyDeckButton";
import {MyDeckButtonEffectRepositoryImpl} from "../../my_deck_button_effect/repository/MyDeckButtonEffectRepositoryImpl";
import {MyDeckButtonEffect} from "../../my_deck_button_effect/entity/MyDeckButtonEffect";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

import {ButtonPageManager} from "../../my_deck_button_manager/ButtonPageManager";
import {ButtonStateManager} from "../../my_deck_button_manager/ButtonStateManager";
import {ButtonEffectManager} from "../../my_deck_button_manager/ButtonEffectManager";


import * as THREE from "three";

export class DeckPageMovementButtonClickDetectServiceImpl implements DeckPageMovementButtonClickDetectService {
    private static instance: DeckPageMovementButtonClickDetectServiceImpl | null = null;

    private myDeckButtonPageMovementButtonRepository: MyDeckButtonPageMovementButtonRepositoryImpl;
    private deckPageMoveButtonClickDetectRepository: DeckPageMovementButtonClickDetectRepositoryImpl;
    private myDeckButtonRepository: MyDeckButtonRepositoryImpl;
    private myDeckButtonEffectRepository: MyDeckButtonEffectRepositoryImpl;
    private buttonPageManager: ButtonPageManager;
    private buttonStateManager: ButtonStateManager;
    private buttonEffectManager: ButtonEffectManager;

    private cameraRepository: CameraRepository
    private leftMouseDown: boolean = false;

    private deckButtonPageCount: number = 1;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.myDeckButtonPageMovementButtonRepository = MyDeckButtonPageMovementButtonRepositoryImpl.getInstance();
        this.deckPageMoveButtonClickDetectRepository = DeckPageMovementButtonClickDetectRepositoryImpl.getInstance();
        this.myDeckButtonRepository = MyDeckButtonRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();

        const allButtonsMap = this.myDeckButtonRepository.getAllMyDeckButtons();
        this.buttonPageManager = new ButtonPageManager(allButtonsMap);
        this.buttonStateManager = new ButtonStateManager();
        this.buttonEffectManager = new ButtonEffectManager();
        this.myDeckButtonEffectRepository = MyDeckButtonEffectRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): DeckPageMovementButtonClickDetectServiceImpl {
        if (!DeckPageMovementButtonClickDetectServiceImpl.instance) {
            DeckPageMovementButtonClickDetectServiceImpl.instance = new DeckPageMovementButtonClickDetectServiceImpl(camera, scene);
        }
        return DeckPageMovementButtonClickDetectServiceImpl.instance;
    }

    setLeftMouseDown(state: boolean): void {
        this.leftMouseDown = state;
    }

    isLeftMouseDown(): boolean {
        return this.leftMouseDown;
    }

    async handleLeftClick(
        clickPoint: { x: number; y: number },
    ): Promise<MyDeckButtonPageMovementButton | null> {
        const { x, y } = clickPoint;

        const deckPageMoveButtonList = this.getAllMovementButton();
        const deckButtonList = this.getAllDeckButton();
        const clickedDeckPageMovementButton = this.deckPageMoveButtonClickDetectRepository.isDeckMoveButtonClicked(
            { x, y },
            deckPageMoveButtonList,
            this.camera
        );
        if (clickedDeckPageMovementButton) {
            console.log(`Clicked Deck Page Movement Button ID: ${clickedDeckPageMovementButton.id}`);

            this.buttonEffectManager.resetVisibility();

            if (clickedDeckPageMovementButton.id === 0) {
                if (this.getCurrentPage() > 1) {
                    this.setCurrentDeckButtonPage(this.getCurrentPage() - 1);
                    this.showMyDeckButtonsForPage(this.getCurrentPage());
                    this.getMyDeckButtonsIdForPage(this.getCurrentPage());
                }
            }

            if (clickedDeckPageMovementButton.id === 1) {
                if (this.getCurrentPage() < this.buttonPageManager.getTotalPages()) {
                    this.setCurrentDeckButtonPage(this.getCurrentPage() + 1);
                    this.showMyDeckButtonsForPage(this.getCurrentPage());
                    this.getMyDeckButtonsIdForPage(this.getCurrentPage());
                }
            }
            return clickedDeckPageMovementButton;
        }

        return null;
    }

    private getAllMovementButton(): MyDeckButtonPageMovementButton[] {
        return this.myDeckButtonPageMovementButtonRepository.findAll();
    }

    private getAllDeckButton(): MyDeckButton[] {
        return this.myDeckButtonRepository.findAll();
    }

    private hideDeckButton(id: number): boolean {
        return this.myDeckButtonRepository.hideById(id);
    }

    public setButtonVisibility(buttonId: number, isVisible: boolean): void {
         this.buttonStateManager.setVisibility(buttonId, isVisible);
    }

    private getAllMyDeckButtonEffect(): MyDeckButtonEffect[] {
        return this.myDeckButtonEffectRepository.findAll();
    }

    private getAllMyDeckButtonEffectWithId(): Map<number, MyDeckButtonEffect> {
        return this.myDeckButtonEffectRepository.getAllMyDeckButtonEffect();
    }

    private getEffectVisibility(id: number): boolean {
        return this.buttonEffectManager.getVisibility(id);
    }

    private getCurrentPage(): number {
        return this.buttonPageManager.getCurrentPage();
    }

    private showMyDeckButtonsForPage(page: number): void {
        this.buttonPageManager.showButtonsForPage(page);
    }

    private setCurrentDeckButtonPage(page: number): void {
        this.buttonPageManager.setCurrentPage(page);
    }

    private getMyDeckButtonsIdForPage(page: number): number[] {
        return this.buttonPageManager.getButtonsIdForPage(page);
    }

}
