import * as THREE from "three";
import {getCardById} from "../../card/utility";

import {MakeDeckScreenCardHoverDetectService} from "./MakeDeckScreenCardHoverDetectService";
import {MakeDeckScreenCardHoverDetectRepositoryImpl} from "../repository/MakeDeckScreenCardHoverDetectRepositoryImpl";
import {MakeDeckScreenCard} from "../../make_deck_screen_card/entity/MakeDeckScreenCard";
import {MakeDeckScreenCardRepositoryImpl} from "../../make_deck_screen_card/repository/MakeDeckScreenCardRepositoryImpl";
import {MakeDeckScreenCardEffect} from "../../make_deck_screen_card_effect/entity/MakeDeckScreenCardEffect";
import {MakeDeckScreenCardEffectRepositoryImpl} from "../../make_deck_screen_card_effect/repository/MakeDeckScreenCardEffectRepositoryImpl";
import {RaceButtonClickDetectRepositoryImpl} from "../../race_button_click_detect/repository/RaceButtonClickDetectRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

import {CardPageManager} from "../../make_deck_screen_card_manager/CardPageManager";
import {CardStateManager} from "../../make_deck_screen_card_manager/CardStateManager";
import {CardCountManager} from "../../make_deck_screen_card_manager/CardCountManager";
import {CardEffectStateManager} from "../../make_deck_screen_card_effect_manager/CardEffectStateManager";

export class MakeDeckScreenCardHoverDetectServiceImpl implements MakeDeckScreenCardHoverDetectService {
    private static instance: MakeDeckScreenCardHoverDetectServiceImpl | null = null;
    private makeDeckScreenCardRepository: MakeDeckScreenCardRepositoryImpl;
    private makeDeckScreenCardEffectRepository: MakeDeckScreenCardEffectRepositoryImpl;
    private makeDeckScreenCardHoverDetectRepository: MakeDeckScreenCardHoverDetectRepositoryImpl;
    private raceButtonClickDetectRepository: RaceButtonClickDetectRepositoryImpl;

    private cardPageManager: CardPageManager;
    private cardStateManager: CardStateManager;
    private cardCountManager: CardCountManager;
    private cardEffectStateManager: CardEffectStateManager;

    private cameraRepository: CameraRepository
    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.makeDeckScreenCardRepository = MakeDeckScreenCardRepositoryImpl.getInstance();
        this.makeDeckScreenCardEffectRepository = MakeDeckScreenCardEffectRepositoryImpl.getInstance();
        this.makeDeckScreenCardHoverDetectRepository = MakeDeckScreenCardHoverDetectRepositoryImpl.getInstance();
        this.raceButtonClickDetectRepository = RaceButtonClickDetectRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();

        this.cardPageManager = CardPageManager.getInstance();
        this.cardStateManager = CardStateManager.getInstance();
        this.cardCountManager = CardCountManager.getInstance();
        this.cardEffectStateManager = CardEffectStateManager.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): MakeDeckScreenCardHoverDetectServiceImpl {
        if (!MakeDeckScreenCardHoverDetectServiceImpl.instance) {
            MakeDeckScreenCardHoverDetectServiceImpl.instance = new MakeDeckScreenCardHoverDetectServiceImpl(camera, scene);
        }
        return MakeDeckScreenCardHoverDetectServiceImpl.instance;
    }

    setMouseMove(state: boolean): void {
        this.leftMouseDown = state;
    }

    isMouseMove(): boolean {
        return this.leftMouseDown;
    }

    async handleHover(hoverPoint: { x: number; y: number }): Promise<MakeDeckScreenCard | null> {
        const { x, y } = hoverPoint;
        const raceButtonId = this.getCurrentClickedRaceButtonId() ?? 0;
        const cardIdList = this.getCardIdsByRaceId(raceButtonId);
        const currentPageCardIds = this.getCardsIdForPage(this.getCurrentPage(), cardIdList);
        const cardList = this.getCardByCardId(currentPageCardIds);
        const hoveredCard = this.makeDeckScreenCardHoverDetectRepository.isMakeDeckScreenCardHover(
            { x, y },
            cardList,
            this.camera
        );

        if (hoveredCard) {
            const cardId = this.getCardIdByCardUniqueId(hoveredCard.id);
            console.log(`[DEBUG] Hovered Card Unique Id: ${hoveredCard.id}, Card ID: ${cardId}`);
            this.saveCurrentHoveredCardId(cardId);

            const currentHoveredCardId = this.getCurrentHoveredCardId();
            const hiddenCardId = currentPageCardIds.find(
                (cardId) => this.getCardVisibility(cardId) == false
            );
            console.log(`Hidden Card Id?: ${hiddenCardId}`);


            if (currentHoveredCardId !== null) {
                this.setCardVisibility(currentHoveredCardId, false);
                this.setEffectVisibility(currentHoveredCardId, true);
            }

            if (hiddenCardId && hiddenCardId !== currentHoveredCardId) {
                this.setCardVisibility(hiddenCardId, true);
                this.setEffectVisibility(hiddenCardId, false);
            }

            return hoveredCard;

        } else {
            const allShownEffectIds = this.getShownEffectIds();
            allShownEffectIds.forEach((cardId) => {
                this.setCardVisibility(cardId, true);
                this.setEffectVisibility(cardId, false);
            });
        }

        return null;
    }

    public async onMouseMove(event: MouseEvent): Promise<MakeDeckScreenCard | null> {
        if (event.button === 0) {
            const hoverPoint = { x: event.clientX, y: event.clientY };
            return await this.handleHover(hoverPoint);
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

    public saveCurrentHoveredCardId(cardId: number): void {
        this.makeDeckScreenCardHoverDetectRepository.saveCurrentHoveredCardId(cardId);
    }

    public getCurrentHoveredCardId(): number | null {
        return this.makeDeckScreenCardHoverDetectRepository.findCurrentHoveredCardId();
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
        this.cardStateManager.setCardVisibility(cardId, isVisible);
    }

    private getCardVisibility(cardId: number): boolean {
        return this.cardStateManager.findCardVisibility(cardId);
    }

    private setEffectVisibility(cardId: number, isVisible: boolean): void {
        this.cardEffectStateManager.setEffectVisibility(cardId, isVisible);
    }

    private getShownEffectIds(): number[] {
        return this.cardEffectStateManager.findShownEffectIds();
    }

}
