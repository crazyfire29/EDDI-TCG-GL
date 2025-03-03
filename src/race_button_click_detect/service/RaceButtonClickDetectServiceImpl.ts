import * as THREE from "three";

import {RaceButtonClickDetectService} from "./RaceButtonClickDetectService";
import {RaceButton} from "../../race_button/entity/RaceButton";
import {RaceButtonRepository} from "../../race_button/repository/RaceButtonRepository";
import {RaceButtonRepositoryImpl} from "../../race_button/repository/RaceButtonRepositoryImpl";
import {MakeDeckScreenCardRepositoryImpl} from "../../make_deck_screen_card/repository/MakeDeckScreenCardRepositoryImpl";

import {RaceButtonClickDetectRepository} from "../repository/RaceButtonClickDetectRepository";
import {RaceButtonClickDetectRepositoryImpl} from "../repository/RaceButtonClickDetectRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

import {RaceButtonStateManager} from "../../race_button_manager/RaceButtonStateManager";
import {RaceButtonEffectStateManager} from "../../race_button_manager/RaceButtonEffectStateManager";
import {CardStateManager} from "../../make_deck_screen_card_manager/CardStateManager";
import {CardPageManager} from "../../make_deck_screen_card_manager/CardPageManager";
import {NumberOfOwnedCardsStateManager} from "../../number_of_owned_cards_manager/NumberOfOwnedCardsStateManager";
import {CardEffectStateManager} from "../../make_deck_screen_card_effect_manager/CardEffectStateManager";

export class RaceButtonClickDetectServiceImpl implements RaceButtonClickDetectService {
    private static instance: RaceButtonClickDetectServiceImpl | null = null;

    private raceButtonRepository: RaceButtonRepositoryImpl;
    private raceButtonClickDetectRepository: RaceButtonClickDetectRepositoryImpl;
    private makeDeckScreenCardRepository: MakeDeckScreenCardRepositoryImpl;

    private raceButtonStateManager: RaceButtonStateManager;
    private raceButtonEffectStateManager: RaceButtonEffectStateManager;
    private cardStateManager: CardStateManager;
    private cardPageManager: CardPageManager;
    private numberOfOwnedCardsStateManager: NumberOfOwnedCardsStateManager;
    private cardEffectStateManager: CardEffectStateManager;

    private cameraRepository: CameraRepository
    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.raceButtonRepository = RaceButtonRepositoryImpl.getInstance();
        this.raceButtonClickDetectRepository = RaceButtonClickDetectRepositoryImpl.getInstance();
        this.makeDeckScreenCardRepository = MakeDeckScreenCardRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();

        this.raceButtonStateManager = RaceButtonStateManager.getInstance();
        this.raceButtonEffectStateManager = RaceButtonEffectStateManager.getInstance();
        this.cardStateManager = CardStateManager.getInstance();
        this.cardPageManager = CardPageManager.getInstance();
        this.numberOfOwnedCardsStateManager = NumberOfOwnedCardsStateManager.getInstance();
        this.cardEffectStateManager = CardEffectStateManager.getInstance();
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
            console.log(`[DEBUG] Clicked Race Button ID: ${clickedRaceButton.id}`); // raceButtonList 기준으로 0, 1, 2임.
            this.saveCurrentClickedRaceButtonId(clickedRaceButton.id);
            const currentClickedButtonId = this.getCurrentClickedRaceButtonId();

            const hiddenButton = raceButtonList.find(
                (button) => this.getRaceButtonVisibility(button.id) == false
            );

            if (hiddenButton && hiddenButton.id !== currentClickedButtonId) {
                const cardIdList = this.getCardIdsByRaceId(hiddenButton.id);
                this.setRaceButtonVisibility(hiddenButton.id, true);
                this.setRaceButtonEffectVisibility(hiddenButton.id, false);
                this.resetCardsVisibility(cardIdList, false);
                this.resetNumberVisibility(cardIdList, false);
                this.setEffectsVisibility(cardIdList, false);
                this.resetCurrentCardPage();
            }

            if (currentClickedButtonId !== null) {
                const cardIdList = this.getCardIdsByRaceId(currentClickedButtonId);
                this.setRaceButtonVisibility(currentClickedButtonId, false);
                this.setRaceButtonEffectVisibility(currentClickedButtonId, true);
                this.setCardsVisibility(cardIdList, true);
                this.setNumberVisibility(cardIdList, true);
                this.setEffectsVisibility(cardIdList, false);
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

    private getCardIdsByRaceId(buttonId: number): number[] {
        const raceId = (buttonId + 1).toString();
        return this.makeDeckScreenCardRepository.findCardIdsByRaceId(raceId);
    }

    // 현재 페이지에 해당되는 카드만 보여져야 함(종족 버튼을 클릭했을 때는 무조건 첫 페이지)
    private setCardsVisibility(cardIdList: number[], isVisible: boolean): void {
        const currentCardPage = this.cardPageManager.getCurrentPage();
        const currentPageCardId = this.cardPageManager.findCardIdsForPage(currentCardPage, cardIdList);
        currentPageCardId.forEach((cardId) => {
            this.cardStateManager.setCardVisibility(cardId, isVisible);
        });
    }

    // 다른 종족 버튼을 클릭했을 때 이전 종족 버튼 카드가 사라져야 함.
    private resetCardsVisibility(cardIdList: number[], isVisible: boolean): void {
        cardIdList.forEach((cardId) => {
            this.cardStateManager.setCardVisibility(cardId, isVisible);
        });
    }

    private resetCurrentCardPage(): void {
        this.cardPageManager.resetCurrentPage();
    }

    private setNumberVisibility(cardIdList: number[], isVisible: boolean): void {
        const currentCardPage = this.cardPageManager.getCurrentPage();
        const currentPageCardId = this.cardPageManager.findCardIdsForPage(currentCardPage, cardIdList);
        currentPageCardId.forEach((cardId) => {
            this.numberOfOwnedCardsStateManager.setNumberVisibility(cardId, isVisible);
        });
    }

    private resetNumberVisibility(cardIdList: number[], isVisible: boolean): void {
        cardIdList.forEach((cardId) => {
            this.numberOfOwnedCardsStateManager.setNumberVisibility(cardId, isVisible);
        });
    }

    private setEffectsVisibility(cardIdList: number[], isVisible: boolean): void {
        const currentCardPage = this.cardPageManager.getCurrentPage();
        const currentPageCardId = this.cardPageManager.findCardIdsForPage(currentCardPage, cardIdList);
        currentPageCardId.forEach((cardId) => {
            this.cardEffectStateManager.setEffectVisibility(cardId, isVisible);
        });
    }

}
