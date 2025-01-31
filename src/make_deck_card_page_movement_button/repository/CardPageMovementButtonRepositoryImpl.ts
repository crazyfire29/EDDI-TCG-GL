import * as THREE from 'three';
import {CardPageMovementButtonRepository} from './CardPageMovementButtonRepository';
import {CardPageMovementButton} from "../entity/CardPageMovementButton";
import {CardPageMovementButtonType} from "../entity/CardPageMovementButtonType";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";

export class CardPageMovementButtonRepositoryImpl implements CardPageMovementButtonRepository {
    private static instance: CardPageMovementButtonRepositoryImpl;
    private buttonMap: Map<number, CardPageMovementButton> = new Map();
    private textureManager: TextureManager;

    private readonly BUTTON_WIDTH: number = 110 / 1920
    private readonly BUTTON_HEIGHT: number = 130 / 1080

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): CardPageMovementButtonRepositoryImpl {
        if (!CardPageMovementButtonRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            CardPageMovementButtonRepositoryImpl.instance = new CardPageMovementButtonRepositoryImpl(textureManager);
        }
        return CardPageMovementButtonRepositoryImpl.instance;
    }

    public async createCardPageMovementButton(
        type: CardPageMovementButtonType,
        position: Vector2d
    ): Promise<CardPageMovementButton> {
        const texture = await this.textureManager.getTexture('make_deck_card_page_movement_buttons', type);

        if (!texture) {
            console.error('Failed to load texture for type:', type);
            throw new Error('Page Movement Button texture not found.');
        }

        const buttonWidth = this.BUTTON_WIDTH * window.innerWidth;
        const buttonHeight = this.BUTTON_HEIGHT * window.innerHeight;

        const buttonPositionX = position.getX() * window.innerWidth;
        const buttonPositionY = position.getY() * window.innerHeight;

        const buttonMesh = MeshGenerator.createMesh(texture, buttonWidth, buttonHeight, position);
        buttonMesh.position.set(buttonPositionX, buttonPositionY, 0);

        const newButton = new CardPageMovementButton(type, buttonWidth, buttonHeight, buttonMesh, position);
        this.buttonMap.set(newButton.id, newButton);

        return newButton;
    }

    public findById(id: number): CardPageMovementButton | null {
        return this.buttonMap.get(id) || null;
    }

    public findAll(): CardPageMovementButton[] {
        return Array.from(this.buttonMap.values());
    }

    public deleteById(id: number): void {
        this.buttonMap.delete(id);
    }

    public deleteAll(): void {
        this.buttonMap.clear();
    }

    public findAllButtonIds(): number[] {
        return Array.from(this.buttonMap.keys());
    }

    public hideButton(buttonId: number): void {
        const button = this.findById(buttonId);
        if (button) {
            button.getMesh().visible = false;
        }
    }

    public showButton(buttonId: number): void {
        const button = this.findById(buttonId);
        if (button) {
            button.getMesh().visible = true;
        }
    }
}
