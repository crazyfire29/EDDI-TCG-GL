import * as THREE from "three";

import {MyCardRaceButtonClickDetectService} from "./MyCardRaceButtonClickDetectService";
import {MyCardRaceButton} from "../../my_card_race_button/entity/MyCardRaceButton";
import {MyCardRaceButtonRepositoryImpl} from "../../my_card_race_button/repository/MyCardRaceButtonRepositoryImpl"
import {MyCardRaceButtonClickDetectRepositoryImpl} from "../repository/MyCardRaceButtonClickDetectRepositoryImpl";
import {MyCardScreenCardRepositoryImpl} from "../../my_card_screen_card/repository/MyCardScreenCardRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

import {MyCardRaceButtonStateManager} from "../../my_card_race_button_manager/MyCardRaceButtonStateManager";
import {MyCardRaceButtonEffectStateManager} from "../../my_card_race_button_manager/MyCardRaceButtonEffectStateManager";
import {CardStateManager} from "../../my_card_screen_card_manager/CardStateManager";

export class MyCardRaceButtonClickDetectServiceImpl implements MyCardRaceButtonClickDetectService {
    private static instance: MyCardRaceButtonClickDetectServiceImpl | null = null;
    private raceButtonRepository: MyCardRaceButtonRepositoryImpl;
    private raceButtonClickDetectRepository: MyCardRaceButtonClickDetectRepositoryImpl;
    private cardRepository: MyCardScreenCardRepositoryImpl;
    private cameraRepository: CameraRepository;

    private raceButtonStateManager: MyCardRaceButtonStateManager;
    private raceButtonEffectStateManager: MyCardRaceButtonEffectStateManager;
    private cardStateManager: CardStateManager;

    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.raceButtonRepository = MyCardRaceButtonRepositoryImpl.getInstance();
        this.raceButtonClickDetectRepository = MyCardRaceButtonClickDetectRepositoryImpl.getInstance();
        this.cardRepository = MyCardScreenCardRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();

        this.raceButtonStateManager = MyCardRaceButtonStateManager.getInstance();
        this.raceButtonEffectStateManager = MyCardRaceButtonEffectStateManager.getInstance();
        this.cardStateManager = CardStateManager.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): MyCardRaceButtonClickDetectServiceImpl {
        if (!MyCardRaceButtonClickDetectServiceImpl.instance) {
            MyCardRaceButtonClickDetectServiceImpl.instance = new MyCardRaceButtonClickDetectServiceImpl(camera, scene);
        }
        return MyCardRaceButtonClickDetectServiceImpl.instance;
    }

    setLeftMouseDown(state: boolean): void {
        this.leftMouseDown = state;
    }

    isLeftMouseDown(): boolean {
        return this.leftMouseDown;
    }

    async handleRaceButtonClick(clickPoint: { x: number; y: number }): Promise<MyCardRaceButton | null> {
        const { x, y } = clickPoint;
        const raceButtonList = this.getAllRaceButtons();
        const clickedRaceButton = this.raceButtonClickDetectRepository.isRaceButtonClicked(
            { x, y },
            raceButtonList,
            this.camera
        );

        if (clickedRaceButton) {
            console.log(`[DEBUG] Clicked Race Button ID: ${clickedRaceButton.id}`); // raceButtonList 기준으로 0, 1, 2임.
            this.saveCurrentClickedRaceButtonId(clickedRaceButton.id);
            const currentClickedButtonId = this.getCurrentClickedRaceButtonId();

            const hiddenRaceButton = raceButtonList.find(
                (button) => this.getRaceButtonVisibility(button.id) == false
            );

            if (hiddenRaceButton && hiddenRaceButton.id !== currentClickedButtonId) {
                const cardIdList = this.getCardIdListByRaceId(hiddenRaceButton.id);
                this.setCardsVisibility(cardIdList, false);
                this.setRaceButtonVisibility(hiddenRaceButton.id, true);
                this.setRaceButtonEffectVisibility(hiddenRaceButton.id, false);
            }

            if (currentClickedButtonId !== null) {
                const cardIdList = this.getCardIdListByRaceId(currentClickedButtonId);
                this.setCardsVisibility(cardIdList, true);
                this.setRaceButtonVisibility(currentClickedButtonId, false);
                this.setRaceButtonEffectVisibility(currentClickedButtonId, true);
            }

            return clickedRaceButton;
        }

        return null;
    }

    public async onMouseDown(event: MouseEvent): Promise<MyCardRaceButton | null> {
        if (event.button === 0) {
            const clickPoint = { x: event.clientX, y: event.clientY };
            return await this.handleRaceButtonClick(clickPoint);
        }
        return null;
    }

    public getAllRaceButtons(): MyCardRaceButton[] {
        return this.raceButtonRepository.findAllButton();
    }

    public saveCurrentClickedRaceButtonId(buttonId: number): void {
        this.raceButtonClickDetectRepository.saveCurrentClickedRaceButtonId(buttonId);
    }

    public getCurrentClickedRaceButtonId(): number | null {
        return this.raceButtonClickDetectRepository.findCurrentClickedRaceButtonId();
    }

    public getRaceButtonVisibility(buttonId: number): boolean {
        return this.raceButtonStateManager.findVisibility(buttonId);
    }

    public setRaceButtonVisibility(buttonId: number, visible: boolean): void {
        this.raceButtonStateManager.setVisibility(buttonId, visible);
    }

    public setRaceButtonEffectVisibility(effectId: number, visible: boolean): void {
        this.raceButtonEffectStateManager.setVisibility(effectId, visible);
    }

    private getCardIdListByRaceId(buttonId: number): number[] {
        const raceId = (buttonId + 1).toString();
        return this.cardRepository.findCardIdsByRaceId(raceId);
    }

    private setCardsVisibility(cardIdList: number[], isVisible: boolean): void {
        cardIdList.forEach((cardId) => {
            this.cardStateManager.setCardVisibility(cardId, isVisible)
        });
    }

}
