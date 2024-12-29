import {MyDeckButtonClickDetectService} from "./MyDeckButtonClickDetectService";
import {MyDeckButtonRepositoryImpl} from "../../my_deck_button/repository/MyDeckButtonRepositoryImpl";
import {MyDeckButtonRepository} from "../../my_deck_button/repository/MyDeckButtonRepository";
import {MyDeckButton} from "../../my_deck_button/entity/MyDeckButton";
import {MyDeckButtonEffectRepositoryImpl} from "../../my_deck_button_effect/repository/MyDeckButtonEffectRepositoryImpl";

import {MyDeckButtonClickDetectRepositoryImpl} from "../repository/MyDeckButtonClickDetectRepositoryImpl";
import {MyDeckButtonClickDetectRepository} from "../repository/MyDeckButtonClickDetectRepository";
import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

import {ButtonStateManager} from "../../my_deck_button_manager/ButtonStateManager";
import {ButtonEffectManager} from "../../my_deck_button_manager/ButtonEffectManager";

import * as THREE from "three";

export class MyDeckButtonClickDetectServiceImpl implements MyDeckButtonClickDetectService {
    private static instance: MyDeckButtonClickDetectServiceImpl | null = null;

    private myDeckButtonRepository: MyDeckButtonRepositoryImpl;
    private myDeckButtonClickDetectRepository: MyDeckButtonClickDetectRepositoryImpl;
    private myDeckButtonEffectRepository: MyDeckButtonEffectRepositoryImpl;
    private buttonStateManager: ButtonStateManager;
    private buttonEffectManager: ButtonEffectManager;

    private cameraRepository: CameraRepository

    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.myDeckButtonRepository = MyDeckButtonRepositoryImpl.getInstance();
        this.myDeckButtonClickDetectRepository = MyDeckButtonClickDetectRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
        this.myDeckButtonEffectRepository = MyDeckButtonEffectRepositoryImpl.getInstance();

        this.buttonStateManager = new ButtonStateManager();
        this.buttonEffectManager = new ButtonEffectManager();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): MyDeckButtonClickDetectServiceImpl {
        if (!MyDeckButtonClickDetectServiceImpl.instance) {
            MyDeckButtonClickDetectServiceImpl.instance = new MyDeckButtonClickDetectServiceImpl(camera, scene);
        }
        return MyDeckButtonClickDetectServiceImpl.instance;
    }

    setLeftMouseDown(state: boolean): void {
        this.leftMouseDown = state;
    }

    isLeftMouseDown(): boolean {
        return this.leftMouseDown;
    }

    async handleLeftClick(
        clickPoint: { x: number; y: number },
    ): Promise<MyDeckButton | null> {
        const { x, y } = clickPoint;

        const deckButtonList = this.myDeckButtonRepository.findAll()
        const clickedDeckButton = this.myDeckButtonClickDetectRepository.isMyDeckButtonClicked(
            { x, y },
            deckButtonList,
            this.camera
        );


        if (clickedDeckButton) {
            console.log(`Clicked Deck Button ID: ${clickedDeckButton.id}`);
            this.myDeckButtonClickDetectRepository.saveCurrentClickDeckButtonId(clickedDeckButton.id);
            const currentClickDeckButtonId = this.myDeckButtonClickDetectRepository.getCurrentClickDeckButtonId();


            const hiddenButton = deckButtonList.find(
                (button) => !this.getButtonVisibility(button.id)
            );

            if (hiddenButton && hiddenButton.id !== currentClickDeckButtonId) {
                this.setButtonVisibility(hiddenButton.id, true);
                const buttonShow = this.showDeckButton(hiddenButton.id);
                if (buttonShow) {
                    this.hideDeckButtonEffect(hiddenButton.id);
                    this.setEffectVisibility(hiddenButton.id, false);
                    console.log(`Deck Button ID ${hiddenButton.id} is now shown.`);
                } else {
                    console.error(`Failed to show Deck Button ID ${hiddenButton.id}`);
                }

            }

            if (currentClickDeckButtonId !== null){
                const buttonHide = this.hideDeckButton(currentClickDeckButtonId);
                if (buttonHide) {
                    this.setButtonVisibility(currentClickDeckButtonId, false);
                    this.showDeckButtonEffect(currentClickDeckButtonId);
                    this.setEffectVisibility(currentClickDeckButtonId, true);
                    console.log(`Deck Button ID ${currentClickDeckButtonId} is now hidden.`);
                } else {
                    console.error(`Failed to hide Deck Button ID ${currentClickDeckButtonId}`);
                }

            }

            return clickedDeckButton;
        }

        return null;
    }

    public getButtonVisibility(buttonId: number): boolean {
        return this.buttonStateManager.getVisibility(buttonId);
    }

    public setButtonVisibility(buttonId: number, isVisible: boolean): void {
       this.buttonStateManager.setVisibility(buttonId, isVisible);
    }

    public getEffectVisibility(buttonId: number): boolean {
        return this.buttonEffectManager.getVisibility(buttonId);
    }

    public setEffectVisibility(buttonId: number, isVisible: boolean): void {
        this.buttonEffectManager.setVisibility(buttonId, isVisible);
    }

    private showDeckButtonEffect(id: number): boolean {
        return this.myDeckButtonEffectRepository.showById(id);
    }

    private hideDeckButtonEffect(id: number): boolean {
        return this.myDeckButtonEffectRepository.hideById(id);
    }

    private showDeckButton(id: number): boolean {
        return this.myDeckButtonRepository.showById(id);
    }

    private hideDeckButton(id: number): boolean {
        return this.myDeckButtonRepository.hideById(id);
    }


}
