import * as THREE from "three";
import {getCardById} from "../../card/utility";

import {MyCardScreenCardHoverDetectService} from "./MyCardScreenCardHoverDetectService";
import {MyCardScreenCardHoverDetectRepositoryImpl} from "../repository/MyCardScreenCardHoverDetectRepositoryImpl";
import {MyCardScreenCard} from "../../my_card_screen_card/entity/MyCardScreenCard";
import {MyCardScreenCardRepositoryImpl} from "../../my_card_screen_card/repository/MyCardScreenCardRepositoryImpl";
import {MyCardRaceButtonClickDetectRepositoryImpl} from "../../my_card_race_button_click_detect/repository/MyCardRaceButtonClickDetectRepositoryImpl";
import {MyCardScreenCardEffect} from "../../my_card_screen_card_effect/entity/MyCardScreenCardEffect";
import {MyCardScreenCardEffectRepositoryImpl} from "../../my_card_screen_card_effect/repository/MyCardScreenCardEffectRepositoryImpl";

import {CardStateManager} from "../../my_card_screen_card_manager/CardStateManager";
import {CardEffectStateManager} from "../../my_card_screen_card_effect_manager/CardEffectStateManager";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

export class MyCardScreenCardHoverDetectServiceImpl implements MyCardScreenCardHoverDetectService {
    private static instance: MyCardScreenCardHoverDetectServiceImpl | null = null;
    private myCardScreenCardRepository: MyCardScreenCardRepositoryImpl;
    private myCardScreenCardHoverDetectRepository: MyCardScreenCardHoverDetectRepositoryImpl;
    private raceButtonClickDetectRepository: MyCardRaceButtonClickDetectRepositoryImpl;
    private myCardScreenCardEffectRepository: MyCardScreenCardEffectRepositoryImpl;

    private cardStateManager: CardStateManager;
    private cardEffectStateManager: CardEffectStateManager;

    private cameraRepository: CameraRepository;
    private cardDetectState: boolean = true;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.myCardScreenCardRepository = MyCardScreenCardRepositoryImpl.getInstance();
        this.myCardScreenCardHoverDetectRepository = MyCardScreenCardHoverDetectRepositoryImpl.getInstance();
        this.raceButtonClickDetectRepository = MyCardRaceButtonClickDetectRepositoryImpl.getInstance();
        this.myCardScreenCardEffectRepository = MyCardScreenCardEffectRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();

        this.cardStateManager = CardStateManager.getInstance();
        this.cardEffectStateManager = CardEffectStateManager.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): MyCardScreenCardHoverDetectServiceImpl {
        if (!MyCardScreenCardHoverDetectServiceImpl.instance) {
            MyCardScreenCardHoverDetectServiceImpl.instance = new MyCardScreenCardHoverDetectServiceImpl(camera, scene);
        }
        return MyCardScreenCardHoverDetectServiceImpl.instance;
    }

    setCardDetectState(state: boolean): void {
        this.cardDetectState = state;
    }

    getCardDetectState(): boolean {
        return this.cardDetectState;
    }

    async handleHover(hoverPoint: { x: number; y: number }): Promise<MyCardScreenCard | null> {
        const { x, y } = hoverPoint;
        const raceButtonId = this.getCurrentClickedRaceButtonId() ?? 0;
        const cardIdList = this.getCardIdListByClickedRaceButtonId(raceButtonId);
        const cardList = this.getCardListByClickedRaceButtonId(raceButtonId);
        if (!cardList) return null;

        const hoveredCard = this.myCardScreenCardHoverDetectRepository.isMyCardScreenCardHover(
            { x, y },
            cardList,
            this.camera
        );

        if (hoveredCard) {
            const cardId = this.getCardIdByCardUniqueId(hoveredCard.id);
            console.log(`[DEBUG] Hovered Card Unique Id: ${hoveredCard.id}, Card ID: ${cardId}`);
            this.saveCurrentHoveredCardId(cardId);

            const currentHoveredCardId = this.getCurrentHoveredCardId();
            const hiddenCardId = cardIdList.find(
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

    public async onMouseMove(event: MouseEvent): Promise<MyCardScreenCard | null> {
        if (event.button === 0) {
            const hoverPoint = { x: event.clientX, y: event.clientY };
            return await this.handleHover(hoverPoint);
        }
        return null;
    }

    public getCurrentClickedRaceButtonId(): number | null {
        return this.raceButtonClickDetectRepository.findCurrentClickedRaceButtonId();
    }

    public getCardListByClickedRaceButtonId(raceButtonId: number): MyCardScreenCard[] | null {
        const raceId = (raceButtonId + 1).toString();
        return this.myCardScreenCardRepository.findCardListByRaceId(raceId);
    }

    private getCardIdListByClickedRaceButtonId(raceButtonId: number): number[] {
        const raceId = (raceButtonId + 1).toString();
        return this.myCardScreenCardRepository.findCardIdsByRaceId(raceId);
    }

    public getCardIdByCardUniqueId(cardUniqueId: number): number {
        return this.myCardScreenCardRepository.findCardIdByCardUniqueId(cardUniqueId) ?? -1;
    }

    public saveCurrentHoveredCardId(cardId: number): void {
        this.myCardScreenCardHoverDetectRepository.saveCurrentHoveredCardId(cardId);
    }

    public getCurrentHoveredCardId(): number | null {
        return this.myCardScreenCardHoverDetectRepository.findCurrentHoveredCardId();
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
