import * as THREE from 'three';
import { MyDeckButtonEffectRepository } from './MyDeckButtonEffectRepository';
import {MyDeckButtonEffect} from "../entity/MyDeckButtonEffect";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";

export class MyDeckButtonEffectRepositoryImpl implements MyDeckButtonEffectRepository {
    private static instance: MyDeckButtonEffectRepositoryImpl;
    private buttonMap: Map<number, MyDeckButtonEffect> = new Map();
    private textureManager: TextureManager;

    private readonly BUTTON_WIDTH: number = 350 / 1920
    private readonly BUTTON_HEIGHT: number = 90 / 1080

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): MyDeckButtonEffectRepositoryImpl {
        if (!MyDeckButtonEffectRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            MyDeckButtonEffectRepositoryImpl.instance = new MyDeckButtonEffectRepositoryImpl(textureManager);
        }
        return MyDeckButtonEffectRepositoryImpl.instance;
    }

    public async createMyDeckButtonEffect(deckId: number, position: Vector2d): Promise<MyDeckButtonEffect> {
        const texture = await this.textureManager.getTexture('my_deck_buttons', 1);

        if (!texture) {
            throw new Error('MyDeckButtonEffect texture not found.');
        }

        const buttonWidth = this.BUTTON_WIDTH * window.innerWidth;
        const buttonHeight = this.BUTTON_HEIGHT * window.innerHeight;

        const buttonPositionX = position.getX() * window.innerWidth;
        const buttonPositionY = position.getY() * window.innerHeight;

        const buttonMesh = MeshGenerator.createMesh(texture, buttonWidth, buttonHeight, position);
        buttonMesh.position.set(buttonPositionX, buttonPositionY, 0);

        const newButtonEffect = new MyDeckButtonEffect(buttonWidth, buttonHeight, buttonMesh, position);
        this.buttonMap.set(deckId, newButtonEffect);

        return newButtonEffect;
    }

    public getAllMyDeckButtonEffect(): Map<number, MyDeckButtonEffect> {
        return this.buttonMap;
    }

    public findById(id: number): MyDeckButtonEffect | null {
        return this.buttonMap.get(id) || null;
    }

    public findAll(): MyDeckButtonEffect[] {
        return Array.from(this.buttonMap.values());
    }

    public deleteById(id: number): void {
        this.buttonMap.delete(id);
    }

    public deleteAll(): void {
        this.buttonMap.clear();
    }

    hideById(id: number): boolean {
        const button = this.findById(id);
        if (button) {
            button.getMesh().visible = false;
            return true;
        }
        return false;
    }

    showById(id: number): boolean {
        const button = this.findById(id);
        if (button) {
            button.getMesh().visible = true;
            return true;
        }
        return false;
    }
}
