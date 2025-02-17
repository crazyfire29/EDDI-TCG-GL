import * as THREE from "three";

import {MakeDeckScreenCardClickDetectService} from "./MakeDeckScreenCardClickDetectService";
import {MakeDeckScreenCardClickDetectRepositoryImpl} from "../repository/MakeDeckScreenCardClickDetectRepositoryImpl";
import {MakeDeckScreenCard} from "../../make_deck_screen_card/entity/MakeDeckScreenCard";
import {MakeDeckScreenCardRepositoryImpl} from "../../make_deck_screen_card/repository/MakeDeckScreenCardRepositoryImpl";
import {RaceButtonClickDetectRepositoryImpl} from "../../race_button_click_detect/repository/RaceButtonClickDetectRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

import {CardPageManager} from "../../make_deck_screen_card_manager/CardPageManager";
import {CardStateManager} from "../../make_deck_screen_card_manager/CardStateManager";

export class MakeDeckScreenCardClickDetectServiceImpl implements MakeDeckScreenCardClickDetectService {
    private static instance: MakeDeckScreenCardClickDetectServiceImpl | null = null;

    private makeDeckScreenCardRepository: MakeDeckScreenCardRepositoryImpl;
    private makeDeckScreenCardClickDetectRepository: MakeDeckScreenCardClickDetectRepositoryImpl;
    private raceButtonClickDetectRepository: RaceButtonClickDetectRepositoryImpl;

    private cardPageManager: CardPageManager;
    private cardStateManger: CardStateManager;

    private cameraRepository: CameraRepository
    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.makeDeckScreenCardRepository = MakeDeckScreenCardRepositoryImpl.getInstance();
        this.makeDeckScreenCardClickDetectRepository = MakeDeckScreenCardClickDetectRepositoryImpl.getInstance();
        this.raceButtonClickDetectRepository = RaceButtonClickDetectRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();

        this.cardPageManager = CardPageManager.getInstance();
        this.cardStateManger = CardStateManager.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): MakeDeckScreenCardClickDetectServiceImpl {
        if (!MakeDeckScreenCardClickDetectServiceImpl.instance) {
            MakeDeckScreenCardClickDetectServiceImpl.instance = new MakeDeckScreenCardClickDetectServiceImpl(camera, scene);
        }
        return MakeDeckScreenCardClickDetectServiceImpl.instance;
    }

    setLeftMouseDown(state: boolean): void {
        this.leftMouseDown = state;
    }

    isLeftMouseDown(): boolean {
        return this.leftMouseDown;
    }

    async handleLeftClick(clickPoint: { x: number; y: number }): Promise<MakeDeckScreenCard | null> {
        const { x, y } = clickPoint;
        const raceButtonId = this.getCurrentClickedRaceButtonId() ?? 0;
        const cardIdList = this.getCardIdsByRaceId(raceButtonId);
        const currentPageCardIds = this.getCardsIdForPage(this.getCurrentPage(), cardIdList);
        const cardList = this.getCardByCardId(currentPageCardIds);
        const clickedCard = this.makeDeckScreenCardClickDetectRepository.isMakeDeckScreenCardClicked(
            { x, y },
            cardList,
            this.camera
        );

        if (clickedCard) {
            const cardId = this.getCardIdByCardUniqueId(clickedCard.id);
            console.log(`[DEBUG] Clicked Card Unique Id: ${clickedCard.id}, Card ID: ${cardId}`);
            this.saveCurrentClickedCardId(cardId);

            let cardClickCount = this.getCardClickCount(cardId) ?? 0;
            cardClickCount++;
            console.log(`[DEBUG] Click Count for Card ID ${cardId}: ${cardClickCount}`);
            this.saveCardClickCount(cardId, cardClickCount);

            const currentClickedCardId = this.getCurrentClickedCardId();
            const hiddenCardId = currentPageCardIds.find(
                (cardId) => this.getCardVisibility(cardId) == false
            );
            console.log(`Hidden Card Id?: ${hiddenCardId}`);


            if (currentClickedCardId !== null) {
                this.setCardVisibility(currentClickedCardId, false);
            }

            if (hiddenCardId && hiddenCardId !== currentClickedCardId) {
                this.setCardVisibility(hiddenCardId, true);
            }

            return clickedCard;
        }

        return null;
    }

    public async onMouseDown(event: MouseEvent): Promise<MakeDeckScreenCard | null> {
        if (event.button === 0) {
            const clickPoint = { x: event.clientX, y: event.clientY };
            return await this.handleLeftClick(clickPoint);
        }
        return null;
    }

    public getAllCards(): MakeDeckScreenCard[] {
        return this.makeDeckScreenCardRepository.findAllCard();
    }

    public getAllCardIdList(): number[] {
        return this.makeDeckScreenCardRepository.findCardIdList();
    }

    public getCardIdByCardUniqueId(cardUniqueId: number): number {
        return this.makeDeckScreenCardRepository.findCardIdByCardUniqueId(cardUniqueId) ?? -1;
    }

    public saveCurrentClickedCardId(cardId: number): void {
        this.makeDeckScreenCardClickDetectRepository.saveCurrentClickedCardId(cardId);
    }

    public getCurrentClickedCardId(): number | null {
        return this.makeDeckScreenCardClickDetectRepository.findCurrentClickedCardId();
    }

    private getCardsIdForPage(page: number, cardIdList: number[]): number[] {
        return this.cardPageManager.findCardIdsForPage(page, cardIdList);
    }

    private getCurrentPage(): number {
        return this.cardPageManager.getCurrentPage();
    }

    private getCardByCardId(cardIdList: number[]): MakeDeckScreenCard[] {
        const cardMeshList: MakeDeckScreenCard[] = [];
        cardIdList.forEach((cardId) => {
            const cardMesh = this.makeDeckScreenCardRepository.findCardByCardId(cardId);
            if (cardMesh) {
                cardMeshList.push(cardMesh);
            } else {
                console.warn(`[WARN] Card with ID ${cardId} not found in cardMap`);
            }
        });
        return cardMeshList;
    }

    public getCurrentClickedRaceButtonId(): number | null {
        return this.raceButtonClickDetectRepository.findCurrentClickedRaceButtonId();
    }

    private getCardIdsByRaceId(buttonId: number): number[] {
        const raceId = (buttonId + 1).toString();
        return this.makeDeckScreenCardRepository.findCardIdsByRaceId(raceId);
    }

    private setCardVisibility(cardId: number, isVisible: boolean): void {
        this.cardStateManger.setCardVisibility(cardId, isVisible);
    }

    private getCardVisibility(cardId: number): boolean {
        return this.cardStateManger.findCardVisibility(cardId);
    }

    public getCardClickCount(cardId: number): number | undefined {
        return this.makeDeckScreenCardClickDetectRepository.findCardClickCount(cardId);
    }

    private saveCardClickCount(cardId: number, count: number): void {
        this.makeDeckScreenCardClickDetectRepository.saveCardClickCount(cardId, count);
    }

}
