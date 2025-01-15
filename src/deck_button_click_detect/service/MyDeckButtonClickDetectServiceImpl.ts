import {MyDeckButtonClickDetectService} from "./MyDeckButtonClickDetectService";

import {MyDeckButton} from "../../my_deck_button/entity/MyDeckButton";
import {MyDeckButtonRepository} from "../../my_deck_button/repository/MyDeckButtonRepository";
import {MyDeckButtonRepositoryImpl} from "../../my_deck_button/repository/MyDeckButtonRepositoryImpl";

import {MyDeckButtonEffect} from "../../my_deck_button_effect/entity/MyDeckButtonEffect";
import {MyDeckButtonEffectRepositoryImpl} from "../../my_deck_button_effect/repository/MyDeckButtonEffectRepositoryImpl";

import {MyDeckButtonClickDetectRepositoryImpl} from "../repository/MyDeckButtonClickDetectRepositoryImpl";
import {MyDeckButtonClickDetectRepository} from "../repository/MyDeckButtonClickDetectRepository";
import {MyDeckCardRepositoryImpl} from "../../my_deck_card/repository/MyDeckCardRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

import {ButtonStateManager} from "../../my_deck_button_manager/ButtonStateManager";
import {ButtonEffectManager} from "../../my_deck_button_manager/ButtonEffectManager";
import {ButtonPageManager} from "../../my_deck_button_manager/ButtonPageManager";
import {CardStateManager} from "../../my_deck_card_manager/CardStateManager";
import {CardPageManager} from "../../my_deck_card_manager/CardPageManager";

import * as THREE from "three";

export class MyDeckButtonClickDetectServiceImpl implements MyDeckButtonClickDetectService {
    private static instance: MyDeckButtonClickDetectServiceImpl | null = null;

    private myDeckButtonRepository: MyDeckButtonRepositoryImpl;
    private myDeckButtonClickDetectRepository: MyDeckButtonClickDetectRepositoryImpl;
    private myDeckButtonEffectRepository: MyDeckButtonEffectRepositoryImpl;
    private myDeckCardRepository: MyDeckCardRepositoryImpl;

    private buttonStateManager: ButtonStateManager;
    private buttonEffectManager: ButtonEffectManager;
    private buttonPageManager: ButtonPageManager;
    private cardStateManager: CardStateManager;
    private cardPageManager: CardPageManager;

    private cameraRepository: CameraRepository
    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.myDeckButtonRepository = MyDeckButtonRepositoryImpl.getInstance();
        this.myDeckButtonClickDetectRepository = MyDeckButtonClickDetectRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
        this.myDeckButtonEffectRepository = MyDeckButtonEffectRepositoryImpl.getInstance();
        this.myDeckCardRepository = MyDeckCardRepositoryImpl.getInstance();

        this.buttonStateManager = ButtonStateManager.getInstance();
        this.buttonEffectManager = ButtonEffectManager.getInstance();
        this.cardStateManager = CardStateManager.getInstance();
        this.cardPageManager = CardPageManager.getInstance();
        this.buttonPageManager = ButtonPageManager.getInstance();
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

    async handleLeftClick(clickPoint: { x: number; y: number }): Promise<MyDeckButton | null> {
        const { x, y } = clickPoint;
        const buttonIdList = this.getAllDeckButtonId();
        const currentPageIds = this.getMyDeckButtonsIdForPage(this.getCurrentPage(), buttonIdList);
        const deckButtonList = this.myDeckButtonRepository.findAll().filter(button =>
                currentPageIds.includes(button.id)
        );
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
                this.showDeckButton(hiddenButton.id);
                this.hideDeckButtonEffect(hiddenButton.id);
                this.setDeckCardVisibility(hiddenButton.id, false);
                this.resetCurrentCardPage();
                console.log(`Deck Button ID ${hiddenButton.id} is now shown.`);
            }

            if (currentClickDeckButtonId !== null){
                this.hideDeckButton(currentClickDeckButtonId);
                this.showDeckButtonEffect(currentClickDeckButtonId);
                console.log(`Deck Button ID ${currentClickDeckButtonId} is now hidden.`);
            }

            return clickedDeckButton;
        }

        return null;
    }

//     public async onMouseDown(event: MouseEvent): Promise<void> {
//         if (event.button === 0) {
//             const clickPoint = { x: event.clientX, y: event.clientY };
//             await this.handleLeftClick(clickPoint);
//         }
//     }

    public async onMouseDown(event: MouseEvent): Promise<MyDeckButton | null> {
        if (event.button === 0) {
            const clickPoint = { x: event.clientX, y: event.clientY };
            return await this.handleLeftClick(clickPoint);
        }
        return null;
    }

    private getButtonClickCount(): number {
        return this.buttonStateManager.getButtonClickCount();
    }

    private setButtonClickCount(clickCount: number): void {
        this.buttonStateManager.setButtonClickCount(clickCount);
    }

    private resetButtonClickCount(): void {
        this.buttonStateManager.resetButtonClickCount();
    }

    public getButtonVisibility(buttonId: number): boolean {
        return this.buttonStateManager.findVisibility(buttonId);
    }

    public setButtonVisibility(buttonId: number, isVisible: boolean): void {
       this.buttonStateManager.setVisibility(buttonId, isVisible);
    }

    public getEffectVisibility(effectId: number): boolean {
        return this.buttonEffectManager.findVisibility(effectId);
    }

    public setEffectVisibility(effectId: number, isVisible: boolean): void {
        this.buttonEffectManager.setVisibility(effectId, isVisible);
    }

    private showDeckButton(buttonId: number): void {
        this.setButtonVisibility(buttonId, true);
        const button = this.getDeckButtonById(buttonId);
        if (button) {
            button.getMesh().visible = true;
        }
    }

    private hideDeckButton(buttonId: number): void {
        this.setButtonVisibility(buttonId, false);
        const button = this.getDeckButtonById(buttonId);
        if (button) {
            button.getMesh().visible = false;
        }
    }

    private showDeckButtonEffect(effectId: number): void {
        this.setEffectVisibility(effectId, true);
        const buttonEffect = this.getDeckButtonEffectById(effectId);
         if (buttonEffect) {
             buttonEffect.getMesh().visible = true;
         }
    }

    private hideDeckButtonEffect(effectId: number): void {
        this.setEffectVisibility(effectId, false);
        const buttonEffect = this.getDeckButtonEffectById(effectId);
        if (buttonEffect) {
            buttonEffect.getMesh().visible = false;
        }
    }

    private getCurrentPage(): number {
        return this.buttonPageManager.getCurrentPage();
    }

    private getMyDeckButtonsIdForPage(page: number, buttonIdList: number[]): number[] {
        return this.buttonPageManager.findButtonIdsForPage(page, buttonIdList);
    }

    private getDeckButtonById(buttonId: number): MyDeckButton | null {
        return this.myDeckButtonRepository.findById(buttonId);
    }

    public getAllDeckButtonId(): number[] {
        return this.myDeckButtonRepository.findAllButtonIds();
    }

    private getDeckButtonEffectById(buttonId: number): MyDeckButtonEffect | null {
        return this.myDeckButtonEffectRepository.findById(buttonId);
    }

    // 덱 버튼 클릭 시 이전에 클릭한 덱 카드 visible false
    private setDeckCardVisibility(buttonId: number, isVisible: boolean): void {
        const deckId = buttonId + 1;
        this.cardStateManager.setAllCardVisibility(deckId, isVisible);

        const cardMeshList = this.getCardMeshesByDeckId(deckId);
        cardMeshList.forEach((mesh) => {
            mesh.visible = isVisible;
        });
    }

    private getCardMeshesByDeckId(deckId: number): THREE.Mesh[] {
        return this.myDeckCardRepository.findCardMeshesByDeckId(deckId);
    }

    // 새로운 덱 버튼 클릭시 카드 페이지 초기화
    private resetCurrentCardPage(): void {
        this.cardPageManager.resetCurrentPage();
    }

}
