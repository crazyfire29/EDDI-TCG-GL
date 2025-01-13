import {MyDeckButtonClickDetectService} from "./MyDeckButtonClickDetectService";
import {MyDeckButtonRepositoryImpl} from "../../my_deck_button/repository/MyDeckButtonRepositoryImpl";
import {MyDeckButtonRepository} from "../../my_deck_button/repository/MyDeckButtonRepository";
import {MyDeckButton} from "../../my_deck_button/entity/MyDeckButton";
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
        this.buttonEffectManager = new ButtonEffectManager();
        this.cardStateManager = CardStateManager.getInstance();
        this.cardPageManager = CardPageManager.getInstance();

        const allButtonsMap = this.myDeckButtonRepository.getAllMyDeckButtons();
        this.buttonPageManager = ButtonPageManager.getInstance(allButtonsMap);
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

        const currentPageIds = this.getMyDeckButtonsIdForPage(this.getCurrentPage());

//         const deckButtonList = this.myDeckButtonRepository.findAll();
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
//                 this.setButtonClickCount(1);
                console.log(`[DEBUG] Different button clicked. Reset click count to 1.`);
                this.setButtonVisibility(hiddenButton.id, true);
                const buttonShow = this.showDeckButton(hiddenButton.id);
                if (buttonShow) {
                    this.hideDeckButtonEffect(hiddenButton.id);
                    this.setEffectVisibility(hiddenButton.id, false);
                    this.setDeckCardVisibility(hiddenButton.id, false);
                    this.resetCurrentCardPage();
                    console.log(`Deck Button ID ${hiddenButton.id} is now shown.`);
                } else {
                    console.error(`Failed to show Deck Button ID ${hiddenButton.id}`);
                }

//             } else {
//                 this.setButtonClickCount(this.getButtonClickCount() + 1);
//                 console.log(`[DEBUG] button clicked. Click Count: ${this.getButtonClickCount()}`);
//
//                 if (this.getButtonClickCount() === 2) {
//                     console.log(`[DEBUG] Trigger event for the same button on 2nd click.`);
//                     if (currentClickDeckButtonId !== null) {
//                         console.log(`[DEBUG] Current Click Button?: ${currentClickDeckButtonId}`);
//                         this.setButtonVisibility(currentClickDeckButtonId, true);
//                         const effectHide = this.hideDeckButtonEffect(currentClickDeckButtonId);
//                         if (effectHide) {
//                             this.setEffectVisibility(currentClickDeckButtonId, false);
//                             this.showDeckButton(currentClickDeckButtonId);
//                             this.setDeckCardVisibility(currentClickDeckButtonId, false);
//                             this.resetCurrentCardPage();
//                             console.log(`[DEBUG]Deck Button ID ${currentClickDeckButtonId} is now shown.`);
//                         } else {
//                             console.error(`[DEBUG]Failed to show Deck Button ID ${currentClickDeckButtonId}`);
//                         }
//                     }
//                     return null;
//
//                 } else if (this.getButtonClickCount() > 2) {
//                     this.setButtonClickCount(1);
//                     console.log(`[DEBUG] Reset click count to 1 after 3rd click.`);
//                     console.log(`[DEBUG] button clicked. Click Count: ${this.getButtonClickCount()}`);
//                 }
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

//     public async onMouseDown(event: MouseEvent): Promise<void> {
//         if (event.button === 0) {
//             const clickPoint = { x: event.clientX, y: event.clientY };
//             await this.handleLeftClick(clickPoint);
//         }
//     }

    public async onMouseDown(event: MouseEvent): Promise<MyDeckButton | null> {
        if (event.button === 0) {
            const clickPoint = { x: event.clientX, y: event.clientY };
            return await this.handleLeftClick(clickPoint); //
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

    private getCurrentPage(): number {
        return this.buttonPageManager.getCurrentPage();
    }

    private getMyDeckButtonsIdForPage(page: number): number[] {
        return this.buttonPageManager.getButtonsIdForPage(page);
    }

    private getDeckButtonById(buttonId: number): MyDeckButton | null {
        return this.myDeckButtonRepository.findById(buttonId);
    }

    // 덱 버튼 클릭 시 이전에 클릭한 덱 카드 visible false
    private setDeckCardVisibility(buttonId: number, isVisible: boolean): void {
        const deckId = buttonId + 1;
        this.cardStateManager.setDeckVisibility(deckId, isVisible);

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
