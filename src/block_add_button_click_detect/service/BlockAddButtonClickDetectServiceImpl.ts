import * as THREE from "three";
import {getCardById} from "../../card/utility";

import {BlockAddButtonClickDetectService} from "./BlockAddButtonClickDetectService";
import {BlockAddButtonClickDetectRepositoryImpl} from "../repository/BlockAddButtonClickDetectRepositoryImpl";
import {BlockAddButton} from "../../block_add_button/entity/BlockAddButton";
import {BlockAddButtonRepositoryImpl} from "../../block_add_button/repository/BlockAddButtonRepositoryImpl";
import {MakeDeckScreenCardRepositoryImpl} from "../../make_deck_screen_card/repository/MakeDeckScreenCardRepositoryImpl";
import {CardCountManager} from "../../make_deck_screen_card_manager/CardCountManager";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";


export class BlockAddButtonClickDetectServiceImpl implements BlockAddButtonClickDetectService {
    private static instance: BlockAddButtonClickDetectServiceImpl | null = null;
    private blockAddButtonClickDetectRepository: BlockAddButtonClickDetectRepositoryImpl;
    private blockAddButtonRepository: BlockAddButtonRepositoryImpl;
    private makeDeckScreenCardRepository: MakeDeckScreenCardRepositoryImpl;
    private cameraRepository: CameraRepository;
    private cardCountManager: CardCountManager;

    private mouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.blockAddButtonClickDetectRepository = BlockAddButtonClickDetectRepositoryImpl.getInstance();
        this.blockAddButtonRepository = BlockAddButtonRepositoryImpl.getInstance();
        this.makeDeckScreenCardRepository = MakeDeckScreenCardRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
        this.cardCountManager = CardCountManager.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): BlockAddButtonClickDetectServiceImpl {
        if (!BlockAddButtonClickDetectServiceImpl.instance) {
            BlockAddButtonClickDetectServiceImpl.instance = new BlockAddButtonClickDetectServiceImpl(camera, scene);
        }
        return BlockAddButtonClickDetectServiceImpl.instance;
    }

    setMouseDown(state: boolean): void {
        this.mouseDown = state;
    }

    isMouseDown(): boolean {
        return this.mouseDown;
    }

    public async handleButtonClick(clickPoint: { x: number; y: number }): Promise<BlockAddButton | null> {
        const { x, y } = clickPoint;
        const buttonList = this.getAllButtons();
        const clickedButton = this.blockAddButtonClickDetectRepository.isButtonClicked(
            { x, y },
            buttonList,
            this.camera
        );

        if (clickedButton) {
            const buttonId = clickedButton.id;
            const cardId = this.getCardIdByButtonUniqueId(buttonId);
            console.log(`[DEBUG] Clicked Button ID: ${buttonId}, Card ID: ${cardId}`);
            this.saveCurrentClickedButtonId(cardId);
            this.saveClickedCardCount(cardId);

            return clickedButton;
        }
        return null;
    }

    public async onMouseDown(event: MouseEvent): Promise<BlockAddButton | null> {
        if (event.button === 0) {
            const clickPoint = { x: event.clientX, y: event.clientY };
            return await this.handleButtonClick(clickPoint);
        }
        return null;
    }

    public getAllButtons(): BlockAddButton[] {
        return this.blockAddButtonRepository.findAllButtons();
    }

    public getCardIdByButtonUniqueId(buttonUniqueId: number): number {
        return this.blockAddButtonRepository.findCardIdByButtonId(buttonUniqueId) ?? -1;
    }

    public saveCurrentClickedButtonId(cardId: number): void {
        this.blockAddButtonClickDetectRepository.saveCurrentClickedButtonId(cardId);
    }

    public getCurrentClickedButtonId(): number | null {
        return this.blockAddButtonClickDetectRepository.findCurrentClickedButtonId();
    }

    private getButtonCardIdList(): number[] {
        return this.blockAddButtonRepository.findCardIdList();
    }

    // + 버튼을 클릭해서 카드를 추가하면 개수도 증가해야 함.
    private saveClickedCardCount(cardId: number): void {
        const ownedCardCount = this.makeDeckScreenCardRepository.findCardCountByCardId(cardId);
        const currentSelectedCardCount = this.cardCountManager.getCardClickCount(cardId);

        const card = getCardById(cardId);
        if (!card) {
            throw new Error(`Card with ID ${cardId} not found`);
        }
        const grade = Number(card.등급);
        const maxSelectableCardCountByGrade = this.cardCountManager.getMaxClickCountByGrade(grade);
        const currentSelectedCardCountByGrade = this.cardCountManager.getGradeClickCount(grade);

        // 등급별 제한 검사
        if (currentSelectedCardCountByGrade >= maxSelectableCardCountByGrade) {
            console.warn(`[DEBUG] Grade limit exceeded (grade: ${grade}, max count: ${maxSelectableCardCountByGrade})`);
            this.showPopupMessage("You can no longer select cards of this grade.");
            return;
        }

        // 사용자가 소지한 개수 제한 검사
        if (ownedCardCount !== null && currentSelectedCardCount >= ownedCardCount) {
            console.warn(`[DEBUG] User Owned Card Not Enough: ${cardId} (Owned Card Count: ${ownedCardCount})`);
            this.showPopupMessage("You do not have enough cards.");
            return;
        }

        // 선택 횟수 증가
        this.cardCountManager.incrementCardClickCount(cardId);
        this.cardCountManager.incrementGradeClickCount(grade);
    }

    // 팝업 메시지 처리: 후에 UI에 표현할 예정
    private showPopupMessage(message: string): void {
        console.log(`[POPUP] ${message}`);
    }

}
