import * as THREE from 'three';
import { MyDeckButtonRepository } from './MyDeckButtonRepository';
import {MyDeckButton} from "../entity/MyDeckButton";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MyDeckButtonType} from "../entity/MyDeckButtonType";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";

export class MyDeckButtonRepositoryImpl implements MyDeckButtonRepository {
    private static instance: MyDeckButtonRepositoryImpl;
    private buttonMap: Map<number, MyDeckButton> = new Map();
    private textureManager: TextureManager;

    private readonly BUTTON_WIDTH: number = 350 / 1920
    private readonly BUTTON_HEIGHT: number = 90 / 1080

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): MyDeckButtonRepositoryImpl {
        if (!MyDeckButtonRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            MyDeckButtonRepositoryImpl.instance = new MyDeckButtonRepositoryImpl(textureManager);
        }
        return MyDeckButtonRepositoryImpl.instance;
    }

    public async createMyDeckButton(
        type: MyDeckButtonType,
        position: Vector2d
    ): Promise<MyDeckButton> {
        const texture = await this.textureManager.getTexture('my_deck_buttons', type);

        if (!texture) {
            console.error('Failed to load texture for type:', type);
            throw new Error('MyDeckButton texture not found.');
        }

        const buttonWidth = this.BUTTON_WIDTH * window.innerWidth;
        const buttonHeight = this.BUTTON_HEIGHT * window.innerHeight;

        const buttonPositionX = position.getX() * window.innerWidth;
        const buttonPositionY = position.getY() * window.innerHeight;

        const buttonMesh = MeshGenerator.createMesh(texture, buttonWidth, buttonHeight, position);
        buttonMesh.position.set(buttonPositionX, buttonPositionY, 0);

        const newButton = new MyDeckButton(type, buttonWidth, buttonHeight, buttonMesh, position);
        this.buttonMap.set(newButton.id, newButton);

        return newButton;
    }

    public getAllMyDeckButtons(): Map<number, MyDeckButton> {
        return this.buttonMap;
    }

    public findById(id: number): MyDeckButton | null {
        return this.buttonMap.get(id) || null;
    }

    public findAll(): MyDeckButton[] {
        return Array.from(this.buttonMap.values());
    }

    public deleteById(id: number): void {
        this.buttonMap.delete(id);
    }

    public deleteAll(): void {
        this.buttonMap.clear();
    }
}
