import * as THREE from "three";
import {getCardById} from "../../card/utility";

import {BlockDeleteButtonClickDetectService} from "./BlockDeleteButtonClickDetectService";
import {BlockDeleteButtonClickDetectRepositoryImpl} from "../repository/BlockDeleteButtonClickDetectRepositoryImpl";
import {BlockDeleteButton} from "../../block_delete_button/entity/BlockDeleteButton";
import {BlockDeleteButtonRepositoryImpl} from "../../block_delete_button/repository/BlockDeleteButtonRepositoryImpl";
import {MakeDeckScreenCardRepositoryImpl} from "../../make_deck_screen_card/repository/MakeDeckScreenCardRepositoryImpl";
import {CardCountManager} from "../../make_deck_screen_card_manager/CardCountManager";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";


export class BlockDeleteButtonClickDetectServiceImpl implements BlockDeleteButtonClickDetectService {
    private static instance: BlockDeleteButtonClickDetectServiceImpl | null = null;
    private blockDeleteButtonClickDetectRepository: BlockDeleteButtonClickDetectRepositoryImpl;
    private blockDeleteButtonRepository: BlockDeleteButtonRepositoryImpl;
    private makeDeckScreenCardRepository: MakeDeckScreenCardRepositoryImpl;
    private cardCountManager: CardCountManager;
    private cameraRepository: CameraRepository;

    private mouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.blockDeleteButtonClickDetectRepository = BlockDeleteButtonClickDetectRepositoryImpl.getInstance();
        this.blockDeleteButtonRepository = BlockDeleteButtonRepositoryImpl.getInstance();
        this.makeDeckScreenCardRepository = MakeDeckScreenCardRepositoryImpl.getInstance();
        this.cardCountManager = CardCountManager.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): BlockDeleteButtonClickDetectServiceImpl {
        if (!BlockDeleteButtonClickDetectServiceImpl.instance) {
            BlockDeleteButtonClickDetectServiceImpl.instance = new BlockDeleteButtonClickDetectServiceImpl(camera, scene);
        }
        return BlockDeleteButtonClickDetectServiceImpl.instance;
    }

    setMouseDown(state: boolean): void {
        this.mouseDown = state;
    }

    isMouseDown(): boolean {
        return this.mouseDown;
    }

    public async handleButtonClick(clickPoint: { x: number; y: number }): Promise<BlockDeleteButton | null> {
        const { x, y } = clickPoint;
        const buttonList = this.getAllButtons();
        const clickedButton = this.blockDeleteButtonClickDetectRepository.isButtonClicked(
            { x, y },
            buttonList,
            this.camera
        );

        if (clickedButton) {
            const buttonId = clickedButton.id;
            const cardId = this.getCardIdByButtonUniqueId(buttonId);
            console.log(`[DEBUG] Clicked Delete Button ID: ${buttonId}, Card ID: ${cardId}`);
            this.saveCurrentClickedButtonId(cardId);
            this.saveCardClickCount(cardId);

            return clickedButton;
        }
        return null;
    }

    public async onMouseDown(event: MouseEvent): Promise<BlockDeleteButton | null> {
        if (event.button === 0) {
            const clickPoint = { x: event.clientX, y: event.clientY };
            return await this.handleButtonClick(clickPoint);
        }
        return null;
    }

    public getAllButtons(): BlockDeleteButton[] {
        return this.blockDeleteButtonRepository.findAllButtons();
    }

    public getCardIdByButtonUniqueId(buttonUniqueId: number): number {
        return this.blockDeleteButtonRepository.findCardIdByButtonId(buttonUniqueId) ?? -1;
    }

    public saveCurrentClickedButtonId(cardId: number): void {
        this.blockDeleteButtonClickDetectRepository.saveCurrentClickedButtonId(cardId);
    }

    public getCurrentClickedButtonId(): number | null {
        return this.blockDeleteButtonClickDetectRepository.findCurrentClickedButtonId();
    }

    private getButtonCardIdList(): number[] {
        return this.blockDeleteButtonRepository.findCardIdList();
    }

    private saveCardClickCount(cardId: number): void {
        const currentSelectedCardCount = this.cardCountManager.getCardClickCount(cardId);

        const card = getCardById(cardId);
        if (!card) {
            throw new Error(`Card with ID ${cardId} not found`);
        }
        const grade = Number(card.등급);

        if (currentSelectedCardCount == 0) {
            console.warn(`[DEBUG] Card id: ${cardId}, Count: ${currentSelectedCardCount} No more cards to remove.`);
            return;
        }

        // 선택 횟수 감소
        this.cardCountManager.decrementCardClickCount(cardId);
        this.cardCountManager.decrementGradeClickCount(grade);
    }

}
