import * as THREE from "three";

import {PageMovementButtonClickDetectService} from "./PageMovementButtonClickDetectService";
import {PageMovementButtonClickDetectRepositoryImpl} from "../repository/PageMovementButtonClickDetectRepositoryImpl";

import {CardPageMovementButton} from "../../make_deck_card_page_movement_button/entity/CardPageMovementButton";
import {CardPageMovementButtonRepositoryImpl} from "../../make_deck_card_page_movement_button/repository/CardPageMovementButtonRepositoryImpl";
import {RaceButtonClickDetectRepositoryImpl} from "../../race_button_click_detect/repository/RaceButtonClickDetectRepositoryImpl";
import {MakeDeckScreenCardRepositoryImpl} from "../../make_deck_screen_card/repository/MakeDeckScreenCardRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

import {CardStateManager} from "../../make_deck_screen_card_manager/CardStateManager";
import {CardPageManager} from "../../make_deck_screen_card_manager/CardPageManager";

export class PageMovementButtonClickDetectServiceImpl implements PageMovementButtonClickDetectService {
    private static instance: PageMovementButtonClickDetectServiceImpl | null = null;

    private cardPageMovementButtonRepository: CardPageMovementButtonRepositoryImpl;
    private pageMovementButtonClickDetectRepository: PageMovementButtonClickDetectRepositoryImpl;
    private raceButtonClickDetectRepository: RaceButtonClickDetectRepositoryImpl;
    private makeDeckScreenCardRepository: MakeDeckScreenCardRepositoryImpl;

    private cardStateManager: CardStateManager;
    private cardPageManager: CardPageManager;

    private cameraRepository: CameraRepository
    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.cardPageMovementButtonRepository = CardPageMovementButtonRepositoryImpl.getInstance();
        this.pageMovementButtonClickDetectRepository = PageMovementButtonClickDetectRepositoryImpl.getInstance();
        this.raceButtonClickDetectRepository = RaceButtonClickDetectRepositoryImpl.getInstance();
        this.makeDeckScreenCardRepository = MakeDeckScreenCardRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();

        this.cardStateManager = CardStateManager.getInstance();
        this.cardPageManager = CardPageManager.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): PageMovementButtonClickDetectServiceImpl {
        if (!PageMovementButtonClickDetectServiceImpl.instance) {
            PageMovementButtonClickDetectServiceImpl.instance = new PageMovementButtonClickDetectServiceImpl(camera, scene);
        }
        return PageMovementButtonClickDetectServiceImpl.instance;
    }

    setLeftMouseDown(state: boolean): void {
        this.leftMouseDown = state;
    }

    isLeftMouseDown(): boolean {
        return this.leftMouseDown;
    }

    async handleLeftClick(clickPoint: { x: number; y: number }): Promise<CardPageMovementButton | null> {
        const { x, y } = clickPoint;
        const cardPageMovementButtonList = this.getAllCardPageMovementButtons();
        const clickedPageMovementButton = this.pageMovementButtonClickDetectRepository.isPageMovementButtonClicked(
            { x, y },
            cardPageMovementButtonList,
            this.camera
        );

        const clickedCurrentRaceButtonId = this.getCurrentClickedRaceButtonId();
        if (clickedCurrentRaceButtonId == null) {
            console.error("No Race Button clicked");
            return null;
        }
        const cardIdList = this.getCardIdListByRaceId(clickedCurrentRaceButtonId);

        if (clickedPageMovementButton) {
            this.saveCurrentClickedCardPageMovementButtonId(clickedPageMovementButton.id);
            const currentClickedButtonId = this.getCurrentClickedCardPageMovementButtonId();

            switch(currentClickedButtonId) {
                case 0:
                    console.log(`Clicked Prev Button!: ${currentClickedButtonId}`);
                    if (this.getCurrentCardPage() > 1) {
                        this.setCardsVisibility(cardIdList, false);
                        this.setCurrentCardPage(this.getCurrentCardPage() - 1);
                        this.setCardsVisibility(cardIdList, true);
                    }
                    break;
                case 1:
                    console.log(`Clicked Next Button!: ${currentClickedButtonId}`);
                    if (this.getCurrentCardPage() < this.getTotalCardPages(cardIdList)) {
                        this.setCardsVisibility(cardIdList, false);
                        this.setCurrentCardPage(this.getCurrentCardPage() + 1);
                        this.setCardsVisibility(cardIdList, true);
                    }
                    break;
                default:
                    console.warn(`[WARN] Not Found Page Movement Button Id: ${currentClickedButtonId}`);
            }

            return clickedPageMovementButton;
        }

        return null;
    }


    public async onMouseDown(event: MouseEvent): Promise<CardPageMovementButton | null> {
        if (event.button === 0) {
            const clickPoint = { x: event.clientX, y: event.clientY };
            return await this.handleLeftClick(clickPoint);
        }
        return null;
    }

    private getAllCardPageMovementButtons(): CardPageMovementButton[] {
        return this.cardPageMovementButtonRepository.findAll();
    }

    private saveCurrentClickedCardPageMovementButtonId(buttonId: number): void {
        this.pageMovementButtonClickDetectRepository.saveCurrentClickedPageMovementButtonId(buttonId);
    }

    private getCurrentClickedCardPageMovementButtonId(): number | null {
        return this.pageMovementButtonClickDetectRepository.findCurrentClickedPageMovementButtonId();
    }

    private getCurrentClickedRaceButtonId(): number | null {
        return this.raceButtonClickDetectRepository.findCurrentClickedRaceButtonId();
    }

    private getCardIdListByRaceId(buttonId: number): number[] {
        const raceId = (buttonId + 1).toString();
        return this.makeDeckScreenCardRepository.findCardIdsByRaceId(raceId);
    }

    private getCurrentCardPage(): number {
        return this.cardPageManager.getCurrentPage();
    }

    private setCurrentCardPage(page: number): void {
        this.cardPageManager.setCurrentPage(page);
    }

    private getTotalCardPages(cardIdList: number[]): number {
        return this.cardPageManager.getTotalPages(cardIdList);
    }

    private setCardsVisibility(cardIdList: number[], isVisible: boolean): void {
        const currentCardPage = this.getCurrentCardPage();
        const currentPageCardId = this.cardPageManager.findCardIdsForPage(currentCardPage, cardIdList);
        currentPageCardId.forEach((cardId) => {
            this.cardStateManager.setCardVisibility(cardId, isVisible);
        });
    }

}
