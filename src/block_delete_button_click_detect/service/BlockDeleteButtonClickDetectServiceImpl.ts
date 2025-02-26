import * as THREE from "three";
import {getCardById} from "../../card/utility";

import {BlockDeleteButtonClickDetectService} from "./BlockDeleteButtonClickDetectService";
import {BlockDeleteButtonClickDetectRepositoryImpl} from "../repository/BlockDeleteButtonClickDetectRepositoryImpl";
import {BlockDeleteButton} from "../../block_delete_button/entity/BlockDeleteButton";
import {BlockDeleteButtonRepositoryImpl} from "../../block_delete_button/repository/BlockDeleteButtonRepositoryImpl";
import {MakeDeckScreenCardRepositoryImpl} from "../../make_deck_screen_card/repository/MakeDeckScreenCardRepositoryImpl";
import {BlockDeleteButtonPositionRepositoryImpl} from "../../block_delete_button_position/repository/BlockDeleteButtonPositionRepositoryImpl";
import {BlockAddButtonRepositoryImpl} from "../../block_add_button/repository/BlockAddButtonRepositoryImpl";
import {BlockAddButtonPositionRepositoryImpl} from "../../block_add_button_position/repository/BlockAddButtonPositionRepositoryImpl";

import {SelectedCardBlockRepositoryImpl} from "../../selected_card_block/repository/SelectedCardBlockRepositoryImpl";
import {SelectedCardBlockPositionRepositoryImpl} from "../../selected_card_block_position/repository/SelectedCardBlockPositionRepositoryImpl";
import {SelectedCardBlockEffectRepositoryImpl} from "../../selected_card_block_effect/repository/SelectedCardBlockEffectRepositoryImpl";
import {SelectedCardBlockEffectPositionRepositoryImpl} from "../../selected_card_block_effect_position/repository/SelectedCardBlockEffectPositionRepositoryImpl";

import {CardCountManager} from "../../make_deck_screen_card_manager/CardCountManager";
import {SelectedCardBlockStateManager} from "../../selected_card_block_manager/SelectedCardBlockStateManager";
import {SelectedCardBlockEffectStateManager} from "../../selected_card_block_effect_manager/SelectedCardBlockEffectStateManager";
import {AddDeleteButtonStateManager} from "../../block_add_delete_button_manager/AddDeleteButtonStateManager";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";


export class BlockDeleteButtonClickDetectServiceImpl implements BlockDeleteButtonClickDetectService {
    private static instance: BlockDeleteButtonClickDetectServiceImpl | null = null;
    private blockDeleteButtonClickDetectRepository: BlockDeleteButtonClickDetectRepositoryImpl;
    private blockDeleteButtonRepository: BlockDeleteButtonRepositoryImpl;
    private blockDeleteButtonPositionRepository: BlockDeleteButtonPositionRepositoryImpl;
    private blockAddButtonRepository: BlockAddButtonRepositoryImpl;
    private blockAddButtonPositionRepository: BlockAddButtonPositionRepositoryImpl;
    private makeDeckScreenCardRepository: MakeDeckScreenCardRepositoryImpl;
    private cameraRepository: CameraRepository;

    private selectedCardBlockRepository: SelectedCardBlockRepositoryImpl;
    private selectedCardBlockPositionRepository: SelectedCardBlockPositionRepositoryImpl;
    private selectedCardEffectRepository: SelectedCardBlockEffectRepositoryImpl;
    private selectedCardEffectPositionRepository: SelectedCardBlockEffectPositionRepositoryImpl;

    private cardCountManager: CardCountManager;
    private selectedCardBockStateManager: SelectedCardBlockStateManager;
    private selectedCardEffectStateManager: SelectedCardBlockEffectStateManager;
    private addDeleteButtonStateManager: AddDeleteButtonStateManager;

    private mouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.blockDeleteButtonClickDetectRepository = BlockDeleteButtonClickDetectRepositoryImpl.getInstance();
        this.blockDeleteButtonRepository = BlockDeleteButtonRepositoryImpl.getInstance();
        this.blockDeleteButtonPositionRepository = BlockDeleteButtonPositionRepositoryImpl.getInstance();
        this.blockAddButtonRepository = BlockAddButtonRepositoryImpl.getInstance();
        this.blockAddButtonPositionRepository = BlockAddButtonPositionRepositoryImpl.getInstance();
        this.makeDeckScreenCardRepository = MakeDeckScreenCardRepositoryImpl.getInstance();

        this.selectedCardBlockRepository = SelectedCardBlockRepositoryImpl.getInstance();
        this.selectedCardBlockPositionRepository = SelectedCardBlockPositionRepositoryImpl.getInstance();
        this.selectedCardEffectRepository = SelectedCardBlockEffectRepositoryImpl.getInstance();
        this.selectedCardEffectPositionRepository = SelectedCardBlockEffectPositionRepositoryImpl.getInstance();

        this.cameraRepository = CameraRepositoryImpl.getInstance();

        this.cardCountManager = CardCountManager.getInstance();
        this.selectedCardBockStateManager = SelectedCardBlockStateManager.getInstance();
        this.selectedCardEffectStateManager = SelectedCardBlockEffectStateManager.getInstance();
        this.addDeleteButtonStateManager = AddDeleteButtonStateManager.getInstance();
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

            const currentCardCount = this.cardCountManager.getCardClickCount(cardId);
            if (currentCardCount == 0) {
                this.deleteBlockByCardId(cardId);
                this.deleteEffectByCardId(cardId);
                this.deleteAddDeleteButtonByCardId(cardId);

                console.log(`[Checking!!!!]`);
                this.selectedCardBlockRepository.blockCount();
                this.cardCountManager.findTotalSelectedCardCount();
            }

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

    private deleteBlockByCardId(cardId: number): void {
        this.selectedCardBockStateManager.setBlockVisibility(cardId, false);
        const blockId = this.selectedCardBlockRepository.findBlockIdByCardId(cardId);
        const positionId = this.selectedCardBlockPositionRepository.findPositionIdByCardId(cardId);
        if (blockId && positionId) {
            this.selectedCardBlockRepository.deleteBlockByBlockId(blockId);
            this.selectedCardBlockPositionRepository.deleteById(positionId);
        }
    }

    private deleteEffectByCardId(cardId: number): void {
        this.selectedCardEffectStateManager.setEffectVisibility(cardId, false);
        const effectId = this.selectedCardEffectRepository.findEffectIdByCardId(cardId);
        const positionId = this.selectedCardEffectPositionRepository.findPositionIdByCardId(cardId);
        if (effectId && positionId) {
            this.selectedCardEffectRepository.deleteEffectByEffectId(effectId);
            this.selectedCardEffectPositionRepository.deleteById(positionId);
        }
    }

    private deleteAddDeleteButtonByCardId(cardId: number): void {
        this.addDeleteButtonStateManager.setAddButtonVisibility(cardId, false);
        this.addDeleteButtonStateManager.setDeleteButtonVisibility(cardId, false);
        this.blockDeleteButtonRepository.deleteButtonByCardId(cardId);
        this.blockDeleteButtonPositionRepository.deletePositionByCardId(cardId);
        this.blockAddButtonRepository.deleteButtonByCardId(cardId);
        this.blockAddButtonPositionRepository.deletePositionByCardId(cardId);
    }

}
