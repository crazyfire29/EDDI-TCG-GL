import {DeckPageMovementButtonClickDetectService} from "./DeckPageMoveButtonClickDetectService";

import {MyDeckButtonPageMovementButton} from "../../my_deck_button_page_movement_button/entity/MyDeckButtonPageMovementButton";
import {MyDeckButtonPageMovementButtonRepository} from "../../my_deck_button_page_movement_button/repository/MyDeckButtonPageMovementButtonRepository";
import {MyDeckButtonPageMovementButtonRepositoryImpl} from "../../my_deck_button_page_movement_button/repository/MyDeckButtonPageMovementButtonRepositoryImpl";

import {DeckPageMovementButtonClickDetectRepository} from "../repository/DeckPageMoveButtonClickDetectRepository";
import {DeckPageMovementButtonClickDetectRepositoryImpl} from "../repository/DeckPageMoveButtonClickDetectRepositoryImpl";

import {MyDeckButton} from "../../my_deck_button/entity/MyDeckButton";
import {MyDeckButtonRepositoryImpl} from "../../my_deck_button/repository/MyDeckButtonRepositoryImpl";

import {MyDeckButtonEffect} from "../../my_deck_button_effect/entity/MyDeckButtonEffect";
import {MyDeckCardRepositoryImpl} from "../../my_deck_card/repository/MyDeckCardRepositoryImpl";
import {MyDeckButtonEffectRepositoryImpl} from "../../my_deck_button_effect/repository/MyDeckButtonEffectRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

import {ButtonPageManager} from "../../my_deck_button_manager/ButtonPageManager";
import {ButtonStateManager} from "../../my_deck_button_manager/ButtonStateManager";
import {ButtonEffectManager} from "../../my_deck_button_manager/ButtonEffectManager";
import {CardStateManager} from "../../my_deck_card_manager/CardStateManager";


import * as THREE from "three";

export class DeckPageMovementButtonClickDetectServiceImpl implements DeckPageMovementButtonClickDetectService {
    private static instance: DeckPageMovementButtonClickDetectServiceImpl | null = null;

    private myDeckButtonPageMovementButtonRepository: MyDeckButtonPageMovementButtonRepositoryImpl;
    private deckPageMoveButtonClickDetectRepository: DeckPageMovementButtonClickDetectRepositoryImpl;
    private myDeckButtonRepository: MyDeckButtonRepositoryImpl;
    private myDeckButtonEffectRepository: MyDeckButtonEffectRepositoryImpl;
    private myDeckCardRepository: MyDeckCardRepositoryImpl;

    private buttonPageManager: ButtonPageManager;
    private buttonStateManager: ButtonStateManager;
    private buttonEffectManager: ButtonEffectManager;
    private cardStateManager: CardStateManager;

    private cameraRepository: CameraRepository
    private leftMouseDown: boolean = false;

    private deckButtonPageCount: number = 1;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.myDeckButtonPageMovementButtonRepository = MyDeckButtonPageMovementButtonRepositoryImpl.getInstance();
        this.deckPageMoveButtonClickDetectRepository = DeckPageMovementButtonClickDetectRepositoryImpl.getInstance();
        this.myDeckButtonRepository = MyDeckButtonRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();

        this.buttonPageManager = ButtonPageManager.getInstance();
        this.buttonStateManager = ButtonStateManager.getInstance();
        this.buttonEffectManager = ButtonEffectManager.getInstance();
        this.cardStateManager = CardStateManager.getInstance();

        this.myDeckButtonEffectRepository = MyDeckButtonEffectRepositoryImpl.getInstance();
        this.myDeckCardRepository = MyDeckCardRepositoryImpl.getInstance();
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

    async handleLeftClick(clickPoint: { x: number; y: number }): Promise<MyDeckButtonPageMovementButton | null> {
        const { x, y } = clickPoint;
        const deckPageMoveButtonList = this.getAllMovementButton();
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
                    this.resetEffectState(this.getCurrentPage());
                    this.resetButtonState(this.getCurrentPage());
                    this.resetCardState(this.getCurrentPage());

                    this.setCurrentDeckButtonPage(this.getCurrentPage() - 1);
                    this.showMyDeckButton(this.getCurrentPage());
                    this.getMyDeckButtonsIdForPage(this.getCurrentPage());
                }
            }

            if (clickedDeckPageMovementButton.id === 1) {
                if (this.getCurrentPage() < this.getTotalDeckButtonPage()) {
                    this.resetEffectState(this.getCurrentPage());
                    this.resetButtonState(this.getCurrentPage());
                    this.resetCardState(this.getCurrentPage());

                    this.setCurrentDeckButtonPage(this.getCurrentPage() + 1);
                    this.showMyDeckButton(this.getCurrentPage());
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

    private getAllMyDeckButtonEffect(): MyDeckButtonEffect[] {
        return this.myDeckButtonEffectRepository.findAll();
    }

    private getAllMyDeckButtonEffectWithId(): Map<number, MyDeckButtonEffect> {
        return this.myDeckButtonEffectRepository.getAllMyDeckButtonEffect();
    }

    private getCurrentPage(): number {
        return this.buttonPageManager.getCurrentPage();
    }

    private setCurrentDeckButtonPage(page: number): void {
        this.buttonPageManager.setCurrentPage(page);
    }

    public getAllDeckButtonId(): number[] {
        return this.myDeckButtonRepository.findAllButtonIds();
    }

    // 현재 페이지에 해당되는 버튼 아이디 가져오기
    private getMyDeckButtonsIdForPage(page: number): number[] {
        const buttonId = this.getAllDeckButtonId();
        return this.buttonPageManager.findButtonIdsForPage(page, buttonId);
    }

    // 특정 버튼 객체 가져오기
    private getButtonMeshByButtonId(buttonId: number): MyDeckButton | null {
        return this.myDeckButtonRepository.findById(buttonId);
    }

    private getEffectMeshByEffectId(effectId: number): MyDeckButtonEffect | null {
        return this.myDeckButtonEffectRepository.findById(effectId);
    }

    private setButtonVisibility(buttonId: number, isVisible: boolean): void {
        this.buttonStateManager.setVisibility(buttonId, isVisible);
    }

    private setEffectVisibility(effectId: number, isVisible: boolean): void {
        this.buttonEffectManager.setVisibility(effectId, isVisible);
    }

    private showButtonMesh(buttonId: number): void{
        this.setButtonVisibility(buttonId, true);
        const buttonMesh = this.getButtonMeshByButtonId(buttonId);
        if (buttonMesh) {
            buttonMesh.getMesh().visible = true;
        }
    }

    private hideButtonMesh(buttonId: number): void {
        this.setButtonVisibility(buttonId, false);
        const buttonMesh = this.getButtonMeshByButtonId(buttonId);
        if (buttonMesh) {
            buttonMesh.getMesh().visible = false;
        }
    }

    private hideEffectMesh(effectId: number): void {
        this.setEffectVisibility(effectId, false);
        const effectMesh = this.getEffectMeshByEffectId(effectId);
        if (effectMesh) {
            effectMesh.getMesh().visible = false;
        }
    }

    private showMyDeckButton(page: number): void {
        const currentButtonIds = this.getMyDeckButtonsIdForPage(page);
        currentButtonIds.forEach((buttonId) => {
            this.showButtonMesh(buttonId);
        });
    }

    private resetButtonState(page: number): void {
        const buttonIdList = this.getMyDeckButtonsIdForPage(page);
        buttonIdList.forEach((buttonId) => {
            this.hideButtonMesh(buttonId);
        });
    }

    private resetEffectState(page: number): void {
        const effectIdList = this.getMyDeckButtonsIdForPage(page);
        effectIdList.forEach((effectId) => {
            this.hideEffectMesh(effectId);
        });
    }

    private getTotalDeckButtonPage(): number {
        const buttonIdList = this.getAllDeckButtonId();
        return this.buttonPageManager.getTotalPages(buttonIdList);
    }

    private getCardIdsByDeckId(deckId: number): number[] {
        return this.myDeckCardRepository.findCardIdsByDeckId(deckId);
    }

    // 특정 덱의 특정 카드 mesh 가져오기
    private getCardMeshByDeckIdAndCardId(deckId: number, cardId: number): THREE.Mesh | null {
        return this.myDeckCardRepository.findCardMeshByDeckIdAndCardId(deckId, cardId);
    }

    // 특정 덱의 특정 카드 visible 상태 설정
    private setCardVisibility(deckId: number, cardId: number, isVisible: boolean): void {
        this.cardStateManager.setCardVisibility(deckId, cardId, isVisible);
    }

    private hideCardMesh(deckId: number, cardId: number): void {
        this.setCardVisibility(deckId, cardId, false);
        const cardMesh = this.getCardMeshByDeckIdAndCardId(deckId, cardId);
        if (cardMesh) {
            cardMesh.visible = false;
        }
    }

    // 카드 visible 상태 초기화 (모두 false)
    private resetCardMeshVisible(deckId: number, cardIdList: number[]): void {
        cardIdList.forEach((cardId) => {
            this.hideCardMesh(deckId, cardId);
        });
    }

    private resetCardState(page: number): void {
        const buttonIdList = this.getMyDeckButtonsIdForPage(page);
        buttonIdList.forEach((buttonDeckId) => {
            const deckId = buttonDeckId + 1;
            const cardIdList = this.getCardIdsByDeckId(deckId);
            this.resetCardMeshVisible(deckId, cardIdList);
        });
    }

}
