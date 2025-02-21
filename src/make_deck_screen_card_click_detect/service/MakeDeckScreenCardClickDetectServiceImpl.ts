import * as THREE from "three";
import {getCardById} from "../../card/utility";

import {MakeDeckScreenCardClickDetectService} from "./MakeDeckScreenCardClickDetectService";
import {MakeDeckScreenCardClickDetectRepositoryImpl} from "../repository/MakeDeckScreenCardClickDetectRepositoryImpl";
import {MakeDeckScreenCard} from "../../make_deck_screen_card/entity/MakeDeckScreenCard";
import {MakeDeckScreenCardRepositoryImpl} from "../../make_deck_screen_card/repository/MakeDeckScreenCardRepositoryImpl";
import {RaceButtonClickDetectRepositoryImpl} from "../../race_button_click_detect/repository/RaceButtonClickDetectRepositoryImpl";
import {MakeDeckScreenDoneButtonRepositoryImpl} from "../../make_deck_screen_done_button/repository/MakeDeckScreenDoneButtonRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

import {CardPageManager} from "../../make_deck_screen_card_manager/CardPageManager";
import {CardStateManager} from "../../make_deck_screen_card_manager/CardStateManager";
import {CardCountManager} from "../../make_deck_screen_card_manager/CardCountManager";

export class MakeDeckScreenCardClickDetectServiceImpl implements MakeDeckScreenCardClickDetectService {
    private static instance: MakeDeckScreenCardClickDetectServiceImpl | null = null;

    private makeDeckScreenCardRepository: MakeDeckScreenCardRepositoryImpl;
    private makeDeckScreenCardClickDetectRepository: MakeDeckScreenCardClickDetectRepositoryImpl;
    private raceButtonClickDetectRepository: RaceButtonClickDetectRepositoryImpl;
    private makeDeckScreenDoneButtonRepository: MakeDeckScreenDoneButtonRepositoryImpl;

    private cardPageManager: CardPageManager;
    private cardStateManager: CardStateManager;
    private cardCountManager: CardCountManager;

    private cameraRepository: CameraRepository
    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.makeDeckScreenCardRepository = MakeDeckScreenCardRepositoryImpl.getInstance();
        this.makeDeckScreenCardClickDetectRepository = MakeDeckScreenCardClickDetectRepositoryImpl.getInstance();
        this.raceButtonClickDetectRepository = RaceButtonClickDetectRepositoryImpl.getInstance();
        this.makeDeckScreenDoneButtonRepository = MakeDeckScreenDoneButtonRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();

        this.cardPageManager = CardPageManager.getInstance();
        this.cardStateManager = CardStateManager.getInstance();
        this.cardCountManager = CardCountManager.getInstance();
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

            // 사용자가 소지한 카드 갯수와 카드 등급에 따라 카드 클릭 횟수 제한
            this.saveCardClickCount(cardId);

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

            const totalSelectedCardCount = this.getTotalSelectedCardCount();
            if (totalSelectedCardCount == 40) {
                this.setDoneButtonVisible(0, false);
                this.setDoneButtonVisible(1, true);
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
        this.cardCountManager.saveCurrentClickedCardId(cardId);
    }

    public getCurrentClickedCardId(): number | null {
        return this.cardCountManager.findCurrentClickedCardId();
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

    private saveCardClickCount(cardId: number): void {
        const userOwnedCardCount = this.makeDeckScreenCardRepository.findCardCountByCardId(cardId);
        const cardClickCount = this.cardCountManager.getCardClickCount(cardId);

        const card = getCardById(cardId);
        if (!card) {
            throw new Error(`Card with ID ${cardId} not found`);
        }
        const grade = Number(card.등급);
        const maxAllowedByGrade = this.cardCountManager.getMaxClickCountByGrade(grade);
        const gradeClickCount = this.cardCountManager.getGradeClickCount(grade);

        // 등급별 제한 검사
        if (gradeClickCount >= maxAllowedByGrade) {
            console.warn(`[DEBUG] Grade limit exceeded (grade: ${grade}, max count: ${maxAllowedByGrade})`);
            this.showPopupMessage("You can no longer select cards of this grade.");
            return;
        }

        // 사용자가 소지한 개수 제한 검사
        if (userOwnedCardCount !== null && cardClickCount >= userOwnedCardCount) {
            console.warn(`[DEBUG] User Owned Card Not Enough: ${cardId} (Owned Card Count: ${userOwnedCardCount})`);
            this.showPopupMessage("You do not have enough cards.");
            return;
        }

        //선택 횟수 증가
        this.cardCountManager.incrementCardClickCount(cardId);
        this.cardCountManager.incrementGradeClickCount(grade);
    }

    private showPopupMessage(message: string): void {
        // 팝업 메시지 처리: 후에 UI에 표현할 예정
        console.log(`[POPUP] ${message}`);
    }

    private getTotalSelectedCardCount(): number {
        return this.cardCountManager.findTotalSelectedCardCount();
    }

    private setDoneButtonVisible(buttonId: number, isVisible: boolean): void {
        if (isVisible == true){
            this.makeDeckScreenDoneButtonRepository.showButton(buttonId);
        } else {
            this.makeDeckScreenDoneButtonRepository.hideButton(buttonId);
        }
    }

}
