import * as THREE from 'three';
import {RaceButtonRepository} from './RaceButtonRepository';
import {RaceButton} from "../entity/RaceButton";
import {TextureManager} from "../../texture_manager/TextureManager";
import {CardRace} from "../../card/race";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";

export class RaceButtonRepositoryImpl implements RaceButtonRepository {
    private static instance: RaceButtonRepositoryImpl;
    private buttonMap: Map<number, RaceButton> = new Map();
    private textureManager: TextureManager;

    private readonly BUTTON_WIDTH: number = 96 / 1920
    private readonly BUTTON_HEIGHT: number = 94 / 1080

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): RaceButtonRepositoryImpl {
        if (!RaceButtonRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            RaceButtonRepositoryImpl.instance = new RaceButtonRepositoryImpl(textureManager);
        }
        return RaceButtonRepositoryImpl.instance;
    }

    public async createRaceButton(
        type: CardRace,
        position: Vector2d
    ): Promise<RaceButton> {
        const texture = await this.textureManager.getTexture('race_button', type);

        if (!texture) {
            console.error('Failed to load texture for type:', type);
            throw new Error('Race Button texture not found.');
        }

        const buttonWidth = this.BUTTON_WIDTH * window.innerWidth;
        const buttonHeight = this.BUTTON_HEIGHT * window.innerHeight;

        const buttonPositionX = position.getX() * window.innerWidth;
        const buttonPositionY = position.getY() * window.innerHeight;

        const buttonMesh = MeshGenerator.createMesh(texture, buttonWidth, buttonHeight, position);
        buttonMesh.position.set(buttonPositionX, buttonPositionY, 0);

        const newButton = new RaceButton(type, buttonWidth, buttonHeight, buttonMesh, position);
        this.buttonMap.set(newButton.id, newButton);

        return newButton;
    }

    public findById(id: number): RaceButton | null {
        return this.buttonMap.get(id) || null;
    }

    public findAll(): RaceButton[] {
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

    public hideRaceButton(buttonId: number): void {
        const raceButton = this.findById(buttonId);
        if (raceButton) {
            raceButton.getMesh().visible = false;
        }
    }

    public showRaceButton(buttonId: number): void {
        const raceButton = this.findById(buttonId);
        if (raceButton) {
            raceButton.getMesh().visible = true;
        }
    }
}
