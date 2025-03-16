import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

import {BlockDeleteButtonService} from "./BlockDeleteButtonService";
import {BlockDeleteButton} from "../entity/BlockDeleteButton";
import {BlockDeleteButtonRepositoryImpl} from "../repository/BlockDeleteButtonRepositoryImpl";

import {BlockDeleteButtonPositionRepositoryImpl} from "../../block_delete_button_position/repository/BlockDeleteButtonPositionRepositoryImpl";
import {BlockDeleteButtonPosition} from "../../block_delete_button_position/entity/BlockDeleteButtonPosition";
import {SelectedCardBlockPositionRepositoryImpl} from "../../selected_card_block_position/repository/SelectedCardBlockPositionRepositoryImpl";
import {SelectedCardBlockPosition} from "../../selected_card_block_position/entity/SelectedCardBlockPosition";

export class BlockDeleteButtonServiceImpl implements BlockDeleteButtonService {
    private static instance: BlockDeleteButtonServiceImpl;
    private blockDeleteButtonRepository: BlockDeleteButtonRepositoryImpl;
    private blockDeleteButtonPositionRepository: BlockDeleteButtonPositionRepositoryImpl;
    private selectedCardBlockPositionRepository: SelectedCardBlockPositionRepositoryImpl;

    private constructor() {
        this.blockDeleteButtonRepository = BlockDeleteButtonRepositoryImpl.getInstance();
        this.blockDeleteButtonPositionRepository = BlockDeleteButtonPositionRepositoryImpl.getInstance();
        this.selectedCardBlockPositionRepository = SelectedCardBlockPositionRepositoryImpl.getInstance();
    }

    public static getInstance(): BlockDeleteButtonServiceImpl {
        if (!BlockDeleteButtonServiceImpl.instance) {
            BlockDeleteButtonServiceImpl.instance = new BlockDeleteButtonServiceImpl();
        }
        return BlockDeleteButtonServiceImpl.instance;
    }

    public async createBlockDeleteButtonWithPosition(cardId: number): Promise<THREE.Group | null> {
        const buttonGroup = new THREE.Group();

        try {
            const existingPosition = this.getPositionByCardId(cardId);
            const existingButtonMesh = this.getButtonMeshByCardId(cardId);

            if (existingPosition && existingButtonMesh) {
                const positionX = existingPosition.getX() * window.innerWidth;
                const positionY = existingPosition.getY() * window.innerHeight;

                existingButtonMesh.position.set(positionX, positionY, 0);
                buttonGroup.add(existingButtonMesh);
            } else {
                const position = this.blockDeleteButtonPosition(cardId);
                console.log(`[DEBUG] Delete Button CardId ${cardId}: Position X=${position.position.getX()}, Y=${position.position.getY()}`);

                const button = await this.createBlockDeleteButton(cardId, position.position);
                buttonGroup.add(button.getMesh());
            }
        } catch (error) {
            console.error(`[Error] Failed to create Button: ${error}`);
            return null;
        }
        return buttonGroup;
    }

    public adjustBlockDeleteButtonPosition(): void {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const cardIdList = this.getCardIdsFromButtons();
        for (const cardId of cardIdList) {
            const buttonMesh = this.getButtonMeshByCardId(cardId);
            if (!buttonMesh) {
                console.warn(`[WARN] Button Mesh with card ID ${cardId} not found`);
                continue;
            }

            const initialPosition = this.getPositionByCardId(cardId);
            if (!initialPosition) {
                console.error(`[DEBUG] (adjust) No Button Position found for card id: ${cardId}`);
                continue;
            }
            console.log(`[DEBUG] (adjust) Button InitialPosition: ${initialPosition}`);

            const buttonWidth = 0.045 * window.innerWidth;
            const buttonHeight = 0.07 * window.innerHeight;

            const newPositionX = initialPosition.getX() * windowWidth;
            const newPositionY = initialPosition.getY() * windowHeight;
            console.log(`[DEBUG] (adjust) Button ${cardId}:`, {
                initialPosition: initialPosition,
                newPositionX,
                newPositionY,
            });

            buttonMesh.geometry.dispose();
            buttonMesh.geometry = new THREE.PlaneGeometry(buttonWidth, buttonHeight);
            buttonMesh.position.set(newPositionX, newPositionY, 0);
        }
    }

    private async createBlockDeleteButton(cardId: number, position: Vector2d): Promise<BlockDeleteButton> {
        return await this.blockDeleteButtonRepository.createBlockDeleteButton(cardId, position);
    }

    private blockDeleteButtonPosition(cardId: number): BlockDeleteButtonPosition {
        const positionY = this.getSelectedCardBlockPositionY(cardId);
        if (positionY !== null) {
            return this.blockDeleteButtonPositionRepository.addBlockDeleteButtonPosition(cardId, positionY);
        }
        throw new Error(`No valid position found for cardId: ${cardId}`);
    }

    private getSelectedCardBlockPositionY(clickedCardId: number): number | null {
        const blockPosition = this.selectedCardBlockPositionRepository.findPositionByCardId(clickedCardId);
        if(!blockPosition) {
            console.warn(`[WARN] block Position (ID: ${clickedCardId}) not found`);
            return null;
        }
        const positionY = blockPosition.getY();
        return positionY;
    }

    private getCardIdsFromButtons(): number[] {
        return this.blockDeleteButtonRepository.findCardIdList();
    }

    public getButtonMeshByCardId(cardId: number): THREE.Mesh | null {
        const button = this.blockDeleteButtonRepository.findButtonByCardId(cardId);
        if (!button) {
            console.warn(`[WARN] button (with card ID: ${cardId}) not found`);
            return null;
        }
        return button.getMesh();
    }

    private getPositionByCardId(cardId: number): BlockDeleteButtonPosition | null {
        return this.blockDeleteButtonPositionRepository.findPositionByCardId(cardId) || null;
    }

    public getAllButtonMesh(): BlockDeleteButton[] {
        return this.blockDeleteButtonRepository.findAllButtons();
    }

    public getButtonCardIdList(): number[] {
        return this.blockDeleteButtonRepository.findCardIdList();
    }

    public getButtonGroup(): THREE.Group {
        return this.blockDeleteButtonRepository.findButtonGroup();
    }

    public resetButtonGroup(): void {
        this.blockDeleteButtonRepository.resetButtonGroup();
    }

}
