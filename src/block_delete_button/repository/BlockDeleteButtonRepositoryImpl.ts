import * as THREE from 'three';
import {BlockDeleteButtonRepository} from './BlockDeleteButtonRepository';
import {BlockDeleteButton} from "../entity/BlockDeleteButton";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";

export class BlockDeleteButtonRepositoryImpl implements BlockDeleteButtonRepository {
    private static instance: BlockDeleteButtonRepositoryImpl;
    private buttonMap: Map<number, { cardId: number, buttonMesh: BlockDeleteButton }> = new Map(); // button unique id: {card id: mesh}
    private textureManager: TextureManager;

    private readonly BUTTON_WIDTH: number = 0.045
    private readonly BUTTON_HEIGHT: number = 0.07

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): BlockDeleteButtonRepositoryImpl {
        if (!BlockDeleteButtonRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            BlockDeleteButtonRepositoryImpl.instance = new BlockDeleteButtonRepositoryImpl(textureManager);
        }
        return BlockDeleteButtonRepositoryImpl.instance;
    }

    public async createBlockDeleteButton(clickedCardId: number, position: Vector2d): Promise<BlockDeleteButton> {

        const texture = await this.textureManager.getTexture('block_add_delete_button', 2);
        if (!texture) {
            throw new Error(`Texture for Block Delete Button not found`);
        }

        const buttonWidth = this.BUTTON_WIDTH * window.innerWidth;
        const buttonHeight = this.BUTTON_HEIGHT * window.innerHeight;

        const buttonPositionX = position.getX() * window.innerWidth;
        const buttonPositionY = position.getY() * window.innerHeight;

        const buttonMesh = MeshGenerator.createMesh(texture, buttonWidth, buttonHeight, position);
        buttonMesh.position.set(buttonPositionX, buttonPositionY, 0);

        const newButton = new BlockDeleteButton(buttonMesh, position);
        this.buttonMap.set(newButton.id, { cardId: clickedCardId, buttonMesh: newButton });

        return newButton;
    }

    public findButtonByButtonId(buttonId: number): BlockDeleteButton | null {
        const button = this.buttonMap.get(buttonId);
        if (button) {
            return button.buttonMesh;
        } else {
            return null;
        }
    }

    public findButtonByCardId(cardId: number): BlockDeleteButton | null {
        for (const { cardId: storedCardId, buttonMesh } of this.buttonMap.values()) {
            if (storedCardId === cardId) {
                return buttonMesh;
            }
        }
        return null;
    }

    public findAllButtons(): BlockDeleteButton[] {
        return Array.from(this.buttonMap.values()).map(({ buttonMesh }) => buttonMesh);
    }

    public findButtonIdByCardId(cardId: number): number | null {
        for (const [buttonId, { cardId: storedCardId }] of this.buttonMap.entries()) {
            if (storedCardId === cardId) {
                return buttonId;
            }
        }
        return null;
    }

    public findCardIdList(): number[] {
        return Array.from(this.buttonMap.values()).map(({ cardId }) => cardId);
    }

    public deleteAllButton(): void {
        this.buttonMap.clear();
    }

    public deleteButtonByButtonId(buttonId: number): void {
        this.buttonMap.delete(buttonId);

        // 기존 데이터를 배열로 변환 후 정렬된 새로운 Map 생성
        const newButtonMap = new Map<number, { cardId: number, buttonMesh: BlockDeleteButton }>();
        let newButtonId = 0;

        for (const { cardId, buttonMesh } of this.buttonMap.values()) {
            newButtonMap.set(newButtonId++, { cardId, buttonMesh });
        }

        this.buttonMap = newButtonMap; // 새로운 맵으로 교체
    }

    public hideButton(cardId: number): void {
        const button = this.findButtonByCardId(cardId);
        if (button) {
            button.getMesh().visible = false;
        }
    }

    public showButton(cardId: number): void {
        const button = this.findButtonByCardId(cardId);
        if (button) {
            button.getMesh().visible = true;
        }
    }

}
