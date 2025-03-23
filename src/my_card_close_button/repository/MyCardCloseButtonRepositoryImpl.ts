import * as THREE from 'three';
import {MyCardCloseButtonRepository} from './MyCardCloseButtonRepository';
import {MyCardCloseButton} from "../entity/MyCardCloseButton";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";

export class MyCardCloseButtonRepositoryImpl implements MyCardCloseButtonRepository {
    private static instance: MyCardCloseButtonRepositoryImpl;
    private buttonMap: Map<number, MyCardCloseButton> = new Map();
    private textureManager: TextureManager;

    private readonly BUTTON_WIDTH: number = 0.032
    private readonly BUTTON_HEIGHT: number = 0.06227

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): MyCardCloseButtonRepositoryImpl {
        if (!MyCardCloseButtonRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            MyCardCloseButtonRepositoryImpl.instance = new MyCardCloseButtonRepositoryImpl(textureManager);
        }
        return MyCardCloseButtonRepositoryImpl.instance;
    }

    public async createCloseButton(type: number, position: Vector2d): Promise<MyCardCloseButton> {
        const texture = await this.textureManager.getTexture('my_card_close_button', type);

        if (!texture) {
            console.error('Failed to load texture for type:', type);
            throw new Error('My Card Close Button texture not found.');
        }

        const buttonWidth = this.BUTTON_WIDTH * window.innerWidth;
        const buttonHeight = this.BUTTON_HEIGHT * window.innerHeight;

        const buttonPositionX = position.getX() * window.innerWidth;
        const buttonPositionY = position.getY() * window.innerHeight;

        const buttonMesh = MeshGenerator.createMesh(texture, buttonWidth, buttonHeight, position);
        buttonMesh.position.set(buttonPositionX, buttonPositionY, 0);

        const newButton = new MyCardCloseButton(type, buttonWidth, buttonHeight, buttonMesh, position);
        this.buttonMap.set(newButton.id, newButton);

        return newButton;
    }

    public findButtonById(id: number): MyCardCloseButton | null {
        return this.buttonMap.get(id) || null;
    }

    public findAllButton(): MyCardCloseButton[] {
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
        const closeButton = this.findButtonById(buttonId);
        if (closeButton) {
            closeButton.getMesh().visible = false;
        }
    }

    public showButton(buttonId: number): void {
        const closeButton = this.findButtonById(buttonId);
        if (closeButton) {
            closeButton.getMesh().visible = true;
        }
    }
}
