import * as THREE from 'three';
import {MakeDeckScreenDoneButtonRepository} from './MakeDeckScreenDoneButtonRepository';
import {MakeDeckScreenDoneButton} from "../entity/MakeDeckScreenDoneButton";
import {MakeDeckScreenDoneButtonType} from "../entity/MakeDeckScreenDoneButtonType";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";

export class MakeDeckScreenDoneButtonRepositoryImpl implements MakeDeckScreenDoneButtonRepository {
    private static instance: MakeDeckScreenDoneButtonRepositoryImpl;
    private buttonMap: Map<number, MakeDeckScreenDoneButton> = new Map();
    private textureManager: TextureManager;

    private readonly BUTTON_WIDTH: number = 450 / 1920
    private readonly BUTTON_HEIGHT: number = 140 / 1080

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): MakeDeckScreenDoneButtonRepositoryImpl {
        if (!MakeDeckScreenDoneButtonRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            MakeDeckScreenDoneButtonRepositoryImpl.instance = new MakeDeckScreenDoneButtonRepositoryImpl(textureManager);
        }
        return MakeDeckScreenDoneButtonRepositoryImpl.instance;
    }

    public async createDoneButton(
        type: MakeDeckScreenDoneButtonType,
        position: Vector2d
    ): Promise<MakeDeckScreenDoneButton> {
        const texture = await this.textureManager.getTexture('done_button', type);

        if (!texture) {
            console.error('Failed To Load Done Button Texture For Type:', type);
            throw new Error('Done Button texture not found.');
        }

        const buttonWidth = this.BUTTON_WIDTH * window.innerWidth;
        const buttonHeight = this.BUTTON_HEIGHT * window.innerHeight;

        const buttonPositionX = position.getX() * window.innerWidth;
        const buttonPositionY = position.getY() * window.innerHeight;

        const buttonMesh = MeshGenerator.createMesh(texture, buttonWidth, buttonHeight, position);
        buttonMesh.position.set(buttonPositionX, buttonPositionY, 0);

        const newButton = new MakeDeckScreenDoneButton(type, buttonWidth, buttonHeight, buttonMesh, position);
        this.buttonMap.set(newButton.id, newButton);

        return newButton;
    }

    public findById(id: number): MakeDeckScreenDoneButton | null {
        return this.buttonMap.get(id) || null;
    }

    public findAll(): MakeDeckScreenDoneButton[] {
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
