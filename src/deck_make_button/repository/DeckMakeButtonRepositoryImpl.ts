import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

import {DeckMakeButtonRepository} from './DeckMakeButtonRepository';
import {DeckMakeButton} from "../entity/DeckMakeButton";
import {TransparentRectangle} from "../../shape/TransparentRectangle";

export class DeckMakeButtonRepositoryImpl implements DeckMakeButtonRepository {
    private static instance: DeckMakeButtonRepositoryImpl;
    private button: DeckMakeButton | null;

    private readonly BUTTON_WIDTH: number = 276 / 1920
    private readonly BUTTON_HEIGHT: number = 60 / 1080
    private readonly POSITION_X: number = -802 / 1920
    private readonly POSITION_Y: number = 505 / 1080

    private constructor() {
        this.button = null;
    }

    public static getInstance(): DeckMakeButtonRepositoryImpl {
        if (!DeckMakeButtonRepositoryImpl.instance) {
            DeckMakeButtonRepositoryImpl.instance = new DeckMakeButtonRepositoryImpl();
        }
        return DeckMakeButtonRepositoryImpl.instance;
    }

    public async createDeckMakeButton(
        id: string,
    ): Promise<DeckMakeButton> {

        const buttonWidth = this.BUTTON_WIDTH * window.innerWidth;
        const buttonHeight = this.BUTTON_HEIGHT * window.innerHeight;

        const positionX = this.POSITION_X * window.innerWidth;
        const positionY = this.POSITION_Y * window.innerHeight;
        const position = new THREE.Vector2(positionX, positionY);

        const button = new TransparentRectangle(position, buttonWidth, buttonHeight, 0xffffff, 0.5, id);
        const buttonMesh = button.getMesh();

        const newButton = new DeckMakeButton(buttonMesh, position);
        this.button = newButton;

        return newButton;
    }


    public findButton(): DeckMakeButton | null {
        return this.button;
    }

    public deleteButton(): void {
        this.button = null;
    }
}
