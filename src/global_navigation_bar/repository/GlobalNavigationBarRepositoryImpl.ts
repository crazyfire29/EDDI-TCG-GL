import * as THREE from 'three';
import {GlobalNavigationBarRepository} from './GlobalNavigationBarRepository';
import {GlobalNavigationBar} from "../entity/GlobalNavigationBar";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";
import {getCardById} from "../../card/utility";

export class GlobalNavigationBarRepositoryImpl implements GlobalNavigationBarRepository {
    private static instance: GlobalNavigationBarRepositoryImpl;
    private buttonMap: Map<number, GlobalNavigationBar > = new Map();
    private textureManager: TextureManager;

    private readonly BUTTON_WIDTH: number = 0.05
    private readonly BUTTON_HEIGHT: number = 0.058378

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): GlobalNavigationBarRepositoryImpl {
        if (!GlobalNavigationBarRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            GlobalNavigationBarRepositoryImpl.instance = new GlobalNavigationBarRepositoryImpl(textureManager);
        }
        return GlobalNavigationBarRepositoryImpl.instance;
    }

    public async createGlobalNavigationBar(type: number, position: Vector2d): Promise<GlobalNavigationBar> {
        const texture = await this.textureManager.getTexture('global_navigation_bar', type);
        if (!texture) {
            throw new Error(`Texture for Button type: ${type} not found`);
        }

        const buttonWidth = this.BUTTON_WIDTH * window.innerWidth;
//         const buttonHeight = this.BUTTON_HEIGHT * window.innerHeight;
        const buttonHeight = buttonWidth * 0.6;

        const buttonPositionX = position.getX() * window.innerWidth;
        const buttonPositionY = position.getY() * window.innerHeight;

        const buttonMesh = MeshGenerator.createMesh(texture, buttonWidth, buttonHeight, position);
        buttonMesh.position.set(buttonPositionX, buttonPositionY, 0);

        const newButton = new GlobalNavigationBar(buttonMesh, this.BUTTON_WIDTH, this.BUTTON_HEIGHT, position);
        this.buttonMap.set(newButton.id, newButton);

        return newButton;
    }

    public findButtonById(buttonId: number): GlobalNavigationBar | null {
        return this.buttonMap.get(buttonId) || null;
    }

    public findAllButton(): GlobalNavigationBar[] {
        return Array.from(this.buttonMap.values());
    }

    public deleteButtonById(id: number): void {
        this.buttonMap.delete(id);
    }

    public deleteAllButton(): void {
        this.buttonMap.clear();
    }

    public findAllButtonIdList(): number[] {
        return Array.from(this.buttonMap.keys());
    }

    public hideButton(buttonId: number): void {
        const button = this.findButtonById(buttonId);
        if (button) {
            button.getMesh().visible = false;
        }
    }

    public showButton(buttonId: number): void {
        const button = this.findButtonById(buttonId);
        if (button) {
            button.getMesh().visible = true;
        }
    }

}
