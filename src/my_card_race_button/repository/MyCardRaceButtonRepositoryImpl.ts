import * as THREE from 'three';
import {MyCardRaceButtonRepository} from './MyCardRaceButtonRepository';
import {MyCardRaceButton} from "../entity/MyCardRaceButton";
import {TextureManager} from "../../texture_manager/TextureManager";
import {CardRace} from "../../card/race";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";

export class MyCardRaceButtonRepositoryImpl implements MyCardRaceButtonRepository {
    private static instance: MyCardRaceButtonRepositoryImpl;
    private buttonMap: Map<number, MyCardRaceButton> = new Map();
    private textureManager: TextureManager;

    private readonly BUTTON_WIDTH: number = 0.068
    private readonly BUTTON_HEIGHT: number = 0.131

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): MyCardRaceButtonRepositoryImpl {
        if (!MyCardRaceButtonRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            MyCardRaceButtonRepositoryImpl.instance = new MyCardRaceButtonRepositoryImpl(textureManager);
        }
        return MyCardRaceButtonRepositoryImpl.instance;
    }

    public async createRaceButton(type: CardRace, position: Vector2d): Promise<MyCardRaceButton> {
        const texture = await this.textureManager.getTexture('my_card_race_button', type);

        if (!texture) {
            console.error('Failed to load texture for type:', type);
            throw new Error('My Card Race Button texture not found.');
        }

        const buttonWidth = this.BUTTON_WIDTH * window.innerWidth;
        const buttonHeight = this.BUTTON_HEIGHT * window.innerHeight;

        const buttonPositionX = position.getX() * window.innerWidth;
        const buttonPositionY = position.getY() * window.innerHeight;

        const buttonMesh = MeshGenerator.createMesh(texture, buttonWidth, buttonHeight, position);
        buttonMesh.position.set(buttonPositionX, buttonPositionY, 0);

        const newButton = new MyCardRaceButton(type, buttonWidth, buttonHeight, buttonMesh, position);
        this.buttonMap.set(newButton.id, newButton);

        return newButton;
    }

    public findButtonById(id: number): MyCardRaceButton | null {
        return this.buttonMap.get(id) || null;
    }

    public findAllButton(): MyCardRaceButton[] {
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
        const raceButton = this.findButtonById(buttonId);
        if (raceButton) {
            raceButton.getMesh().visible = false;
        }
    }

    public showButton(buttonId: number): void {
        const raceButton = this.findButtonById(buttonId);
        if (raceButton) {
            raceButton.getMesh().visible = true;
        }
    }
}
