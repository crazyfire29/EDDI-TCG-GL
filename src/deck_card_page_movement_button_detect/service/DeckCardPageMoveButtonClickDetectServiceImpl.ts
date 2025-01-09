import {DeckCardPageMoveButtonClickDetectService} from "./DeckCardPageMoveButtonClickDetectService";

import {MyDeckCardPageMovementButtonRepositoryImpl} from "../../my_deck_card_page_movement_button/repository/MyDeckCardPageMovementButtonRepositoryImpl";
import {MyDeckCardPageMovementButtonRepository} from "../../my_deck_card_page_movement_button/repository/MyDeckCardPageMovementButtonRepository";
import {MyDeckCardPageMovementButton} from "../../my_deck_card_page_movement_button/entity/MyDeckCardPageMovementButton";

import {DeckCardPageMoveButtonClickDetectRepositoryImpl} from "../repository/DeckCardPageMoveButtonClickDetectRepositoryImpl";
import {DeckCardPageMoveButtonClickDetectRepository} from "../repository/DeckCardPageMoveButtonClickDetectRepository";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

import * as THREE from "three";

export class DeckCardPageMoveButtonClickDetectServiceImpl implements DeckCardPageMoveButtonClickDetectService {
    private static instance: DeckCardPageMoveButtonClickDetectServiceImpl | null = null;

    private myDeckCardPageMovementButtonRepository: MyDeckCardPageMovementButtonRepositoryImpl;
    private deckCardPageMoveButtonClickDetectRepository: DeckCardPageMoveButtonClickDetectRepositoryImpl;

    private cameraRepository: CameraRepository
    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.myDeckCardPageMovementButtonRepository = MyDeckCardPageMovementButtonRepositoryImpl.getInstance();
        this.deckCardPageMoveButtonClickDetectRepository = DeckCardPageMoveButtonClickDetectRepositoryImpl.getInstance();

        this.cameraRepository = CameraRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): DeckCardPageMoveButtonClickDetectServiceImpl {
        if (!DeckCardPageMoveButtonClickDetectServiceImpl.instance) {
            DeckCardPageMoveButtonClickDetectServiceImpl.instance = new DeckCardPageMoveButtonClickDetectServiceImpl(camera, scene);
        }
        return DeckCardPageMoveButtonClickDetectServiceImpl.instance;
    }

    setLeftMouseDown(state: boolean): void {
        this.leftMouseDown = state;
    }

    isLeftMouseDown(): boolean {
        return this.leftMouseDown;
    }

    async handleLeftClick(
        clickPoint: { x: number; y: number },
    ): Promise<MyDeckCardPageMovementButton | null> {
        const { x, y } = clickPoint;

        const deckCardPageMoveButtonList = this.getAllMovementButton();
        const clickedDeckCardPageMovementButton = this.deckCardPageMoveButtonClickDetectRepository.isDeckCardPageMoveButtonClicked(
            { x, y },
            deckCardPageMoveButtonList,
            this.camera
        );
        if (clickedDeckCardPageMovementButton) {
            console.log(`Clicked Deck Page Movement Button ID: ${clickedDeckCardPageMovementButton.id}`);

            if (clickedDeckCardPageMovementButton.id === 0) {
                console.log(`Clicked Pre Page Button!`);
            }

            if (clickedDeckCardPageMovementButton.id === 1) {
                console.log(`Clicked Next Page Button!`);
            }
            return clickedDeckCardPageMovementButton;
        }

        return null;
    }

    public async onMouseDown(event: MouseEvent): Promise<void> {
        if (event.button === 0) {
            const clickPoint = { x: event.clientX, y: event.clientY };
            await this.handleLeftClick(clickPoint);
        }
    }

    private getAllMovementButton(): MyDeckCardPageMovementButton[] {
        return this.myDeckCardPageMovementButtonRepository.findAll();
    }

}
