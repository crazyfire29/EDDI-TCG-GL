import * as THREE from 'three';
import {BlockAddButtonRepository} from './BlockAddButtonRepository';
import {BlockAddButton} from "../entity/BlockAddButton";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";

export class BlockAddButtonRepositoryImpl implements BlockAddButtonRepository {
    private static instance: BlockAddButtonRepositoryImpl;
    private buttonMap: Map<number, { cardId: number, buttonMesh: BlockAddButton }> = new Map(); // button unique id: {card id: mesh}
    private textureManager: TextureManager;
    private buttonGroup: THREE.Group | null = null;

    private readonly BUTTON_WIDTH: number = 0.045
    private readonly BUTTON_HEIGHT: number = 0.07

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): BlockAddButtonRepositoryImpl {
        if (!BlockAddButtonRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            BlockAddButtonRepositoryImpl.instance = new BlockAddButtonRepositoryImpl(textureManager);
        }
        return BlockAddButtonRepositoryImpl.instance;
    }

    public async createBlockAddButton(clickedCardId: number, position: Vector2d): Promise<BlockAddButton> {

        const texture = await this.textureManager.getTexture('block_add_delete_button', 1);
        if (!texture) {
            throw new Error(`Texture for Block Add Button not found`);
        }

        const buttonWidth = this.BUTTON_WIDTH * window.innerWidth;
        const buttonHeight = this.BUTTON_HEIGHT * window.innerHeight;

        const buttonPositionX = position.getX() * window.innerWidth;
        const buttonPositionY = position.getY() * window.innerHeight;

        const buttonMesh = MeshGenerator.createMesh(texture, buttonWidth, buttonHeight, position);
        buttonMesh.position.set(buttonPositionX, buttonPositionY, 0);

        const newButton = new BlockAddButton(buttonMesh, position);
        this.buttonMap.set(newButton.id, { cardId: clickedCardId, buttonMesh: newButton });

        return newButton;
    }

    public findButtonByButtonId(buttonId: number): BlockAddButton | null {
        const button = this.buttonMap.get(buttonId);
        if (button) {
            return button.buttonMesh;
        } else {
            return null;
        }
    }

    public findButtonByCardId(cardId: number): BlockAddButton | null {
        for (const { cardId: storedCardId, buttonMesh } of this.buttonMap.values()) {
            if (storedCardId === cardId) {
                return buttonMesh;
            }
        }
        return null;
    }

    public findAllButtons(): BlockAddButton[] {
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

    public findCardIdByButtonId(buttonId: number): number | null {
        const button = this.buttonMap.get(buttonId);
        if (button) {
            return button.cardId;
        } else {
            return null;
        }
    }

    public findCardIdList(): number[] {
        return Array.from(this.buttonMap.values()).map(({ cardId }) => cardId);
    }

    public deleteAllButton(): void {
        this.buttonMap.clear();
    }

    public deleteButtonByButtonId(buttonId: number): void {
        this.buttonMap.delete(buttonId);
    }

    public findButtonGroup(): THREE.Group {
        if (!this.buttonGroup) {
            this.buttonGroup = new THREE.Group();
            for (const { buttonMesh } of this.buttonMap.values()) {
                this.buttonGroup.add(buttonMesh.getMesh());
            }
        }
        return this.buttonGroup;
    }

    public resetButtonGroup(): void {
        this.buttonGroup = null;
    }

//     public deleteButtonByCardId(clickedCardId: number): void {
//         let buttonIdToDelete: number | null = null;
//
//         // 삭제할 버튼 ID 찾기
//         for (const [buttonId, { cardId }] of this.buttonMap.entries()) {
//             if (cardId === clickedCardId) {
//                 buttonIdToDelete = buttonId;
//                 break;
//             }
//         }
//
//         if (buttonIdToDelete !== null) {
//             this.buttonMap.delete(buttonIdToDelete);
//
//             // buttonMap 재정렬
//             const newButtonMap = new Map<number, { cardId: number, buttonMesh: BlockAddButton }>();
//             let newButtonId = 0;
//
//             for (const { cardId, buttonMesh } of this.buttonMap.values()) {
//                 newButtonMap.set(newButtonId++, { cardId, buttonMesh });
//             }
//
//             this.buttonMap = newButtonMap; // 새로운 맵으로 교체
//         }
//     }

    // 버튼은 생성될 때마다 고유 아이디가 자동으로 부여되기 때문에 재정렬 필요x
    public deleteButtonByCardId(clickedCardId: number): void {
        let buttonIdToDelete: number | null = null;

        // 삭제할 버튼 ID 찾기
        for (const [buttonId, { cardId }] of this.buttonMap.entries()) {
            if (cardId === clickedCardId) {
                buttonIdToDelete = buttonId;
                break;
            }
        }

        if (buttonIdToDelete !== null) {
            this.buttonMap.delete(buttonIdToDelete);
        }
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
