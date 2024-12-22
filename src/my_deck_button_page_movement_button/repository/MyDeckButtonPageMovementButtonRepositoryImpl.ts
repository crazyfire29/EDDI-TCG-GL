import * as THREE from 'three';
import { MyDeckButtonPageMovementButtonRepository } from './MyDeckButtonPageMovementButtonRepository';
import {MyDeckButtonPageMovementButton} from "../entity/MyDeckButtonPageMovementButton";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MyDeckButtonPageMovementButtonType} from "../entity/MyDeckButtonPageMovementButtonType";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";

export class MyDeckButtonPageMovementButtonRepositoryImpl implements MyDeckButtonPageMovementButtonRepository {
    private static instance: MyDeckButtonPageMovementButtonRepositoryImpl;
    private buttonMap: Map<number, MyDeckButtonPageMovementButton> = new Map();
    private textureManager: TextureManager;

    private readonly BUTTON_WIDTH: number = 45 / 1920
    private readonly BUTTON_HEIGHT: number = 44 / 1080

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): MyDeckButtonPageMovementButtonRepositoryImpl {
        if (!MyDeckButtonPageMovementButtonRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            MyDeckButtonPageMovementButtonRepositoryImpl.instance = new MyDeckButtonPageMovementButtonRepositoryImpl(textureManager);
        }
        return MyDeckButtonPageMovementButtonRepositoryImpl.instance;
    }

    public async createMyDeckButtonPageMovementButton(
        type: MyDeckButtonPageMovementButtonType,
        position: Vector2d
    ): Promise<MyDeckButtonPageMovementButton> {
        const texture = await this.textureManager.getTexture('deck_page_movement_buttons', type);

        if (!texture) {
            console.error('Failed to load texture for type:', type);
            throw new Error('MyDeckButtonPageMovementButton texture not found.');
        }

        const buttonWidth = this.BUTTON_WIDTH * window.innerWidth;
        const buttonHeight = this.BUTTON_HEIGHT * window.innerHeight;

        const buttonMesh = MeshGenerator.createMesh(texture, buttonWidth, buttonHeight, position);

        const newButton = new MyDeckButtonPageMovementButton(type, buttonMesh, position);
        this.buttonMap.set(newButton.id, newButton);

        return newButton;
    }

    public findById(id: number): MyDeckButtonPageMovementButton | null {
        return this.buttonMap.get(id) || null;
    }

    public findAll(): MyDeckButtonPageMovementButton[] {
        return Array.from(this.buttonMap.values());
    }

    public deleteById(id: number): void {
        this.buttonMap.delete(id);
    }

    public deleteAll(): void {
        this.buttonMap.clear();
    }
}
