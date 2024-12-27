import {MyDeckButtonClickDetectService} from "./MyDeckButtonClickDetectService";
import {MyDeckButtonRepositoryImpl} from "../../my_deck_button/repository/MyDeckButtonRepositoryImpl";
import {MyDeckButtonRepository} from "../../my_deck_button/repository/MyDeckButtonRepository";
import {MyDeckButton} from "../../my_deck_button/entity/MyDeckButton";
import {MyDeckButtonEffectRepositoryImpl} from "../../my_deck_button_effect/repository/MyDeckButtonEffectRepositoryImpl";

import {MyDeckButtonClickDetectRepositoryImpl} from "../repository/MyDeckButtonClickDetectRepositoryImpl";
import {MyDeckButtonClickDetectRepository} from "../repository/MyDeckButtonClickDetectRepository";
import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

import * as THREE from "three";

export class MyDeckButtonClickDetectServiceImpl implements MyDeckButtonClickDetectService {
    private static instance: MyDeckButtonClickDetectServiceImpl | null = null;

    private myDeckButtonRepository: MyDeckButtonRepositoryImpl;
    private myDeckButtonClickDetectRepository: MyDeckButtonClickDetectRepositoryImpl;
    private myDeckButtonEffectRepository: MyDeckButtonEffectRepositoryImpl;

    private cameraRepository: CameraRepository

    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.myDeckButtonRepository = MyDeckButtonRepositoryImpl.getInstance();
        this.myDeckButtonClickDetectRepository = MyDeckButtonClickDetectRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
        this.myDeckButtonEffectRepository = MyDeckButtonEffectRepositoryImpl.getInstance();
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

            const hiddenButton = deckButtonList.find((button) => !button.getMesh().visible);

            if (hiddenButton && hiddenButton.id !== currentClickDeckButtonId) {
                const buttonShow = this.myDeckButtonRepository.showById(hiddenButton.id);
                if (buttonShow) {
                    this.myDeckButtonEffectRepository.hideById(hiddenButton.id);
                    console.log(`Deck Button ID ${hiddenButton.id} is now shown.`);
                } else {
                    console.error(`Failed to show Deck Button ID ${hiddenButton.id}`);
                }

            }

            if (currentClickDeckButtonId !== null){
                const buttonHide = this.myDeckButtonRepository.hideById(currentClickDeckButtonId);
                if (buttonHide) {
                    this.myDeckButtonEffectRepository.showById(currentClickDeckButtonId);
                    console.log(`Deck Button ID ${currentClickDeckButtonId} is now hidden.`);
                } else {
                    console.error(`Failed to hide Deck Button ID ${currentClickDeckButtonId}`);
                }

            }

            return clickedDeckButton;
        }

        return null;
    }

}
